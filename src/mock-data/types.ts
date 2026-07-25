export type EntityId = string
export type ISODateString = string
export type TaxYear = 2024 | 2025
export type MoneyValue = number
export type FieldValue = string | number | boolean | null

export type UserRole =
  | "individual-taxpayer"
  | "business-owner"
  | "tax-preparer"
  | "reviewer"
  | "firm-administrator"
  | "seasonal-staff"

export type WorkspaceMode = "staff" | "client"

export type Permission =
  | "view-own-returns"
  | "upload-own-documents"
  | "message-firm"
  | "edit-return-fields"
  | "verify-ai-fields"
  | "review-returns"
  | "manage-team"
  | "manage-firm"
  | "view-internal-notes"

export interface Firm {
  id: EntityId
  name: string
  shortName: string
}

export interface AccessContext {
  id: EntityId
  label: string
  mode: WorkspaceMode
  role: UserRole
  firmId?: EntityId
  clientId?: EntityId
  permissions: Permission[]
}

export interface User {
  id: EntityId
  identityId: EntityId
  name: string
  initials: string
  role: UserRole
  avatarUrl: string
  firmId?: EntityId
  clientId?: EntityId
  accessContexts: AccessContext[]
}

export type ClientKind = "individual" | "business"
export type OnboardingStatus = "not-started" | "in-progress" | "complete"

export interface ClientOnboarding {
  status: OnboardingStatus
  completedStepIds: string[]
  currentStepId?: string
}

export interface Client {
  id: EntityId
  kind: ClientKind
  displayName: string
  legalName: string
  primaryContactUserId: EntityId
  taxReturnIds: EntityId[]
  onboarding: ClientOnboarding
}

export type ReturnStatus =
  | "not-started"
  | "awaiting-client-info"
  | "in-preparation"
  | "in-review"
  | "client-approval-needed"
  | "filed"
  | "amended"

export interface ReturnStatusEvent {
  status: ReturnStatus
  changedAt: ISODateString
  changedByUserId: EntityId
  detail?: string
}

export interface TaxReturn {
  id: EntityId
  taxYear: TaxYear
  clientId: EntityId
  returnType: "individual-1040" | "partnership-1065" | "corporation-1120-s"
  assignedPreparerId?: EntityId
  assignedReviewerId?: EntityId
  status: ReturnStatus
  statusDetail: string
  deadline: ISODateString
  lastActivityAt: ISODateString
  waitingSince?: ISODateString
  returnFieldIds: EntityId[]
  sourceDocumentIds: EntityId[]
  taskIds: EntityId[]
  threadIds: EntityId[]
  issueIds: EntityId[]
  statusHistory: ReturnStatusEvent[]
}

export type FieldOrigin =
  | "ai-extracted"
  | "client-entered"
  | "preparer-entered"
  | "calculated"

export type FieldState =
  | "ai-unverified"
  | "verified"
  | "locked"
  | "editable"
  | "needs-approval"

export type FieldUnit =
  | "currency"
  | "percentage"
  | "date"
  | "text"
  | "integer"
  | "boolean"

export interface DocumentBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface SourcePointer {
  documentId: EntityId
  pageNumber: number
  blockId: EntityId
  sectionLabel: string
  bounds: DocumentBounds
}

export interface ReturnField {
  id: EntityId
  taxReturnId: EntityId
  section: string
  form: string
  locator: string
  label: string
  value: FieldValue
  displayValue: string
  unit: FieldUnit
  origin: FieldOrigin
  state: FieldState
  confidence?: number
  sourcePointers: SourcePointer[]
  transformationId?: EntityId
  aiOutputId?: EntityId
  updatedAt: ISODateString
  updatedByUserId: EntityId
}

export type DocumentType =
  | "w-2"
  | "1099-int"
  | "1099-k"
  | "1099-b"
  | "1098-e"
  | "receipt"
  | "prior-year-return"
  | "profit-and-loss"
  | "payroll-report"
  | "bank-statement"
  | "fixed-asset-schedule"
  | "invoice"
  | "lease"
  | "identity"
  | "other"

export type DocumentProcessingStatus =
  | "uploaded"
  | "processing"
  | "needs-review"
  | "ready"

export interface DocumentBlock {
  id: EntityId
  kind: "heading" | "label-value" | "paragraph" | "table-row"
  text: string
  label?: string
  value?: string
  bounds: DocumentBounds
}

