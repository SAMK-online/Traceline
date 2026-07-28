import {
  demoAIOutputs,
  demoIssues,
  demoMessages,
  demoReturnFields,
  demoSourceDocuments,
  demoTasks,
  demoTaxReturns,
  demoThreads,
  demoTransformations,
} from "@/mock-data/demo-data"
import { generateComplexReturnData } from "@/mock-data/generate-complex-return"
import { clients, firms, users } from "@/mock-data/people"
import type { MockDatabase } from "@/mock-data/types"

const complexReturnData = generateComplexReturnData()

export const mockDatabase: MockDatabase = {
  firms,
  users,
  clients,
  taxReturns: demoTaxReturns.map((taxReturn) =>
    taxReturn.id === "return-northstar-2025"
      ? {
          ...taxReturn,
          returnFieldIds: [
            ...taxReturn.returnFieldIds,
            ...complexReturnData.returnFields.map((field) => field.id),
          ],
          sourceDocumentIds: [
            ...taxReturn.sourceDocumentIds,
            ...complexReturnData.sourceDocuments.map((document) => document.id),
          ],
        }
      : taxReturn,
  ),
  returnFields: [
    ...demoReturnFields,
    ...complexReturnData.returnFields,
  ],
  sourceDocuments: [
    ...demoSourceDocuments,
    ...complexReturnData.sourceDocuments,
  ],
  transformations: [
    ...demoTransformations,
    ...complexReturnData.transformations,
  ],
  tasks: demoTasks,
  threads: demoThreads,
  messages: demoMessages,
  issues: demoIssues,
  aiOutputs: [...demoAIOutputs, ...complexReturnData.aiOutputs],
}
