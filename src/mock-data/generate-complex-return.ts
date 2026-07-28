import { createFakeAIOutput } from "@/lib/fake-ai"
import type {
  AIOutput,
  DocumentType,
  ReturnField,
  SourceDocument,
  Transformation,
} from "@/mock-data/types"

export const LARGE_RETURN_CONFIG = {
  taxReturnId: "return-northstar-2025",
  documentCount: 180,
  fieldCount: 240,
  seed: 20250727,
} as const

interface GeneratedComplexReturnData {
  sourceDocuments: SourceDocument[]
  returnFields: ReturnField[]
  transformations: Transformation[]
  aiOutputs: AIOutput[]
}

const documentTypes: DocumentType[] = [
  "invoice",
  "bank-statement",
  "payroll-report",
  "receipt",
  "other",
  "fixed-asset-schedule",
]

const sections = [
  "Revenue detail",
  "Cost of goods sold",
  "Payroll",
  "Operating expenses",
  "Fixed assets",
  "Other deductions",
]

function seededRandom(seed: number) {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function generatedTimestamp(index: number) {
  const base = Date.UTC(2026, 5, 1, 13, 0, 0)
  return new Date(base + index * 2_760_000).toISOString()
}

export function generateComplexReturnData(
  config = LARGE_RETURN_CONFIG,
): GeneratedComplexReturnData {
  const random = seededRandom(config.seed)

  const sourceDocuments = Array.from(
    { length: config.documentCount },
    (_, index): SourceDocument => {
      const ordinal = index + 1
      const documentId = `doc-northstar-generated-${ordinal
        .toString()
        .padStart(3, "0")}`
      const documentType = documentTypes[index % documentTypes.length]
      const primaryValue =
        8_000 + Math.round(random() * 280_000) + ordinal * 137
      const secondaryValue = Math.round(primaryValue * (0.08 + random() * 0.4))

      return {
        id: documentId,
        taxReturnId: config.taxReturnId,
        filename: `Northstar-${documentType}-${ordinal
          .toString()
          .padStart(3, "0")}.pdf`,
        documentType,
        uploadedAt: generatedTimestamp(index),
        uploadedByUserId:
          index % 7 === 0 ? "user-alice-chen" : "user-nina-patel",
        processingStatus:
          index % 37 === 0
            ? "needs-review"
            : index % 53 === 0
              ? "processing"
              : "ready",
        taxYear: 2025,
        tags: [
          "generated",
          "northstar",
          `batch-${Math.floor(index / 25) + 1}`,
          sections[index % sections.length].toLowerCase().replaceAll(" ", "-"),
        ],
        pages: [
          {
            pageNumber: 1,
            width: 816,
            height: 1056,
            blocks: [
              {
                id: `${documentId}-heading`,
                kind: "heading",
                text: `Northstar supporting schedule ${ordinal}`,
                bounds: { x: 72, y: 72, width: 672, height: 60 },
              },
              {
                id: `${documentId}-block-primary`,
                kind: "label-value",
                text: `Reported amount: ${formatCurrency(primaryValue)}`,
                label: "Reported amount",
                value: formatCurrency(primaryValue),
                bounds: { x: 90, y: 220, width: 636, height: 44 },
              },
              {
                id: `${documentId}-block-secondary`,
                kind: "label-value",
                text: `Supporting amount: ${formatCurrency(secondaryValue)}`,
                label: "Supporting amount",
                value: formatCurrency(secondaryValue),
                bounds: { x: 90, y: 286, width: 636, height: 44 },
              },
            ],
          },
          {
            pageNumber: 2,
            width: 816,
            height: 1056,
            blocks: [
              {
                id: `${documentId}-block-notes`,
                kind: "paragraph",
                text: `Generated supporting detail for search, filtering, and document-scale interaction testing. Batch ${Math.floor(index / 25) + 1}.`,
                bounds: { x: 72, y: 96, width: 672, height: 140 },
              },
            ],
          },
        ],
      }
    },
  )

  const transformations: Transformation[] = []
  const aiOutputs: AIOutput[] = []

  const returnFields = Array.from(
    { length: config.fieldCount },
    (_, index): ReturnField => {
      const ordinal = index + 1
      const documentIndex = index % config.documentCount
      const document = sourceDocuments[documentIndex]
      const useSecondaryBlock = index >= config.documentCount
      const sourceBlock = document.pages[0].blocks.find((block) =>
        useSecondaryBlock
          ? block.id.endsWith("block-secondary")
          : block.id.endsWith("block-primary"),
      )

      if (!sourceBlock?.value) {
        throw new Error(`Generated document ${document.id} has no source value`)
      }

      const sourceValue = Number(sourceBlock.value.replace(/[$,]/g, ""))
      const calculated = index % 10 === 9
      const value = calculated ? sourceValue - 1000 : sourceValue
      const confidence =
        index % 29 === 0
          ? 54
          : index % 17 === 0
            ? 68
            : 76 + Math.floor(random() * 23)
      const fieldId = `field-northstar-generated-${ordinal
        .toString()
        .padStart(3, "0")}`
      const transformationId = calculated
        ? `transform-northstar-generated-${ordinal
            .toString()
            .padStart(3, "0")}`
        : undefined
      const aiOutputId = `ai-northstar-generated-${ordinal
        .toString()
        .padStart(3, "0")}`
      const pointer = {
        documentId: document.id,
        pageNumber: 1,
        blockId: sourceBlock.id,
        sectionLabel: sourceBlock.label ?? "Reported amount",
        bounds: sourceBlock.bounds,
      }

      if (transformationId) {
        transformations.push({
          id: transformationId,
          taxReturnId: config.taxReturnId,
          returnFieldId: fieldId,
          explanation:
            "Reported amount less a fixed $1,000 book-to-tax adjustment.",
          formula: "reported amount - book-to-tax adjustment",
          inputs: [
            {
              label: "Reported amount",
              value: sourceValue,
              displayValue: formatCurrency(sourceValue),
              sourcePointer: pointer,
            },
            {
              label: "Book-to-tax adjustment",
              value: 1000,
              displayValue: "$1,000",
            },
          ],
          steps: [
            {
              order: 1,
              expression: `${formatCurrency(sourceValue)} - $1,000`,
              result: formatCurrency(value),
            },
          ],
        })
      }

      aiOutputs.push(createFakeAIOutput({
        id: aiOutputId,
        kind: calculated ? "recommendation" : "extraction",
        taxReturnId: config.taxReturnId,
        target: { kind: "field", id: fieldId },
        recommendation: {
          label: calculated
            ? "Apply standard book-to-tax adjustment"
            : "Use extracted supporting amount",
          proposedValue: value,
        },
        confidence,
        summary:
          confidence >= 90
            ? `This looks right. ${confidence}% confidence from one supporting document.`
            : confidence >= 70
              ? `Likely ${formatCurrency(value)}, with ${confidence}% confidence.`
              : `I found ${formatCurrency(value)}, but this needs a human check.`,
        why:
          confidence >= 70
            ? "The label and amount are legible and match the expected schedule pattern."
            : "The source layout is inconsistent with adjacent schedules, so the extraction is uncertain.",
        evidence: [
          {
            kind: "document",
            documentId: document.id,
            pageNumber: 1,
            blockId: sourceBlock.id,
            label: `${document.filename}, ${sourceBlock.label}`,
          },
        ],
        reviewStatus: index % 8 === 0 ? "accepted" : "pending-review",
        generatedAt: generatedTimestamp(config.documentCount + index),
        correctionHistory: [],
      }))

      return {
        id: fieldId,
        taxReturnId: config.taxReturnId,
        section: sections[index % sections.length],
        form: "Form 1120-S",
        locator: `Workpaper ${Math.floor(index / 20) + 1}, row ${(index % 20) + 1}`,
        label: `${sections[index % sections.length]} item ${ordinal}`,
        value,
        displayValue: formatCurrency(value),
        unit: "currency",
        origin: calculated ? "calculated" : "ai-extracted",
        state:
          confidence < 70
            ? "needs-approval"
            : index % 8 === 0
              ? "verified"
              : "ai-unverified",
        confidence,
        sourcePointers: [pointer],
        transformationId,
        aiOutputId,
        updatedAt: generatedTimestamp(config.documentCount + index),
        updatedByUserId: "user-alice-chen",
      }
    },
  )

  return {
    sourceDocuments,
    returnFields,
    transformations,
    aiOutputs,
  }
}