export interface DocumentPage {
  pageNumber: number
  width: number
  height: number
  blocks: DocumentBlock[]
}

export interface SourceDocument {
  id: EntityId
  taxReturnId: EntityId
  filename: string
  documentType: DocumentType
  pages: DocumentPage[]
  uploadedAt: ISODateString
  uploadedByUserId: EntityId
  processingStatus: DocumentProcessingStatus
  taxYear?: TaxYear
  tags: string[]
}

export interface TransformationInput {
  label: string
  value: FieldValue
  displayValue: string
  sourceFieldId?: EntityId
  sourcePointer?: SourcePointer
}

export interface TransformationStep {
  order: number
  expression: string
  result: string
}

export interface Transformation {
  id: EntityId
  taxReturnId: EntityId
  returnFieldId: EntityId
  explanation: string
  formula: string
  inputs: TransformationInput[]
  steps: TransformationStep[]
}

export type TaskStatus = "open" | "in-progress" | "blocked" | "complete"
export type TaskPriority = "low" | "normal" | "high" | "urgent"

export type EntityReference =
  | { kind: "document"; id: EntityId }
  | { kind: "message"; id: EntityId }
  | { kind: "thread"; id: EntityId }
  | { kind: "issue"; id: EntityId }
  | { kind: "field"; id: EntityId }
  | { kind: "task"; id: EntityId }

export interface Task {
  id: EntityId
  title: string
  ownerUserId: EntityId
  requestedByUserId: EntityId
  taxReturnId: EntityId
  links: EntityReference[]
  dueDate: ISODateString
  status: TaskStatus
  priority: TaskPriority
  visibility: MessageVisibility
  completedAt?: ISODateString
}

export type MessageVisibility = "internal" | "client-visible"

export interface Message {
  id: EntityId
  threadId: EntityId
  taxReturnId: EntityId
  senderUserId: EntityId
  sentAt: ISODateString
  body: string
  visibility: MessageVisibility
  outstandingAction: boolean
  linkedEntities: EntityReference[]
}

export interface Thread {
  id: EntityId
  taxReturnId: EntityId
  subject: string
  anchor: EntityReference
  visibility: MessageVisibility
  participantUserIds: EntityId[]
  messageIds: EntityId[]
  outstandingTaskId?: EntityId
  lastMessageAt: ISODateString
  resolvedAt?: ISODateString
}

export type IssueStatus = "open" | "resolved" | "accepted-risk"
export type IssueSeverity = "info" | "warning" | "critical"

export interface ReviewIssue {
  id: EntityId
  taxReturnId: EntityId
  title: string
  description: string
  severity: IssueSeverity
  status: IssueStatus
  visibility: MessageVisibility
  linkedFieldIds: EntityId[]
  linkedDocumentIds: EntityId[]
  aiOutputId?: EntityId
  ownerUserId: EntityId
  createdAt: ISODateString
}

export type EvidencePointer =
  | {
      kind: "field"
      fieldId: EntityId
      label: string
    }
  | {
      kind: "document"
      documentId: EntityId
      pageNumber?: number
      blockId?: EntityId
      label: string
    }
  | {
      kind: "transformation"
      transformationId: EntityId
      label: string
    }

export type AIOutputKind =
  | "extraction"
  | "anomaly"
  | "recommendation"
  | "correction-suggestion"

export type AIReviewStatus = "pending-review" | "accepted" | "overridden"

export interface AIRecommendation {
  label: string
  proposedValue?: FieldValue
  action?: string
}

export interface AICorrection {
  id: EntityId
  previousRecommendation: AIRecommendation
  correctedRecommendation: AIRecommendation
  reason: string
  correctedByUserId: EntityId
  correctedAt: ISODateString
}

export interface AIOutput {
  id: EntityId
  kind: AIOutputKind
  taxReturnId: EntityId
  target: EntityReference
  recommendation: AIRecommendation
  confidence: number
  summary: string
  why: string
  evidence: EvidencePointer[]
  reviewStatus: AIReviewStatus
  generatedAt: ISODateString
  correctionHistory: AICorrection[]
}

export interface MockDatabase {
  firms: Firm[]
  users: User[]
  clients: Client[]
  taxReturns: TaxReturn[]
  returnFields: ReturnField[]
  sourceDocuments: SourceDocument[]
  transformations: Transformation[]
  tasks: Task[]
  threads: Thread[]
  messages: Message[]
  issues: ReviewIssue[]
  aiOutputs: AIOutput[]
}
