"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  FileText,
  History,
  LockKeyhole,
  MessageSquareText,
  Pencil,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { FIELD_STATE_LABELS, RETURN_STATUS_LABELS } from "@/mock-data/constants";
import type {
  AIOutput,
  Client,
  ReturnField,
  SourceDocument,
  TaxReturn,
  Transformation,
  User,
} from "@/mock-data/types";

interface ReturnReviewProps {
  taxReturn: TaxReturn;
  client: Client;
  preparer?: User;
  reviewer?: User;
  fields: ReturnField[];
  documents: SourceDocument[];
  transformations: Transformation[];
  aiOutputs: AIOutput[];
  openIssueCount: number;
  messageCount: number;
  initialFieldId?: string;
}

const fieldStateTone: Record<ReturnField["state"], string> = {
  "ai-unverified": "bg-[#f7ead8] text-[#8d601d]",
  verified: "bg-[#dff0e5] text-[#276645]",
  locked: "bg-[#e8eaed] text-[#58636d]",
  editable: "bg-[#e5ecf3] text-[#46647e]",
  "needs-approval": "bg-[#f3e4e5] text-[#8b3940]",
};

function StateIcon({ state }: { state: ReturnField["state"] }) {
  if (state === "verified") {
    return <Check aria-hidden="true" className="size-3.5" />;
  }
  if (state === "locked") {
    return <LockKeyhole aria-hidden="true" className="size-3.5" />;
  }
  if (state === "needs-approval") {
    return <CircleAlert aria-hidden="true" className="size-3.5" />;
  }
  if (state === "editable") {
    return <Pencil aria-hidden="true" className="size-3.5" />;
  }
  return <Sparkles aria-hidden="true" className="size-3.5" />;
}

