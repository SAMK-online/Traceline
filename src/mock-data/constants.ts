import type {
  FieldState,
  Permission,
  ReturnStatus,
  UserRole,
} from "@/mock-data/types"

export const RETURN_STATUSES: ReturnStatus[] = [
  "not-started",
  "awaiting-client-info",
  "in-preparation",
  "in-review",
  "client-approval-needed",
  "filed",
  "amended",
]

export const RETURN_STATUS_LABELS: Record<ReturnStatus, string> = {
  "not-started": "Not Started",
  "awaiting-client-info": "Awaiting Client Info",
  "in-preparation": "In Preparation",
  "in-review": "In Review",
  "client-approval-needed": "Client Approval Needed",
  filed: "Filed",
  amended: "Amended",
}

export const FIELD_STATES: FieldState[] = [
  "ai-unverified",
  "verified",
  "locked",
  "editable",
  "needs-approval",
]

export const FIELD_STATE_LABELS: Record<FieldState, string> = {
  "ai-unverified": "AI generated, unverified",
  verified: "Verified",
  locked: "Locked",
  editable: "Editable",
  "needs-approval": "Needs approval",
}

export const AI_CONFIDENCE_THRESHOLDS = {
  high: 90,
  review: 70,
} as const

export const ROLE_LABELS: Record<UserRole, string> = {
  "individual-taxpayer": "Individual taxpayer",
  "business-owner": "Business owner",
  "tax-preparer": "Tax preparer",
  reviewer: "Reviewer",
  "firm-administrator": "Firm administrator",
  "seasonal-staff": "Seasonal staff",
}

export const STAFF_PERMISSIONS: Record<
  Extract<
    UserRole,
    "tax-preparer" | "reviewer" | "firm-administrator" | "seasonal-staff"
  >,
  Permission[]
> = {
  "tax-preparer": [
    "edit-return-fields",
    "verify-ai-fields",
    "view-internal-notes",
  ],
  reviewer: [
    "edit-return-fields",
    "verify-ai-fields",
    "review-returns",
    "view-internal-notes",
  ],
  "firm-administrator": [
    "edit-return-fields",
    "verify-ai-fields",
    "review-returns",
    "manage-team",
    "manage-firm",
    "view-internal-notes",
  ],
  "seasonal-staff": ["edit-return-fields"],
}

export const CLIENT_PERMISSIONS: Permission[] = [
  "view-own-returns",
  "upload-own-documents",
  "message-firm",
]
