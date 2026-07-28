"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  FileCheck2,
  FileText,
  Inbox,
  ListChecks,
  MessageSquareText,
  Upload,
} from "lucide-react";

import { ROLE_LABELS } from "@/mock-data/constants";
import type { User } from "@/mock-data/types";
import type {
  ReturnSummary,
  TeamLoadSummary,
  WorkspaceDashboardData,
} from "@/lib/workspace-types";
import { useWorkspaceStore } from "@/store/workspace-store";

const statusTone: Record<ReturnSummary["status"], string> = {
  "not-started": "bg-[#eef0ee] text-[#637068]",
  "awaiting-client-info": "bg-[#f8ead8] text-[#8a5c18]",
  "in-preparation": "bg-[#e2ece7] text-[#286043]",
  "in-review": "bg-[#e5e8f0] text-[#4f5b73]",
  "client-approval-needed": "bg-[#f3e4e5] text-[#8b3940]",
  filed: "bg-[#dff0e5] text-[#276645]",
  amended: "bg-[#ece6f0] text-[#6a4b74]",
};

function shortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(value));
}

function formatReturnType(value: ReturnSummary["returnType"]) {
  return {
    "individual-1040": "Form 1040",
    "partnership-1065": "Form 1065",
    "corporation-1120-s": "Form 1120-S",
  }[value];
}

