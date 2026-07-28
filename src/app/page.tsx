import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileSearch,
  LockKeyhole,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { TracelineBrand } from "@/components/traceline-brand";

const navItems = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#workflow" },
  { label: "For firms", href: "#firms" },
  { label: "Trust", href: "#trust" },
];

const fieldRows = [
  {
    id: "field-maya-wages",
    form: "W-2",
    label: "Wages, salaries, tips",
    value: "$124,500",
    status: "Verified",
    tone: "verified",
  },
  {
    id: "field-maya-interest",
    form: "1099-INT",
    label: "Taxable interest",
    value: "$842.17",
    status: "Review",
    tone: "review",
  },
  {
    id: "field-maya-capital-gain",
    form: "Schedule D",
    label: "Net short-term gain",
    value: "$3,600",
    status: "Calculated",
    tone: "calculated",
  },
];

function WorkspacePreview() {
  return (
    <div className="overflow-hidden rounded-[6px] border border-[#d9ddd9] bg-white shadow-[0_24px_70px_rgba(21,31,25,0.12)]">
      <div className="flex h-12 items-center justify-between border-b border-[#e3e6e3] bg-[#fbfcfb] px-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-[#9d3d43]" />
            <span className="size-2 rounded-full bg-[#d8a341]" />
            <span className="size-2 rounded-full bg-[#3b7d59]" />
          </div>
          <span className="h-4 w-px bg-[#d9ddd9]" />
          <span className="text-xs font-semibold text-[#445049]">
            Return review
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#66716b]">
          <LockKeyhole aria-hidden="true" className="size-3.5" />
          Reviewer workspace
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-[980px] grid-cols-[190px_1fr_330px]">
          <aside className="min-h-[480px] border-r border-[#e3e6e3] bg-[#f7f8f7] p-4">
            <p className="text-[10px] font-semibold uppercase text-[#7a847f]">
              2025 individual
            </p>
            <div className="mt-2">
              <p className="text-sm font-semibold text-[#18211c]">
                Maya Thompson
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#865158]">
                <span className="size-1.5 rounded-full bg-[#9d3d43]" />
                In review
              </div>
            </div>
            <nav className="mt-6 space-y-1" aria-label="Preview navigation">
              {[
                "Return overview",
                "Income",
                "Deductions",
                "Documents",
                "Issues & notes",
              ].map((item, index) => (
                <div
                  key={item}
                  className={`flex h-8 items-center justify-between rounded-[4px] px-2 text-xs ${
                    index === 1
                      ? "bg-[#e2eee7] font-semibold text-[#17442f]"
                      : "text-[#59645e]"
                  }`}
                >
                  {item}
                  {item === "Issues & notes" ? (
                    <span className="grid size-4 place-items-center rounded-full bg-[#9d3d43] text-[9px] text-white">
                      2
                    </span>
                  ) : null}
                </div>
              ))}
            </nav>
            <div className="mt-8 border-t border-[#dde1dd] pt-4">
              <p className="text-[10px] font-semibold uppercase text-[#7a847f]">
                Progress
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#dde2de]">
                <div className="h-full w-[76%] bg-[#2f7651]" />
              </div>
              <p className="mt-2 text-[11px] text-[#66716b]">
                19 of 25 fields reviewed
              </p>
            </div>
          </aside>

          <section className="min-h-[480px] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase text-[#7a847f]">
                  Income
                </p>
                <h3 className="mt-1 text-base font-semibold text-[#18211c]">
                  Income reported
                </h3>
              </div>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-[4px] border border-[#dce1dd] text-[#56625b]"
                aria-label="Search preview fields"
              >
                <Search aria-hidden="true" className="size-3.5" />
              </button>
            </div>

            <div className="mt-5 border-y border-[#e3e6e3]">
              {fieldRows.map((field, index) => (
                <div
                  key={field.label}
                  className={`grid grid-cols-[1fr_auto] gap-4 py-4 ${
                    index < fieldRows.length - 1
                      ? "border-b border-[#e8eae8]"
                      : ""
                  }`}
                >
                  <div className="flex min-w-0 gap-3">
                    <span
                      className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${
                        field.tone === "verified"
                          ? "bg-[#e0f0e6] text-[#266845]"
                          : field.tone === "review"
                            ? "bg-[#f5e9d4] text-[#91641e]"
                            : "bg-[#e7e9ef] text-[#4d596d]"
                      }`}
                    >
                      {field.tone === "verified" ? (
                        <Check aria-hidden="true" className="size-3.5" />
                      ) : field.tone === "review" ? (
                        <CircleAlert
                          aria-hidden="true"
                          className="size-3.5"
                        />
                      ) : (
                        <Sparkles aria-hidden="true" className="size-3.5" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#253029]">
                        {field.label}
                      </p>
                      <p className="mt-1 text-[10px] text-[#7a847f]">
                        {field.form} · {field.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums text-[#202a24]">
                      {field.value}
                    </p>
                    <Link
                      href={`/workspace/returns/return-maya-2025?field=${field.id}`}
                      className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#286345]"
                    >
                      View source
                      <ChevronRight aria-hidden="true" className="size-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-l-2 border-[#9d3d43] bg-[#faf5f5] px-3 py-3">
              <div className="flex items-start gap-2">
                <CircleAlert
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-[#9d3d43]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#562b2f]">
                    One value needs a human check
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-[#79575a]">
                    Interest income is 74% confident because the source scan is
                    compressed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="min-h-[480px] border-l border-[#e3e6e3] bg-[#f4f5f3] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase text-[#7a847f]">
                  Source
                </p>
                <p className="mt-1 text-xs font-semibold text-[#253029]">
                  Harbor Bank 1099-INT
                </p>
              </div>
              <span className="text-[10px] text-[#7a847f]">Page 1 of 1</span>
            </div>

            <div className="mt-3 aspect-[8.5/10.3] bg-white p-5 shadow-[0_2px_10px_rgba(20,30,24,0.08)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold text-[#252c28]">
                    2025 FORM 1099-INT
                  </p>
                  <p className="mt-1 text-[6px] text-[#737a76]">
                    Interest Income
                  </p>
                </div>
                <span className="text-[6px] text-[#8a918d]">Copy B</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <div className="h-8 border border-[#d8dcda] p-1">
                  <p className="text-[5px] text-[#7e8581]">PAYER&apos;S name</p>
                  <p className="mt-1 text-[6px] font-semibold">HARBOR BANK</p>
                </div>
                <div className="h-8 border border-[#d8dcda] p-1">
                  <p className="text-[5px] text-[#7e8581]">RECIPIENT&apos;S ID</p>
                  <p className="mt-1 text-[6px] font-semibold">***-**-2481</p>
                </div>
              </div>
              <div className="mt-2 border-2 border-[#d6a548] bg-[#fff7dc] p-2 shadow-[0_0_0_2px_rgba(214,165,72,0.12)]">
                <p className="text-[6px] text-[#7c672f]">
                  1 Interest income
                </p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-[#2a2f2c]">
                  $842.17
                </p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-9 border border-[#d8dcda] p-1"
                  >
                    <span className="block h-1 w-10 bg-[#eceeec]" />
                    <span className="mt-2 block h-1 w-16 bg-[#f0f1f0]" />
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1">
                <span className="block h-1 w-full bg-[#f0f1f0]" />
                <span className="block h-1 w-[86%] bg-[#f0f1f0]" />
                <span className="block h-1 w-[93%] bg-[#f0f1f0]" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#18211c]">
      <header className="absolute inset-x-0 top-0 z-30 text-white">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between border-b border-white/20 px-5 sm:px-8 lg:px-10">
          <Link href="#top" aria-label="Traceline home">
            <TracelineBrand inverse />
          </Link>

          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-white/78 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/workspace"
            className="inline-flex h-9 items-center gap-2 rounded-[5px] border border-white/30 bg-white/10 px-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[#183c2b] sm:px-4"
          >
            <span className="hidden sm:inline">Explore workspace</span>
            <span className="sm:hidden">Explore</span>
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </header>

      <main>
        <section
          id="top"
          className="relative isolate flex min-h-[calc(100svh-72px)] max-h-[900px] overflow-hidden bg-[#111714] text-white"
        >
          <Image
            src="/images/traceline-hero.png"
            alt="A CPA and business owner reviewing tax documents together"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[64%_center]"
          />
          <div className="hero-scrim absolute inset-0" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex w-full max-w-[1280px] items-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 lg:items-center lg:px-10 lg:pb-10 lg:pt-24">
            <div className="max-w-[620px]">
              <p className="mb-4 text-xs font-semibold uppercase text-[#cce8d5] sm:text-sm">
                AI tax work, with a visible trail
              </p>
              <h1 className="font-serif text-[3.5rem] font-semibold leading-[0.98] sm:text-[4.5rem] lg:text-[5.5rem]">
                Traceline
              </h1>
              <p className="mt-5 max-w-[570px] text-lg leading-7 text-white/82 sm:text-xl sm:leading-8">
                Every number connects back to its source. Every AI suggestion
                shows its work. Every client knows what happens next.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/workspace"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[5px] bg-[#d8f3df] px-5 text-sm font-semibold text-[#173d2a] transition-colors hover:bg-white"
                >
                  See the product
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  href="/workspace/returns/return-maya-2025?field=field-maya-interest"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[5px] border border-white/35 bg-black/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/12"
                >
                  Follow a return
                  <ChevronRight aria-hidden="true" className="size-4" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-white/72 sm:text-sm">
                {[
                  "Source-linked fields",
                  "Human review controls",
                  "One shared status",
                ].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <CheckCircle2
                      aria-hidden="true"
                      className="size-3.5 text-[#b7dfc3]"
                    />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#e2e5e2] bg-white">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 divide-y divide-[#e2e5e2] px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-10">
            {[
              {
                value: "1 click",
                label: "from return field to source",
              },
              {
                value: "6 roles",
                label: "working from one shared truth",
              },
              {
                value: "100%",
                label: "of AI outputs explainable",
              },
            ].map((item) => (
              <div
                key={item.value}
                className="flex items-baseline gap-3 py-5 md:px-7 md:first:pl-0"
              >
                <span className="text-xl font-semibold text-[#1f5c3f]">
                  {item.value}
                </span>
                <span className="text-sm text-[#69736d]">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="product" className="bg-[#f6f7f5] py-20 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase text-[#8f3940]">
                  Inspectable by default
                </p>
                <h2 className="mt-3 max-w-lg font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                  Review the return and the evidence in one place.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-[#657069] lg:justify-self-end">
                Traceline keeps extracted values, calculations, source
                documents, confidence, and human corrections in the same review
                flow. The answer stays short; the evidence is always one step
                away.
              </p>
            </div>

            <div className="mt-10">
              <WorkspacePreview />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-[#66716b]">
                The workspace preview uses the same field states and source
                model as the prototype.
              </p>
              <Link
                href="#workflow"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#245e40]"
              >
                See the workflow
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-xs font-semibold uppercase text-[#8f3940]">
                  A return that moves
                </p>
                <h2 className="mt-3 max-w-md font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                  From messy documents to a filing decision.
                </h2>
                <p className="mt-5 max-w-md text-base leading-7 text-[#657069]">
                  Work is organized around the return, not scattered across
                  inboxes, chats, and disconnected review tools.
                </p>
              </div>

              <div className="border-t border-[#dfe3df]">
                {[
                  {
                    number: "01",
                    icon: FileSearch,
                    title: "Trace every value",
                    copy: "Open a field and land on the exact page, section, and transformation that produced it.",
                  },
                  {
                    number: "02",
                    icon: MessageSquareText,
                    title: "Resolve issues in context",
                    copy: "Keep client requests and internal notes attached to the document or issue they concern.",
                  },
                  {
                    number: "03",
                    icon: FileCheck2,
                    title: "Move forward with confidence",
                    copy: "Review uncertainty, correct the AI, and advance one shared status that clients and staff understand.",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="grid gap-4 border-b border-[#dfe3df] py-7 sm:grid-cols-[48px_44px_1fr] sm:items-start"
                  >
                    <span className="text-xs font-semibold text-[#8a948e]">
                      {step.number}
                    </span>
                    <span className="grid size-9 place-items-center rounded-[5px] bg-[#e1eee6] text-[#235f40]">
                      <step.icon aria-hidden="true" className="size-[18px]" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-[#66716b]">
                        {step.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="firms" className="border-y border-[#dfe3df] bg-[#f3f5f3]">
          <div className="mx-auto grid max-w-[1280px] lg:grid-cols-2">
            <div className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
              <p className="text-xs font-semibold uppercase text-[#8f3940]">
                Built for the whole firm
              </p>
              <h2 className="mt-3 max-w-lg font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                The right work, for the role you are in.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#657069]">
                Preparers see their queue. Reviewers see risk. Firm leaders see
                capacity. Clients see the same return status and the next action
                that belongs to them.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
                {[
                  "Individual clients",
                  "Business owners",
                  "Tax preparers",
                  "Reviewers",
                  "Firm administrators",
                  "Seasonal staff",
                ].map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-2 text-sm text-[#344039]"
                  >
                    <Check aria-hidden="true" className="size-4 text-[#2f7651]" />
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-[#dfe3df] bg-[#202925] px-5 py-16 text-white sm:px-8 lg:border-l lg:border-t-0 lg:px-10 lg:py-20">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-[#b9d7c3]">
                  Today&apos;s firm queue
                </p>
                <Clock3
                  aria-hidden="true"
                  className="size-5 text-white/45"
                />
              </div>
              <div className="mt-8 space-y-1">
                {[
                  {
                    client: "Parkside Studio",
                    reason: "Client waiting 5 days",
                    state: "Needs info",
                    urgent: true,
                  },
                  {
                    client: "Northstar Manufacturing",
                    reason: "Payroll variance blocks review",
                    state: "Due today",
                    urgent: true,
                  },
                  {
                    client: "Maya Thompson",
                    reason: "1 confirmation remains",
                    state: "In review",
                    urgent: false,
                  },
                ].map((returnItem) => (
                  <div
                    key={returnItem.client}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/12 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {returnItem.client}
                      </p>
                      <p className="mt-1 text-xs text-white/55">
                        {returnItem.reason}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        returnItem.urgent
                          ? "text-[#efb4b8]"
                          : "text-[#b7dfc3]"
                      }`}
                    >
                      {returnItem.state}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="#trust"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#c7e7d0]"
              >
                How prioritization works
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section id="trust" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <span className="grid size-11 place-items-center rounded-[6px] bg-[#e2eee7] text-[#235f40]">
                  <ShieldCheck aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-5 max-w-md font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                  AI that earns the next click.
                </h2>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                {[
                  {
                    title: "Evidence before explanation",
                    copy: "Every suggestion carries the fields and documents that support it.",
                  },
                  {
                    title: "Uncertainty stays visible",
                    copy: "Low confidence changes the workflow instead of hiding behind a confident answer.",
                  },
                  {
                    title: "Corrections become history",
                    copy: "A human override is fast, attributable, and preserved for the next reviewer.",
                  },
                  {
                    title: "Client boundaries are explicit",
                    copy: "Internal notes and client-visible messages remain visually and structurally distinct.",
                  },
                ].map((principle) => (
                  <div
                    key={principle.title}
                    className="border-t-2 border-[#2f7651] pt-4"
                  >
                    <h3 className="text-base font-semibold">
                      {principle.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#66716b]">
                      {principle.copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#9b3f45] text-white">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase text-white/70">
                The return is complicated. The workflow should not be.
              </p>
              <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Give every tax decision a visible line back to the truth.
              </h2>
            </div>
            <Link
              href="/workspace"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-[5px] bg-white px-5 text-sm font-semibold text-[#6f2830] transition-colors hover:bg-[#f5e9e9] lg:self-auto"
            >
              Explore Traceline
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#121815] text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <TracelineBrand inverse />
          <p className="text-xs text-white/50">
            Prototype workspace for transparent, collaborative tax work.
          </p>
          <p className="text-xs text-white/40">© 2026 Traceline</p>
        </div>
      </footer>
    </div>
  );
}
