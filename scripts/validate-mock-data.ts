import { mockDatabase } from "../src/mock-data/database"
import { LARGE_RETURN_CONFIG } from "../src/mock-data/generate-complex-return"
import { mockRepository } from "../src/mock-data/repository"
import type { EntityReference, UserRole } from "../src/mock-data/types"

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

function assertUniqueIds(
  collectionName: string,
  collection: Array<{ id: string }>,
) {
  const ids = new Set<string>()

  for (const entity of collection) {
    invariant(
      !ids.has(entity.id),
      `${collectionName} contains duplicate id "${entity.id}"`,
    )
    ids.add(entity.id)
  }
}

const ids = {
  users: new Set(mockDatabase.users.map((item) => item.id)),
  clients: new Set(mockDatabase.clients.map((item) => item.id)),
  taxReturns: new Set(mockDatabase.taxReturns.map((item) => item.id)),
  returnFields: new Set(mockDatabase.returnFields.map((item) => item.id)),
  sourceDocuments: new Set(
    mockDatabase.sourceDocuments.map((item) => item.id),
  ),
  transformations: new Set(
    mockDatabase.transformations.map((item) => item.id),
  ),
  tasks: new Set(mockDatabase.tasks.map((item) => item.id)),
  threads: new Set(mockDatabase.threads.map((item) => item.id)),
  messages: new Set(mockDatabase.messages.map((item) => item.id)),
  issues: new Set(mockDatabase.issues.map((item) => item.id)),
  aiOutputs: new Set(mockDatabase.aiOutputs.map((item) => item.id)),
}

function referenceExists(reference: EntityReference) {
  switch (reference.kind) {
    case "document":
      return ids.sourceDocuments.has(reference.id)
    case "field":
      return ids.returnFields.has(reference.id)
    case "issue":
      return ids.issues.has(reference.id)
    case "message":
      return ids.messages.has(reference.id)
    case "task":
      return ids.tasks.has(reference.id)
    case "thread":
      return ids.threads.has(reference.id)
  }
}

for (const [collectionName, collection] of Object.entries(mockDatabase)) {
  assertUniqueIds(collectionName, collection)
}

invariant(
  mockDatabase.taxReturns.length >= 5,
  "Expected at least five tax returns",
)
invariant(
  mockDatabase.sourceDocuments.length >= 170,
  "Expected enough source documents for scale testing",
)

const roles = new Set(mockDatabase.users.map((user) => user.role))
const expectedRoles: UserRole[] = [
  "individual-taxpayer",
  "business-owner",
  "tax-preparer",
  "reviewer",
  "firm-administrator",
  "seasonal-staff",
]

for (const expectedRole of expectedRoles) {
  invariant(roles.has(expectedRole), `Missing user role "${expectedRole}"`)
}

const dualContextUser = mockDatabase.users.find(
  (user) => user.id === "user-mateo-ruiz",
)
invariant(dualContextUser, "Missing dual-context employee fixture")
invariant(
  dualContextUser.accessContexts.some((context) => context.mode === "staff") &&
    dualContextUser.accessContexts.some((context) => context.mode === "client"),
  "Dual-context employee must have both staff and client workspaces",
)

for (const client of mockDatabase.clients) {
  invariant(
    ids.users.has(client.primaryContactUserId),
    `Client "${client.id}" has an unknown primary contact`,
  )
  for (const taxReturnId of client.taxReturnIds) {
    invariant(
      ids.taxReturns.has(taxReturnId),
      `Client "${client.id}" references unknown return "${taxReturnId}"`,
    )
  }
}

for (const taxReturn of mockDatabase.taxReturns) {
  invariant(
    ids.clients.has(taxReturn.clientId),
    `Return "${taxReturn.id}" references an unknown client`,
  )
  invariant(
    !taxReturn.assignedPreparerId ||
      ids.users.has(taxReturn.assignedPreparerId),
    `Return "${taxReturn.id}" references an unknown preparer`,
  )
  invariant(
    !taxReturn.assignedReviewerId ||
      ids.users.has(taxReturn.assignedReviewerId),
    `Return "${taxReturn.id}" references an unknown reviewer`,
  )

  for (const fieldId of taxReturn.returnFieldIds) {
    invariant(
      ids.returnFields.has(fieldId),
      `Return "${taxReturn.id}" references unknown field "${fieldId}"`,
    )
  }
  for (const documentId of taxReturn.sourceDocumentIds) {
    invariant(
      ids.sourceDocuments.has(documentId),
      `Return "${taxReturn.id}" references unknown document "${documentId}"`,
    )
  }
  for (const taskId of taxReturn.taskIds) {
    invariant(
      ids.tasks.has(taskId),
      `Return "${taxReturn.id}" references unknown task "${taskId}"`,
    )
  }
  for (const threadId of taxReturn.threadIds) {
    invariant(
      ids.threads.has(threadId),
      `Return "${taxReturn.id}" references unknown thread "${threadId}"`,
    )
  }
  for (const issueId of taxReturn.issueIds) {
    invariant(
      ids.issues.has(issueId),
      `Return "${taxReturn.id}" references unknown issue "${issueId}"`,
    )
  }
}