function DocumentPage({
  document,
  activeBlockId,
}: {
  document?: SourceDocument;
  activeBlockId?: string;
}) {
  const page = document?.pages[0];

  if (!document || !page) {
    return (
      <div className="grid aspect-[8.5/11] place-items-center border border-dashed border-[#ccd3ce] bg-white text-center">
        <div>
          <FileText className="mx-auto size-6 text-[#89938d]" />
          <p className="mt-2 text-xs font-semibold">No source document</p>
          <p className="mt-1 text-[10px] text-[#7a847e]">
            This value was entered directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto aspect-[8.5/11] w-full max-w-[520px] overflow-hidden bg-white shadow-[0_3px_18px_rgba(24,33,28,0.12)] xl:h-[400px] xl:w-auto xl:max-w-none 2xl:h-[460px]">
      <div className="absolute inset-x-[8%] top-[5%] flex items-start justify-between border-b border-[#dfe3df] pb-3">
        <div>
          <p className="text-[8px] font-bold uppercase text-[#303a34]">
            {document.documentType.replaceAll("-", " ")}
          </p>
          <p className="mt-1 max-w-[210px] truncate text-[6px] text-[#7d8781]">
            {document.filename}
          </p>
        </div>
        <span className="text-[6px] text-[#87918b]">Tax year 2025</span>
      </div>

      {page.blocks.map((block) => {
        const active = block.id === activeBlockId;

        return (
          <div
            key={block.id}
            className={`absolute overflow-hidden p-1.5 ${
              block.kind === "heading"
                ? "font-semibold text-[#29332d]"
                : "border border-[#dfe3df] text-[#465149]"
            } ${
              active
                ? "border-2 border-[#d2a13d] bg-[#fff5d4] shadow-[0_0_0_3px_rgba(210,161,61,0.16)]"
                : ""
            }`}
            style={{
              left: `${(block.bounds.x / page.width) * 100}%`,
              top: `${(block.bounds.y / page.height) * 100}%`,
              width: `${(block.bounds.width / page.width) * 100}%`,
              height: `${(block.bounds.height / page.height) * 100}%`,
            }}
          >
            {block.label ? (
              <p className="truncate text-[6px] text-[#79837d]">
                {block.label}
              </p>
            ) : null}
            <p
              className={`truncate ${
                active ? "mt-1 text-[11px] font-bold" : "text-[7px]"
              }`}
            >
              {block.value ?? block.text}
            </p>
          </div>
        );
      })}

      <div className="absolute inset-x-[8%] bottom-[7%] space-y-2">
        {[100, 84, 94, 72].map((width, index) => (
          <span
            key={index}
            className="block h-1 bg-[#eef0ee]"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ReturnReview({
  taxReturn,
  client,
  preparer,
  reviewer,
  fields,
  documents,
  transformations,
  aiOutputs,
  openIssueCount,
  messageCount,
  initialFieldId,
}: ReturnReviewProps) {
  const [activeFieldId, setActiveFieldId] = useState(
    fields.some((field) => field.id === initialFieldId)
      ? initialFieldId!
      : fields.find((field) => field.state === "ai-unverified")?.id ??
          fields[0]?.id,
  );
  const [verifiedFieldIds, setVerifiedFieldIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [editingFieldId, setEditingFieldId] = useState<string>();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [draftValue, setDraftValue] = useState("");
  const [sectionFilter, setSectionFilter] = useState("All sections");

  const sections = useMemo(
    () => ["All sections", ...new Set(fields.map((field) => field.section))],
    [fields],
  );
  const visibleFields =
    sectionFilter === "All sections"
      ? fields
      : fields.filter((field) => field.section === sectionFilter);
  const activeField =
    fields.find((field) => field.id === activeFieldId) ?? fields[0];
  const sourcePointer = activeField?.sourcePointers[0];
  const activeDocument = documents.find(
    (document) => document.id === sourcePointer?.documentId,
  );
  const transformation = transformations.find(
    (item) => item.id === activeField?.transformationId,
  );
  const aiOutput = aiOutputs.find(
    (output) => output.id === activeField?.aiOutputId,
  );
  const effectiveState = activeField
    ? verifiedFieldIds.has(activeField.id)
      ? "verified"
      : activeField.state
    : "locked";
  const displayValue = activeField
    ? (editedValues[activeField.id] ?? activeField.displayValue)
    : "—";

  function beginCorrection() {
    if (!activeField) return;
    setDraftValue(displayValue);
    setEditingFieldId(activeField.id);
  }

  function saveCorrection() {
    if (!activeField || !draftValue.trim()) return;
    setEditedValues((values) => ({
      ...values,
      [activeField.id]: draftValue.trim(),
    }));
    setVerifiedFieldIds((ids) => new Set(ids).add(activeField.id));
    setEditingFieldId(undefined);
  }

  return (
    <main className="min-w-0">
      <div className="border-b border-[#dfe3df] bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-[1480px]">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#76817a]">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1 hover:text-[#245f40]"
            >
              <ArrowLeft aria-hidden="true" className="size-3" />
              Dashboard
            </Link>
            <ChevronRight aria-hidden="true" className="size-3" />
            <span>{client.displayName}</span>
            <ChevronRight aria-hidden="true" className="size-3" />
            <span className="font-semibold text-[#3d4941]">Return review</span>
          </div>

          <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold sm:text-2xl">
                  {client.displayName}
                </h1>
                <span className="rounded-[4px] bg-[#e5e8f0] px-2 py-1 text-[10px] font-semibold text-[#4f5b73]">
                  {RETURN_STATUS_LABELS[taxReturn.status]}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-[#748079]">
                {taxReturn.taxYear} ·{" "}
                {taxReturn.returnType === "individual-1040"
                  ? "Form 1040"
                  : taxReturn.returnType === "partnership-1065"
                    ? "Form 1065"
                    : "Form 1120-S"}{" "}
                · Prepared by {preparer?.name ?? "Unassigned"} · Reviewed by{" "}
                {reviewer?.name ?? "Unassigned"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-8 items-center gap-1.5 rounded-[5px] border border-[#d6dcd8] bg-white px-2.5 text-xs text-[#59665e]">
                <MessageSquareText
                  aria-hidden="true"
                  className="size-3.5"
                />
                {messageCount} messages
              </span>
              <span className="inline-flex h-8 items-center gap-1.5 rounded-[5px] border border-[#e2c9cb] bg-[#faf3f4] px-2.5 text-xs font-semibold text-[#8b3940]">
                <AlertTriangle aria-hidden="true" className="size-3.5" />
                {openIssueCount} open issues
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1480px] gap-5 px-4 py-5 sm:px-6 xl:grid-cols-[minmax(420px,1fr)_minmax(390px,0.86fr)]">
        <section className="min-w-0 overflow-hidden rounded-[6px] border border-[#dfe3df] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#dfe3df] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Return fields</h2>
              <p className="mt-0.5 text-[11px] text-[#7a847e]">
                Select a value to inspect its evidence and calculation.
              </p>
            </div>
            <div className="flex gap-2">
              <label className="relative">
                <span className="sr-only">Filter section</span>
                <select
                  value={sectionFilter}
                  onChange={(event) => setSectionFilter(event.target.value)}
                  className="h-8 appearance-none rounded-[5px] border border-[#d7ddd8] bg-white py-0 pl-2.5 pr-8 text-xs font-medium outline-none focus:border-[#4b8361]"
                >
                  {sections.map((section) => (
                    <option key={section}>{section}</option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 top-2 size-3.5 text-[#6e7972]"
                />
              </label>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-[5px] border border-[#d7ddd8] text-[#5d6961]"
                title="Search return fields"
              >
                <Search aria-hidden="true" className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#e5e8e5]">
            {visibleFields.map((field) => {
              const selected = field.id === activeField?.id;
              const state = verifiedFieldIds.has(field.id)
                ? "verified"
                : field.state;

              return (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => setActiveFieldId(field.id)}
                  className={`grid w-full grid-cols-[1fr_auto] gap-4 border-l-3 px-4 py-4 text-left transition-colors ${
                    selected
                      ? "border-l-[#2f7651] bg-[#f4f8f5]"
                      : "border-l-transparent bg-white hover:bg-[#fafbfa]"
                  }`}
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <span
                      className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${fieldStateTone[state]}`}
                    >
                      <StateIcon state={state} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-[#27322b]">
                        {field.label}
                      </span>
                      <span className="mt-1 block truncate text-[10px] text-[#7a847e]">
                        {field.form} · {field.locator} ·{" "}
                        {FIELD_STATE_LABELS[state]}
                      </span>
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-semibold tabular-nums text-[#253029]">
                      {editedValues[field.id] ?? field.displayValue}
                    </span>
                    {field.confidence ? (
                      <span
                        className={`mt-1 block text-[10px] font-semibold ${
                          field.confidence < 70
                            ? "text-[#9d3d43]"
                            : field.confidence < 90
                              ? "text-[#93651d]"
                              : "text-[#31704d]"
                        }`}
                      >
                        {field.confidence}% confidence
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="min-w-0 space-y-4">
          <section className="overflow-hidden rounded-[6px] border border-[#dfe3df] bg-[#eef0ee]">
            <div className="flex items-start justify-between gap-4 border-b border-[#d8ddd9] bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase text-[#7a847e]">
                  Source document
                </p>
                <h2 className="mt-1 truncate text-xs font-semibold">
                  {activeDocument?.filename ?? "Direct entry"}
                </h2>
              </div>
              {sourcePointer ? (
                <span className="shrink-0 text-[10px] text-[#7a847e]">
                  Page {sourcePointer.pageNumber} · {sourcePointer.sectionLabel}
                </span>
              ) : null}
            </div>
            <div className="p-4 sm:p-6">
              <DocumentPage
                document={activeDocument}
                activeBlockId={sourcePointer?.blockId}
              />
            </div>
          </section>

          {activeField ? (
            <section className="rounded-[6px] border border-[#dfe3df] bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase text-[#7a847e]">
                    Selected value
                  </p>
                  <h2 className="mt-1 text-sm font-semibold">
                    {activeField.label}
                  </h2>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-[4px] px-2 py-1 text-[10px] font-semibold ${fieldStateTone[effectiveState]}`}
                >
                  <StateIcon state={effectiveState} />
                  {FIELD_STATE_LABELS[effectiveState]}
                </span>
              </div>

              {editingFieldId === activeField.id ? (
                <div className="mt-4">
                  <label
                    htmlFor="corrected-value"
                    className="text-[11px] font-semibold text-[#59655d]"
                  >
                    Corrected value
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      id="corrected-value"
                      value={draftValue}
                      onChange={(event) => setDraftValue(event.target.value)}
                      className="h-9 min-w-0 flex-1 rounded-[5px] border border-[#bfc8c1] px-3 text-sm font-semibold outline-none focus:border-[#3d7655]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={saveCorrection}
                      className="inline-flex h-9 items-center gap-1.5 rounded-[5px] bg-[#1f5c3f] px-3 text-xs font-semibold text-white"
                    >
                      <Check aria-hidden="true" className="size-3.5" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingFieldId(undefined)}
                      className="grid size-9 place-items-center rounded-[5px] border border-[#d3d9d5]"
                      aria-label="Cancel correction"
                    >
                      <X aria-hidden="true" className="size-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-end justify-between gap-4 border-y border-[#e4e7e4] py-3">
                  <div>
                    <p className="text-[10px] text-[#7a847e]">Return value</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">
                      {displayValue}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {effectiveState !== "verified" ? (
                      <button
                        type="button"
                        onClick={() =>
                          setVerifiedFieldIds(
                            (ids) => new Set(ids).add(activeField.id),
                          )
                        }
                        className="inline-flex h-8 items-center gap-1.5 rounded-[5px] bg-[#1f5c3f] px-2.5 text-xs font-semibold text-white"
                      >
                        <ShieldCheck
                          aria-hidden="true"
                          className="size-3.5"
                        />
                        Verify
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={beginCorrection}
                      className="inline-flex h-8 items-center gap-1.5 rounded-[5px] border border-[#d1d8d3] px-2.5 text-xs font-semibold text-[#4e5b53]"
                    >
                      <Pencil aria-hidden="true" className="size-3.5" />
                      Correct
                    </button>
                  </div>
                </div>
              )}

              {transformation ? (
                <div className="mt-4 border-l-2 border-[#53667b] bg-[#f2f4f7] px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase text-[#59697a]">
                    Transformation
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-[#344454]">
                    {transformation.explanation}
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-[#5c6875]">
                    {transformation.steps
                      .map((step) => `${step.expression} = ${step.result}`)
                      .join(" · ")}
                  </p>
                </div>
              ) : null}

              {aiOutput ? (
                <div className="mt-4">
                  <div className="flex items-start gap-2">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#e7ece9] text-[#316447]">
                      <Sparkles aria-hidden="true" className="size-3.5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold">{aiOutput.summary}</p>
                      <p className="mt-1 text-[10px] text-[#77817b]">
                        Based on {aiOutput.evidence.length} supporting{" "}
                        {aiOutput.evidence.length === 1
                          ? "source"
                          : "sources"}
                      </p>
                    </div>
                  </div>
                  <details className="group mt-3 border-t border-[#e4e7e4] pt-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold text-[#4d5a52]">
                      Why this result
                      <ChevronDown
                        aria-hidden="true"
                        className="size-3.5 transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <p className="mt-2 text-[11px] leading-5 text-[#707b74]">
                      {aiOutput.why}
                    </p>
                    {aiOutput.correctionHistory.length ? (
                      <div className="mt-3 flex items-start gap-2 rounded-[4px] bg-[#f8eeee] px-2.5 py-2">
                        <History
                          aria-hidden="true"
                          className="mt-0.5 size-3.5 shrink-0 text-[#955057]"
                        />
                        <p className="text-[10px] leading-4 text-[#74474c]">
                          Corrected by a human:{" "}
                          {aiOutput.correctionHistory.at(-1)?.reason}
                        </p>
                      </div>
                    ) : null}
                  </details>
                </div>
              ) : null}
            </section>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
