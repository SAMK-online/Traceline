import type {
  ReturnStatus,
  TaskPriority,
  TaskStatus,
  UserRole,
} from "@/mock-data/types";

export interface DashboardTask {
  id: string;
  title: string;
  taxReturnId: string;
  clientName: string;
  ownerUserId: string;
  ownerName: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  visibility: "internal" | "client-visible";
}

export interface ReturnSummary {
  id: string;
  clientId: string;
  clientName: string;
  clientKind: "individual" | "business";
  taxYear: number;
  returnType: string;
  status: ReturnStatus;
  statusLabel: string;
  statusDetail: string;
  deadline: string;
  lastActivityAt: string;
  waitingSince?: string;
  assignedPreparerId?: string;
  assignedPreparerName?: string;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  fieldCount: number;
  documentCount: number;
  openTaskCount: number;
  openIssueCount: number;
  priorityScore: number;
  urgencyReason: string;
  nextTask?: DashboardTask;
}

export interface TeamLoadSummary {
  userId: string;
  name: string;
  initials: string;
  role: UserRole;
  activeReturns: number;
  urgentReturns: number;
  openTasks: number;
}

export interface WorkspaceDashboardData {
  returns: ReturnSummary[];
  tasks: DashboardTask[];
  teamLoad: TeamLoadSummary[];
}