function QueueTable({ returns }: { returns: ReturnSummary[] }) {
  return (
    <>
      <div className="divide-y divide-[#e4e7e4] lg:hidden">
        {returns.map((taxReturn) => (
          <Link
            key={taxReturn.id}
            href={`/workspace/returns/${taxReturn.id}`}
            className="block px-4 py-4 hover:bg-[#f8faf8]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#202b24]">
                  {taxReturn.clientName}
                </p>
                <p className="mt-1 text-[11px] text-[#7a847e]">
                  {taxReturn.taxYear} · {formatReturnType(taxReturn.returnType)}
                  · {taxReturn.documentCount} documents
                </p>
              </div>
              <span
                className={`shrink-0 rounded-[4px] px-2 py-1 text-[10px] font-semibold ${statusTone[taxReturn.status]}`}
              >
                {taxReturn.statusLabel}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="flex min-w-0 items-center gap-1.5 text-xs text-[#56625b]">
                {taxReturn.priorityScore >= 40 ? (
                  <AlertTriangle
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-[#a64a50]"
                  />
                ) : (
                  <Clock3
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-[#6c7871]"
                  />
                )}
                <span className="truncate">{taxReturn.urgencyReason}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#4a574f]">
                {shortDate(taxReturn.deadline)}
                <ChevronRight aria-hidden="true" className="size-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden max-w-full overflow-x-auto lg:block">
        <table className="w-full min-w-[790px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#dfe3df] text-[10px] font-semibold uppercase text-[#7c8680]">
              <th className="px-4 py-3">Client and return</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Why now</th>
              <th className="px-3 py-3">Owner</th>
              <th className="px-3 py-3">Deadline</th>
              <th className="w-10 px-3 py-3">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {returns.map((taxReturn) => (
              <tr
                key={taxReturn.id}
                className="group border-b border-[#e6e9e6] last:border-0 hover:bg-[#f8faf8]"
              >
                <td className="px-4 py-4">
                  <Link
                    href={`/workspace/returns/${taxReturn.id}`}
                    className="block"
                  >
                    <span className="block text-sm font-semibold text-[#202b24]">
                      {taxReturn.clientName}
                    </span>
                    <span className="mt-1 block text-[11px] text-[#7a847e]">
                      {taxReturn.taxYear} ·{" "}
                      {formatReturnType(taxReturn.returnType)}·{" "}
                      {taxReturn.documentCount} documents
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex rounded-[4px] px-2 py-1 text-[11px] font-semibold ${statusTone[taxReturn.status]}`}
                  >
                    {taxReturn.statusLabel}
                  </span>
                </td>
                <td className="max-w-[220px] px-3 py-4">
                  <span className="flex items-start gap-1.5 text-xs leading-5 text-[#4f5c54]">
                    {taxReturn.priorityScore >= 40 ? (
                      <AlertTriangle
                        aria-hidden="true"
                        className="mt-0.5 size-3.5 shrink-0 text-[#a64a50]"
                      />
                    ) : (
                      <Clock3
                        aria-hidden="true"
                        className="mt-0.5 size-3.5 shrink-0 text-[#6c7871]"
                      />
                    )}
                    {taxReturn.urgencyReason}
                  </span>
                </td>
                <td className="px-3 py-4 text-xs text-[#536159]">
                  {taxReturn.assignedPreparerName ?? "Unassigned"}
                </td>
                <td className="px-3 py-4 text-xs font-medium text-[#39463e]">
                  {shortDate(taxReturn.deadline)}
                </td>
                <td className="px-3 py-4">
                  <Link
                    href={`/workspace/returns/${taxReturn.id}`}
                    className="grid size-7 place-items-center rounded-[4px] text-[#738078] group-hover:bg-[#e1ece5] group-hover:text-[#23603f]"
                    aria-label={`Open ${taxReturn.clientName} return`}
                  >
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TeamLoadTable({ teamLoad }: { teamLoad: TeamLoadSummary[] }) {
  return (
    <div className="divide-y divide-[#e3e6e3]">
      {teamLoad.map((member) => (
        <div
          key={member.userId}
          className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-5 px-4 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-[#e0ebe4] text-[11px] font-bold text-[#286043]">
              {member.initials}
            </span>
            <div>
              <p className="text-sm font-semibold">{member.name}</p>
              <p className="mt-0.5 text-[10px] text-[#7a847e]">
                {ROLE_LABELS[member.role]}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">
              {member.activeReturns}
            </p>
            <p className="text-[10px] text-[#7a847e]">Active</p>
          </div>
          <div className="text-right">
            <p
              className={`text-sm font-semibold tabular-nums ${
                member.urgentReturns ? "text-[#9d3d43]" : ""
              }`}
            >
              {member.urgentReturns}
            </p>
            <p className="text-[10px] text-[#7a847e]">Urgent</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">
              {member.openTasks}
            </p>
            <p className="text-[10px] text-[#7a847e]">Tasks</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientHome({
  activeUser,
  taxReturn,
  data,
}: {
  activeUser: User;
  taxReturn?: ReturnSummary;
  data: WorkspaceDashboardData;
}) {
  if (!taxReturn) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm text-[#68736c]">
          No return is linked to this client workspace.
        </p>
      </div>
    );
  }

  const action =
    data.tasks.find(
      (task) =>
        task.taxReturnId === taxReturn.id &&
        task.visibility === "client-visible" &&
        task.ownerUserId === activeUser.id,
    ) ?? taxReturn.nextTask;
  const progressSteps = [
    "Not Started",
    "In Preparation",
    "In Review",
    "Client Approval Needed",
    "Filed",
  ];
  const currentIndex = {
    "not-started": 0,
    "awaiting-client-info": 1,
    "in-preparation": 1,
    "in-review": 2,
    "client-approval-needed": 3,
    filed: 4,
    amended: 4,
  } satisfies Record<ReturnSummary["status"], number>;
  const activeProgressIndex = currentIndex[taxReturn.status];

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-7 sm:px-6 sm:py-9">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-[#7b867f]">
            {taxReturn.taxYear} tax return
          </p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
            Welcome back, {activeUser.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm text-[#68736c]">
            Your return is currently{" "}
            <span className="font-semibold text-[#34433a]">
              {taxReturn.statusLabel.toLowerCase()}
            </span>
            .
          </p>
        </div>
        <Link
          href={`/workspace/returns/${taxReturn.id}`}
          className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-[5px] bg-[#1f5c3f] px-3.5 text-sm font-semibold text-white hover:bg-[#174a32]"
        >
          Open my return
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {action ? (
        <section className="mt-7 border-l-4 border-[#9d3d43] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(24,33,28,0.05)]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase text-[#914048]">
                Your next action
              </p>
              <h2 className="mt-2 text-lg font-semibold">{action.title}</h2>
              <p className="mt-1.5 text-sm text-[#68736c]">
                Requested by your tax team · Due {shortDate(action.dueDate)}
              </p>
            </div>
            <Link
              href={`/workspace/returns/${taxReturn.id}`}
              className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-[5px] border border-[#ccd4ce] bg-white px-3.5 text-sm font-semibold text-[#245d40] hover:bg-[#f3f7f4]"
            >
              Review request
              <ChevronRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mt-6 rounded-[6px] border border-[#dfe3df] bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">Return progress</h2>
            <p className="mt-1 text-xs text-[#748079]">
              Staff and clients see the same top-level status.
            </p>
          </div>
          <span
            className={`rounded-[4px] px-2 py-1 text-[11px] font-semibold ${statusTone[taxReturn.status]}`}
          >
            {taxReturn.statusLabel}
          </span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {progressSteps.map((step, index) => (
            <div key={step}>
              <div className="flex items-center">
                <span
                  className={`grid size-6 place-items-center rounded-full ${
                    index < activeProgressIndex
                      ? "bg-[#2f7651] text-white"
                      : index === activeProgressIndex
                        ? "border-2 border-[#2f7651] bg-white text-[#2f7651]"
                        : "border border-[#ccd3ce] bg-white text-[#8a948e]"
                  }`}
                >
                  {index < activeProgressIndex ? (
                    <CheckCircle2 aria-hidden="true" className="size-3.5" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                </span>
                {index < progressSteps.length - 1 ? (
                  <span
                    className={`hidden h-px flex-1 sm:block ${
                      index < activeProgressIndex
                        ? "bg-[#2f7651]"
                        : "bg-[#dce1dd]"
                    }`}
                  />
                ) : null}
              </div>
              <p
                className={`mt-2 text-[10px] leading-4 ${
                  index === activeProgressIndex
                    ? "font-semibold text-[#265e41]"
                    : "text-[#7b867f]"
                }`}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {[
          {
            icon: FileText,
            label: "Documents",
            value: taxReturn.documentCount,
            detail: "Uploaded and connected",
          },
          {
            icon: MessageSquareText,
            label: "Messages",
            value: "1 new",
            detail: "From your tax team",
          },
          {
            icon: FileCheck2,
            label: "Fields reviewed",
            value: taxReturn.fieldCount,
            detail: taxReturn.statusDetail,
          },
        ].map((item) => (
          <section
            key={item.label}
            className="rounded-[6px] border border-[#dfe3df] bg-white p-5"
          >
            <item.icon aria-hidden="true" className="size-5 text-[#2c6b49]" />
            <p className="mt-5 text-xs font-semibold text-[#69746d]">
              {item.label}
            </p>
            <p className="mt-1 text-xl font-semibold">{item.value}</p>
            <p className="mt-2 text-xs leading-5 text-[#7a847e]">
              {item.detail}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}

export function WorkspaceDashboard({
  users,
  data,
}: {
  users: User[];
  data: WorkspaceDashboardData;
}) {
  const [view, setView] = useState<"queue" | "team">("queue");
  const { activeUserId, activeContextId } = useWorkspaceStore();
  const activeUser =
    users.find((user) => user.id === activeUserId) ?? users[0];
  const activeContext =
    activeUser.accessContexts.find(
      (context) => context.id === activeContextId,
    ) ?? activeUser.accessContexts[0];

  const visibleReturns = useMemo(() => {
    if (activeContext.mode === "client") {
      return data.returns.filter(
        (taxReturn) => taxReturn.clientId === activeContext.clientId,
      );
    }
    if (activeContext.role === "firm-administrator") {
      return data.returns;
    }
    if (activeContext.role === "seasonal-staff") {
      return data.returns.filter(
        (taxReturn) => taxReturn.status === "in-preparation",
      );
    }

    return data.returns.filter(
      (taxReturn) =>
        taxReturn.assignedPreparerId === activeUser.id ||
        taxReturn.assignedReviewerId === activeUser.id,
    );
  }, [activeContext, activeUser.id, data.returns]);

  if (activeContext.mode === "client") {
    return (
      <ClientHome
        activeUser={activeUser}
        taxReturn={visibleReturns[0]}
        data={data}
      />
    );
  }

  const urgentReturns = visibleReturns.filter(
    (taxReturn) => taxReturn.priorityScore >= 40,
  );
  const awaitingClient = visibleReturns.filter(
    (taxReturn) => taxReturn.status === "awaiting-client-info",
  );
  const activeUserTasks = data.tasks.filter(
    (task) =>
      task.ownerUserId === activeUser.id ||
      visibleReturns.some((taxReturn) => taxReturn.id === task.taxReturnId),
  );

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-7 sm:px-6 sm:py-9">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-[#7b867f]">
            Tuesday, July 28
          </p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
            Good morning, {activeUser.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm text-[#68736c]">
            {urgentReturns.length
              ? `${urgentReturns.length} return${urgentReturns.length === 1 ? "" : "s"} need attention today.`
              : "Your assigned returns are on track."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-[5px] border border-[#ced5d0] bg-white px-3 text-sm font-semibold text-[#425047] hover:bg-[#f8faf8]"
          >
            <Upload aria-hidden="true" className="size-4" />
            Upload
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-[5px] bg-[#1f5c3f] px-3 text-sm font-semibold text-white hover:bg-[#174a32]"
          >
            <ListChecks aria-hidden="true" className="size-4" />
            New task
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Priority returns",
            value: urgentReturns.length,
            detail: "Ranked by blockers and wait time",
            icon: AlertTriangle,
            tone: "text-[#9d3d43] bg-[#f5e8e9]",
          },
          {
            label: "Awaiting clients",
            value: awaitingClient.length,
            detail: "Client action is blocking work",
            icon: Inbox,
            tone: "text-[#8a5b18] bg-[#f7ead8]",
          },
          {
            label: "Open tasks",
            value: activeUserTasks.length,
            detail: "Across your visible returns",
            icon: ListChecks,
            tone: "text-[#286043] bg-[#e1ece5]",
          },
          {
            label: "In review",
            value: visibleReturns.filter(
              (taxReturn) => taxReturn.status === "in-review",
            ).length,
            detail: "Ready for reviewer attention",
            icon: FileCheck2,
            tone: "text-[#4e5971] bg-[#e8eaf0]",
          },
        ].map((metric) => (
          <section
            key={metric.label}
            className="rounded-[6px] border border-[#dfe3df] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#69746d]">
                  {metric.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {metric.value}
                </p>
              </div>
              <span
                className={`grid size-8 place-items-center rounded-[5px] ${metric.tone}`}
              >
                <metric.icon aria-hidden="true" className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-[11px] text-[#7b857f]">{metric.detail}</p>
          </section>
        ))}
      </div>

      <div className="mt-6 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 overflow-hidden rounded-[6px] border border-[#dfe3df] bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-[#dfe3df] px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold">Return work</h2>
              <p className="mt-0.5 text-[11px] text-[#7a847e]">
                Ordered by deadline, blocker severity, and waiting time
              </p>
            </div>
            <div className="flex rounded-[5px] bg-[#edf0ed] p-0.5">
              <button
                type="button"
                onClick={() => setView("queue")}
                className={`h-7 rounded-[4px] px-2.5 text-xs font-semibold ${
                  view === "queue"
                    ? "bg-white text-[#253129] shadow-sm"
                    : "text-[#6c7770]"
                }`}
              >
                My queue
              </button>
              <button
                type="button"
                onClick={() => setView("team")}
                className={`h-7 rounded-[4px] px-2.5 text-xs font-semibold ${
                  view === "team"
                    ? "bg-white text-[#253129] shadow-sm"
                    : "text-[#6c7770]"
                }`}
              >
                Team load
              </button>
            </div>
          </div>
          {view === "queue" ? (
            visibleReturns.length ? (
              <QueueTable returns={visibleReturns} />
            ) : (
              <div className="px-5 py-12 text-center">
                <CircleDot className="mx-auto size-5 text-[#819087]" />
                <p className="mt-3 text-sm font-semibold">
                  No returns assigned in this context
                </p>
                <p className="mt-1 text-xs text-[#7a847e]">
                  Switch roles to inspect another workspace.
                </p>
              </div>
            )
          ) : (
            <TeamLoadTable teamLoad={data.teamLoad} />
          )}
        </section>

        <aside className="rounded-[6px] border border-[#dfe3df] bg-white">
          <div className="border-b border-[#dfe3df] px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Open actions</h2>
              <span className="text-[11px] font-semibold text-[#7a847e]">
                {activeUserTasks.length}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-[#7a847e]">
              Work connected to a return or issue
            </p>
          </div>
          <div className="divide-y divide-[#e5e8e5]">
            {activeUserTasks.slice(0, 4).map((task) => (
              <Link
                key={task.id}
                href={`/workspace/returns/${task.taxReturnId}`}
                className="block px-4 py-4 hover:bg-[#f8faf8]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 size-2 shrink-0 rounded-full ${
                      task.priority === "urgent"
                        ? "bg-[#a5444b]"
                        : task.priority === "high"
                          ? "bg-[#d3a144]"
                          : "bg-[#4a8060]"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-5">
                      {task.title}
                    </p>
                    <p className="mt-1 text-[10px] text-[#7b867f]">
                      {task.clientName} · Due {shortDate(task.dueDate)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-1.5 border-t border-[#dfe3df] text-xs font-semibold text-[#286043]"
          >
            View all actions
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </button>
        </aside>
      </div>
    </main>
  );
}
