"use client";

import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  FileClock,
  Files,
  Gauge,
  Home,
  MessageSquareText,
  Search,
  Settings,
  Users,
} from "lucide-react";

import { TracelineBrand } from "@/components/traceline-brand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABELS } from "@/mock-data/constants";
import type { User } from "@/mock-data/types";
import { useWorkspaceStore } from "@/store/workspace-store";

interface WorkspaceFrameProps {
  users: User[];
  clientReturnMap: Record<string, string>;
  children: React.ReactNode;
}

const staffNavigation = [
  { label: "Dashboard", href: "/workspace", icon: Gauge },
  { label: "Returns", href: "/workspace", icon: Files },
  {
    label: "Review queue",
    href: "/workspace/returns/return-maya-2025",
    icon: FileClock,
  },
  { label: "Clients", href: "/workspace", icon: Users },
  { label: "Messages", href: "/workspace", icon: MessageSquareText },
];

export function WorkspaceFrame({
  users,
  clientReturnMap,
  children,
}: WorkspaceFrameProps) {
  const { activeUserId, activeContextId, setActiveContext } =
    useWorkspaceStore();
  const activeUser =
    users.find((user) => user.id === activeUserId) ?? users[0];
  const activeContext =
    activeUser.accessContexts.find(
      (context) => context.id === activeContextId,
    ) ?? activeUser.accessContexts[0];
  const clientReturnId = activeContext.clientId
    ? clientReturnMap[activeContext.clientId]
    : undefined;
  const clientNavigation = [
    { label: "Home", href: "/workspace", icon: Home },
    {
      label: "My return",
      href: clientReturnId
        ? `/workspace/returns/${clientReturnId}`
        : "/workspace",
      icon: BriefcaseBusiness,
    },
    {
      label: "Documents",
      href: clientReturnId
        ? `/workspace/returns/${clientReturnId}`
        : "/workspace",
      icon: Files,
    },
    { label: "Messages", href: "/workspace", icon: MessageSquareText },
  ];
  const navigation =
    activeContext.mode === "staff" ? staffNavigation : clientNavigation;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f6f4] text-[#18211c]">
      <header className="sticky top-0 z-40 border-b border-[#dfe3df] bg-white">
        <div className="flex h-16 items-center">
          <div className="flex h-full w-auto items-center border-r border-[#e1e4e1] px-4 lg:w-[232px] lg:px-5">
            <Link href="/workspace" aria-label="Traceline workspace home">
              <TracelineBrand compact />
            </Link>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 sm:px-5">
            <button
              type="button"
              className="hidden h-9 w-full max-w-[360px] items-center gap-2 rounded-[5px] border border-[#dce1dd] bg-[#fafbfa] px-3 text-left text-sm text-[#7a847f] md:flex"
              title="Search returns and documents"
            >
              <Search aria-hidden="true" className="size-4" />
              Search returns, clients, or documents
              <span className="ml-auto rounded-[3px] border border-[#d8ddda] px-1.5 py-0.5 text-[10px]">
                ⌘ K
              </span>
            </button>

            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="grid size-9 place-items-center rounded-[5px] border border-[#dce1dd] text-[#536159] hover:bg-[#f3f5f3]"
                  aria-label="Open notifications"
                >
                  <span className="relative">
                    <Bell aria-hidden="true" className="size-4" />
                    <span className="absolute -right-1 -top-1 size-1.5 rounded-full bg-[#9d3d43]" />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[310px] rounded-[6px] p-2"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-2 text-xs uppercase">
                      Notifications
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="items-start rounded-[4px] px-2 py-2.5">
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-[#9d3d43]" />
                      <span>
                        <span className="block text-xs font-semibold">
                          Northstar payroll is due today
                        </span>
                        <span className="mt-1 block text-[11px] text-[#77817b]">
                          The variance still blocks reviewer sign-off.
                        </span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="items-start rounded-[4px] px-2 py-2.5">
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-[#d2a144]" />
                      <span>
                        <span className="block text-xs font-semibold">
                          Maya replied to your request
                        </span>
                        <span className="mt-1 block text-[11px] text-[#77817b]">
                          Charity acknowledgment · 2 hours ago
                        </span>
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-10 min-w-0 items-center gap-2 rounded-[5px] border border-[#dce1dd] bg-white px-2 hover:bg-[#f7f8f7]">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#dfece4] text-[11px] font-bold text-[#275f42]">
                    {activeUser.initials}
                  </span>
                  <span className="hidden min-w-0 text-left sm:block">
                    <span className="block max-w-[150px] truncate text-xs font-semibold">
                      {activeContext.label}
                    </span>
                    <span className="block max-w-[150px] truncate text-[10px] text-[#7a847f]">
                      {activeUser.name} · {ROLE_LABELS[activeContext.role]}
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-[#6f7973]"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[330px] rounded-[6px] p-2"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-2">
                      <span className="block text-xs font-semibold text-[#1e2822]">
                        Switch role or workspace
                      </span>
                      <span className="mt-1 block text-[10px] font-normal text-[#7a847f]">
                        Prototype control · no authentication
                      </span>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {users.flatMap((user) =>
                      user.accessContexts.map((context) => {
                        const selected =
                          user.id === activeUser.id &&
                          context.id === activeContext.id;

                        return (
                          <DropdownMenuItem
                            key={context.id}
                            onClick={() =>
                              setActiveContext(user.id, context.id)
                            }
                            className="rounded-[4px] px-2 py-2"
                          >
                            <span
                              className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                                context.mode === "staff"
                                  ? "bg-[#e1ece5] text-[#255e40]"
                                  : "bg-[#eee8dd] text-[#735a2d]"
                              }`}
                            >
                              {user.initials}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-xs font-semibold">
                                {user.name} · {context.label}
                              </span>
                              <span className="block truncate text-[10px] text-[#7a847f]">
                                {ROLE_LABELS[context.role]}
                              </span>
                            </span>
                            {selected ? (
                              <Check
                                aria-hidden="true"
                                className="ml-auto size-4 text-[#2e7650]"
                              />
                            ) : null}
                          </DropdownMenuItem>
                        );
                      }),
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-[232px] shrink-0 border-r border-[#dfe3df] bg-[#fbfcfb] lg:flex lg:flex-col">
          <div className="px-3 py-5">
            <p className="px-2 text-[10px] font-semibold uppercase text-[#8a938e]">
              {activeContext.mode === "staff" ? "Firm workspace" : "Tax account"}
            </p>
            <nav className="mt-3 space-y-1" aria-label="Workspace navigation">
              {navigation.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex h-9 items-center gap-2.5 rounded-[5px] px-2.5 text-sm ${
                    index === 0
                      ? "bg-[#e1ece5] font-semibold text-[#1d5a3b]"
                      : "text-[#5b6760] hover:bg-[#f0f3f1] hover:text-[#223029]"
                  }`}
                >
                  <item.icon aria-hidden="true" className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-[#e1e4e1] p-3">
            <Link
              href="/"
              className="flex h-9 items-center gap-2.5 rounded-[5px] px-2.5 text-sm text-[#5b6760] hover:bg-[#f0f3f1]"
            >
              <Building2 aria-hidden="true" className="size-4" />
              Public site
            </Link>
            <button
              type="button"
              className="flex h-9 w-full items-center gap-2.5 rounded-[5px] px-2.5 text-sm text-[#5b6760] hover:bg-[#f0f3f1]"
            >
              <Settings aria-hidden="true" className="size-4" />
              Settings
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <nav
            className="flex gap-1 overflow-x-auto border-b border-[#dfe3df] bg-white px-3 py-2 lg:hidden"
            aria-label="Mobile workspace navigation"
          >
            {navigation.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[4px] px-2.5 text-xs ${
                  index === 0
                    ? "bg-[#e1ece5] font-semibold text-[#1d5a3b]"
                    : "text-[#637068]"
                }`}
              >
                <item.icon aria-hidden="true" className="size-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </div>
    </div>
  );
}
