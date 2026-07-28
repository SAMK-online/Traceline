import { RETURN_STATUS_LABELS } from "@/mock-data/constants";
import { mockRepository } from "@/mock-data/repository";
import type { TaxReturnWorkspace } from "@/mock-data/repository";
import type {
  DashboardTask,
  ReturnSummary,
  TeamLoadSummary,
  WorkspaceDashboardData,
} from "@/lib/workspace-types";

const AS_OF = new Date("2026-07-28T09:00:00-04:00");

function daysBetween(later: string, earlier: Date | string) {
  const start = typeof earlier === "string" ? new Date(earlier) : earlier;
  return Math.max(
    0,
    Math.ceil((new Date(later).getTime() - start.getTime()) / 86_400_000),
  );
}

function taskToDashboardTask(
  task: TaxReturnWorkspace["tasks"][number],
  workspace: TaxReturnWorkspace,
): DashboardTask {
  const owner =
    workspace.client.primaryContactUserId === task.ownerUserId
      ? workspace.client.displayName
      : workspace.preparer?.id === task.ownerUserId
        ? workspace.preparer.name
        : workspace.reviewer?.id === task.ownerUserId
          ? workspace.reviewer.name
          : "Firm team";

  return {
    id: task.id,
    title: task.title,
    taxReturnId: task.taxReturnId,
    clientName: workspace.client.displayName,
    ownerUserId: task.ownerUserId,
    ownerName: owner,
    dueDate: task.dueDate,
    status: task.status,
    priority: task.priority,
    visibility: task.visibility,
  };
}

function summarizeReturn(workspace: TaxReturnWorkspace): ReturnSummary {
  const { taxReturn } = workspace;
  const openTasks = workspace.tasks.filter((task) => task.status !== "complete");
  const urgentTask = openTasks
    .toSorted((a, b) => {
      const priority = { urgent: 4, high: 3, normal: 2, low: 1 };
      return (
        priority[b.priority] - priority[a.priority] ||
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    })
    .at(0);
  const daysToDeadline = daysBetween(taxReturn.deadline, AS_OF);
  const waitingDays = taxReturn.waitingSince
    ? daysBetween(AS_OF.toISOString(), taxReturn.waitingSince)
    : 0;
  const criticalIssues = workspace.issues.filter(
    (issue) => issue.status === "open" && issue.severity === "critical",
  ).length;

  const priorityScore =
    Math.max(0, 60 - daysToDeadline) +
    waitingDays * 3 +
    criticalIssues * 35 +
    openTasks.filter((task) => task.priority === "urgent").length * 25 +
    (taxReturn.status === "awaiting-client-info" ? 18 : 0) +
    (taxReturn.status === "client-approval-needed" ? 12 : 0);

  const urgencyReason = criticalIssues
    ? `${criticalIssues} critical issue${criticalIssues > 1 ? "s" : ""} blocks review`
    : urgentTask?.priority === "urgent"
      ? urgentTask.title
      : waitingDays > 0
        ? `Waiting ${waitingDays} day${waitingDays === 1 ? "" : "s"}`
        : `${daysToDeadline} days to deadline`;

  return {
    id: taxReturn.id,
    clientId: taxReturn.clientId,
    clientName: workspace.client.displayName,
    clientKind: workspace.client.kind,
    taxYear: taxReturn.taxYear,
    returnType: taxReturn.returnType,
    status: taxReturn.status,
    statusLabel: RETURN_STATUS_LABELS[taxReturn.status],
    statusDetail: taxReturn.statusDetail,
    deadline: taxReturn.deadline,
    lastActivityAt: taxReturn.lastActivityAt,
    waitingSince: taxReturn.waitingSince,
    assignedPreparerId: workspace.preparer?.id,
    assignedPreparerName: workspace.preparer?.name,
    assignedReviewerId: workspace.reviewer?.id,
    assignedReviewerName: workspace.reviewer?.name,
    fieldCount: workspace.fields.length,
    documentCount: workspace.documents.length,
    openTaskCount: openTasks.length,
    openIssueCount: workspace.issues.filter((issue) => issue.status === "open")
      .length,
    priorityScore,
    urgencyReason,
    nextTask: urgentTask
      ? taskToDashboardTask(urgentTask, workspace)
      : undefined,
  };
}

export async function getWorkspaceDashboardData(): Promise<WorkspaceDashboardData> {
  const [taxReturns, users] = await Promise.all([
    mockRepository.listTaxReturns(),
    mockRepository.listUsers(),
  ]);
  const workspaces = await Promise.all(
    taxReturns.map((taxReturn) =>
      mockRepository.getTaxReturnWorkspace(taxReturn.id),
    ),
  );
  const returns = workspaces
    .map(summarizeReturn)
    .toSorted((a, b) => b.priorityScore - a.priorityScore);
  const tasks = workspaces
    .flatMap((workspace) =>
      workspace.tasks
        .filter((task) => task.status !== "complete")
        .map((task) => taskToDashboardTask(task, workspace)),
    )
    .toSorted(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
  const staff = users.filter((user) =>
    [
      "tax-preparer",
      "reviewer",
      "firm-administrator",
      "seasonal-staff",
    ].includes(user.role),
  );
  const teamLoad: TeamLoadSummary[] = staff.map((user) => {
    const assignedReturns = returns.filter(
      (taxReturn) =>
        taxReturn.assignedPreparerId === user.id ||
        taxReturn.assignedReviewerId === user.id,
    );

    return {
      userId: user.id,
      name: user.name,
      initials: user.initials,
      role: user.role,
      activeReturns: assignedReturns.length,
      urgentReturns: assignedReturns.filter(
        (taxReturn) => taxReturn.priorityScore >= 40,
      ).length,
      openTasks: tasks.filter((task) => task.ownerUserId === user.id).length,
    };
  });

  return { returns, tasks, teamLoad };
}