for (const field of mockDatabase.returnFields) {
  invariant(
    ids.taxReturns.has(field.taxReturnId),
    `Field "${field.id}" references an unknown return`,
  )
  invariant(
    ids.users.has(field.updatedByUserId),
    `Field "${field.id}" references an unknown updater`,
  )
  invariant(
    !field.transformationId ||
      ids.transformations.has(field.transformationId),
    `Field "${field.id}" references an unknown transformation`,
  )
  invariant(
    !field.aiOutputId || ids.aiOutputs.has(field.aiOutputId),
    `Field "${field.id}" references an unknown AI output`,
  )

  for (const pointer of field.sourcePointers) {
    const document = mockDatabase.sourceDocuments.find(
      (candidate) => candidate.id === pointer.documentId,
    )
    invariant(
      document,
      `Field "${field.id}" references unknown source document "${pointer.documentId}"`,
    )
    invariant(
      document.pages.some(
        (page) =>
          page.pageNumber === pointer.pageNumber &&
          page.blocks.some((block) => block.id === pointer.blockId),
      ),
      `Field "${field.id}" points to missing block "${pointer.blockId}"`,
    )
  }
}

for (const transformation of mockDatabase.transformations) {
  invariant(
    ids.returnFields.has(transformation.returnFieldId),
    `Transformation "${transformation.id}" references an unknown field`,
  )
}

for (const task of mockDatabase.tasks) {
  invariant(
    ids.users.has(task.ownerUserId) && ids.users.has(task.requestedByUserId),
    `Task "${task.id}" references an unknown user`,
  )
  invariant(
    task.links.every(referenceExists),
    `Task "${task.id}" has a broken entity link`,
  )
}

for (const thread of mockDatabase.threads) {
  invariant(
    referenceExists(thread.anchor),
    `Thread "${thread.id}" has a broken anchor`,
  )
  invariant(
    thread.messageIds.every((messageId) => ids.messages.has(messageId)),
    `Thread "${thread.id}" references an unknown message`,
  )
}

for (const message of mockDatabase.messages) {
  invariant(
    ids.threads.has(message.threadId) && ids.users.has(message.senderUserId),
    `Message "${message.id}" has a broken thread or sender link`,
  )
  invariant(
    message.linkedEntities.every(referenceExists),
    `Message "${message.id}" has a broken entity link`,
  )
}

for (const output of mockDatabase.aiOutputs) {
  invariant(
    referenceExists(output.target),
    `AI output "${output.id}" has a broken target`,
  )
  invariant(
    output.confidence >= 0 && output.confidence <= 100,
    `AI output "${output.id}" has an invalid confidence score`,
  )
}

const generatedDocuments = mockDatabase.sourceDocuments.filter((document) =>
  document.id.startsWith("doc-northstar-generated-"),
)
const generatedFields = mockDatabase.returnFields.filter((field) =>
  field.id.startsWith("field-northstar-generated-"),
)
invariant(
  generatedDocuments.length === LARGE_RETURN_CONFIG.documentCount,
  "Large return document generator produced the wrong count",
)
invariant(
  generatedFields.length === LARGE_RETURN_CONFIG.fieldCount,
  "Large return field generator produced the wrong count",
)
invariant(
  generatedDocuments.length >= 150 && generatedDocuments.length <= 300,
  "Large return document count must stay between 150 and 300",
)

const correctedAIOutput = mockDatabase.aiOutputs.find(
  (output) => output.reviewStatus === "overridden",
)
invariant(
  correctedAIOutput?.correctionHistory.length,
  "Expected at least one corrected AI output",
)

async function validateRepositoryQueries() {
  const [documentPage, searchResults, clientWorkspace] = await Promise.all([
    mockRepository.listDocuments({
      taxReturnId: LARGE_RETURN_CONFIG.taxReturnId,
      page: 2,
      pageSize: 25,
    }),
    mockRepository.listDocuments({
      taxReturnId: LARGE_RETURN_CONFIG.taxReturnId,
      query: "payroll",
      pageSize: 100,
    }),
    mockRepository.getTaxReturnWorkspace(
      "return-parkside-2025",
      "client-visible",
    ),
  ])

  invariant(
    documentPage.total === LARGE_RETURN_CONFIG.documentCount + 4,
    "Document pagination did not include the full large return",
  )
  invariant(
    documentPage.page === 2 && documentPage.items.length === 25,
    "Document pagination returned the wrong page",
  )
  invariant(searchResults.total > 0, "Document search returned no results")
  invariant(
    searchResults.items.every((document) =>
      [
        document.filename,
        document.documentType,
        ...document.tags,
        ...document.pages.flatMap((page) =>
          page.blocks.map((block) => block.text),
        ),
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes("payroll"),
    ),
    "Document search returned an item that does not match the query",
  )
  invariant(
    clientWorkspace.tasks.every(
      (task) => task.visibility === "client-visible",
    ) &&
      clientWorkspace.threads.every(
        (thread) => thread.visibility === "client-visible",
      ) &&
      clientWorkspace.messages.every(
        (message) => message.visibility === "client-visible",
      ) &&
      clientWorkspace.issues.every(
        (issue) => issue.visibility === "client-visible",
      ),
    "Client workspace leaked an internal workflow object",
  )

  console.log(
    [
      "Mock data valid.",
      `${mockDatabase.users.length} users`,
      `${mockDatabase.clients.length} clients`,
      `${mockDatabase.taxReturns.length} returns`,
      `${mockDatabase.sourceDocuments.length} documents`,
      `${mockDatabase.returnFields.length} fields`,
      `${mockDatabase.aiOutputs.length} AI outputs`,
    ].join(" | "),
  )
}

validateRepositoryQueries().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
