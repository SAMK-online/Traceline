import { mockDatabase } from "@/mock-data/database"
import type {
  Client,
  DocumentProcessingStatus,
  DocumentType,
  MessageVisibility,
  ReturnStatus,
  SourceDocument,
  TaxReturn,
  User,
} from "@/mock-data/types"

export interface PageResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface TaxReturnFilters {
  assignedUserId?: string
  clientId?: string
  statuses?: ReturnStatus[]
}

export interface DocumentFilters {
  taxReturnId: string
  query?: string
  documentTypes?: DocumentType[]
  processingStatuses?: DocumentProcessingStatus[]
  tags?: string[]
  page?: number
  pageSize?: number
}

export interface TaxReturnWorkspace {
  taxReturn: TaxReturn
  client: Client
  preparer?: User
  reviewer?: User
  fields: typeof mockDatabase.returnFields
  documents: typeof mockDatabase.sourceDocuments
  transformations: typeof mockDatabase.transformations
  tasks: typeof mockDatabase.tasks
  threads: typeof mockDatabase.threads
  messages: typeof mockDatabase.messages
  issues: typeof mockDatabase.issues
  aiOutputs: typeof mockDatabase.aiOutputs
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function findRequired<T extends { id: string }>(
  collection: T[],
  id: string,
  entityName: string,
) {
  const entity = collection.find((item) => item.id === id)

  if (!entity) {
    throw new Error(`${entityName} "${id}" was not found in mock data`)
  }

  return entity
}

function includesSearchText(document: SourceDocument, query: string) {
  const haystack = [
    document.filename,
    document.documentType,
    ...document.tags,
    ...document.pages.flatMap((page) =>
      page.blocks.flatMap((block) => [
        block.text,
        block.label ?? "",
        block.value ?? "",
      ]),
    ),
  ]
    .join(" ")
    .toLocaleLowerCase()

  return haystack.includes(query.toLocaleLowerCase())
}

export const mockRepository = {
  async listUsers() {
    return clone(mockDatabase.users)
  },

  async getUser(userId: string) {
    return clone(findRequired(mockDatabase.users, userId, "User"))
  },

  async listClients() {
    return clone(mockDatabase.clients)
  },

  async getClient(clientId: string) {
    return clone(findRequired(mockDatabase.clients, clientId, "Client"))
  },

  async listTaxReturns(filters: TaxReturnFilters = {}) {
    const returns = mockDatabase.taxReturns.filter((taxReturn) => {
      const matchesAssignee =
        !filters.assignedUserId ||
        taxReturn.assignedPreparerId === filters.assignedUserId ||
        taxReturn.assignedReviewerId === filters.assignedUserId
      const matchesClient =
        !filters.clientId || taxReturn.clientId === filters.clientId
      const matchesStatus =
        !filters.statuses?.length ||
        filters.statuses.includes(taxReturn.status)

      return matchesAssignee && matchesClient && matchesStatus
    })

    return clone(returns)
  },

  async getTaxReturnWorkspace(
    taxReturnId: string,
    messageVisibility?: MessageVisibility,
  ): Promise<TaxReturnWorkspace> {
    const taxReturn = findRequired(
      mockDatabase.taxReturns,
      taxReturnId,
      "Tax return",
    )
    const client = findRequired(
      mockDatabase.clients,
      taxReturn.clientId,
      "Client",
    )
    const returnFieldIds = new Set(taxReturn.returnFieldIds)
    const sourceDocumentIds = new Set(taxReturn.sourceDocumentIds)
    const transformationIds = new Set(
      mockDatabase.returnFields
        .filter((field) => returnFieldIds.has(field.id))
        .flatMap((field) =>
          field.transformationId ? [field.transformationId] : [],
        ),
    )
    const aiOutputIds = new Set(
      mockDatabase.returnFields
        .filter((field) => returnFieldIds.has(field.id))
        .flatMap((field) => (field.aiOutputId ? [field.aiOutputId] : [])),
    )

    return clone({
      taxReturn,
      client,
      preparer: taxReturn.assignedPreparerId
        ? mockDatabase.users.find(
            (user) => user.id === taxReturn.assignedPreparerId,
          )
        : undefined,
      reviewer: taxReturn.assignedReviewerId
        ? mockDatabase.users.find(
            (user) => user.id === taxReturn.assignedReviewerId,
          )
        : undefined,
      fields: mockDatabase.returnFields.filter((field) =>
        returnFieldIds.has(field.id),
      ),
      documents: mockDatabase.sourceDocuments.filter((document) =>
        sourceDocumentIds.has(document.id),
      ),
      transformations: mockDatabase.transformations.filter((transformation) =>
        transformationIds.has(transformation.id),
      ),
      tasks: mockDatabase.tasks.filter(
        (task) =>
          task.taxReturnId === taxReturnId &&
          (!messageVisibility || task.visibility === messageVisibility),
      ),
      threads: mockDatabase.threads.filter(
        (thread) =>
          thread.taxReturnId === taxReturnId &&
          (!messageVisibility || thread.visibility === messageVisibility),
      ),
      messages: mockDatabase.messages.filter(
        (message) =>
          message.taxReturnId === taxReturnId &&
          (!messageVisibility || message.visibility === messageVisibility),
      ),
      issues: mockDatabase.issues.filter(
        (issue) =>
          issue.taxReturnId === taxReturnId &&
          (!messageVisibility || issue.visibility === messageVisibility),
      ),
      aiOutputs: mockDatabase.aiOutputs.filter(
        (output) =>
          output.taxReturnId === taxReturnId || aiOutputIds.has(output.id),
      ),
    })
  },

  async listDocuments({
    taxReturnId,
    query = "",
    documentTypes = [],
    processingStatuses = [],
    tags = [],
    page = 1,
    pageSize = 25,
  }: DocumentFilters): Promise<PageResult<SourceDocument>> {
    const filteredDocuments = mockDatabase.sourceDocuments.filter(
      (document) => {
        const matchesReturn = document.taxReturnId === taxReturnId
        const matchesQuery = !query || includesSearchText(document, query)
        const matchesType =
          !documentTypes.length ||
          documentTypes.includes(document.documentType)
        const matchesProcessingStatus =
          !processingStatuses.length ||
          processingStatuses.includes(document.processingStatus)
        const matchesTags =
          !tags.length || tags.every((tag) => document.tags.includes(tag))

        return (
          matchesReturn &&
          matchesQuery &&
          matchesType &&
          matchesProcessingStatus &&
          matchesTags
        )
      },
    )
    const boundedPageSize = Math.max(1, Math.min(pageSize, 100))
    const pageCount = Math.max(
      1,
      Math.ceil(filteredDocuments.length / boundedPageSize),
    )
    const boundedPage = Math.max(1, Math.min(page, pageCount))
    const offset = (boundedPage - 1) * boundedPageSize

    return clone({
      items: filteredDocuments.slice(offset, offset + boundedPageSize),
      total: filteredDocuments.length,
      page: boundedPage,
      pageSize: boundedPageSize,
      pageCount,
    })
  },
}
