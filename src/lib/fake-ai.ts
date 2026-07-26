import { AI_CONFIDENCE_THRESHOLDS } from "@/mock-data/constants"
import type {
  AICorrection,
  AIOutput,
  AIRecommendation,
  EvidencePointer,
  FieldValue,
  SourceDocument,
} from "@/mock-data/types"

export interface ConfidenceSignals {
  legibility: number
  layoutMatch: number
  crossDocumentMatches: number
  anomalyCount: number
}

export interface SimulatedAIResponse {
  recommendation: AIRecommendation
  confidence: number
  summary: string
  why: string
  evidence: EvidencePointer[]
  requiresHumanReview: boolean
}

export interface AnomalyInput {
  label: string
  expectedValue: number
  observedValue: number
  evidence: EvidencePointer[]
}

export interface SimulatedAnomaly extends SimulatedAIResponse {
  difference: number
  differencePercent: number
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function parseDocumentValue(document: SourceDocument, blockId: string) {
  const block = document.pages
    .flatMap((page) => page.blocks)
    .find((candidate) => candidate.id === blockId)

  if (!block?.value) {
    return null
  }

  const numericValue = Number(block.value.replace(/[$,%\s,]/g, ""))
  return Number.isNaN(numericValue) ? block.value : numericValue
}

function formatValue(value: FieldValue) {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value)
  }

  return String(value)
}

export function generateConfidenceScore(signals: ConfidenceSignals) {
  const base =
    signals.legibility * 0.45 +
    signals.layoutMatch * 0.35 +
    Math.min(signals.crossDocumentMatches, 3) * 6 -
    signals.anomalyCount * 12

  return clampScore(base)
}

export async function extractFieldFromDocument(input: {
  document: SourceDocument
  blockId: string
  fieldLabel: string
  confidenceSignals: ConfidenceSignals
  simulateDecimalShiftError?: boolean
}): Promise<SimulatedAIResponse> {
  const extractedValue = parseDocumentValue(input.document, input.blockId)
  const value =
    input.simulateDecimalShiftError && typeof extractedValue === "number"
      ? extractedValue * 10
      : extractedValue
  const confidence = generateConfidenceScore(input.confidenceSignals)
  const evidence: EvidencePointer[] = [
    {
      kind: "document",
      documentId: input.document.id,
      pageNumber: 1,
      blockId: input.blockId,
      label: `${input.document.filename}, ${input.fieldLabel}`,
    },
  ]

  return {
    recommendation: {
      label: `Use extracted ${input.fieldLabel}`,
      proposedValue: value,
    },
    confidence,
    summary:
      confidence >= AI_CONFIDENCE_THRESHOLDS.high
        ? `This looks right. ${confidence}% confidence from one document.`
        : confidence >= AI_CONFIDENCE_THRESHOLDS.review
          ? `Likely ${formatValue(value)}, with ${confidence}% confidence.`
          : `I found ${formatValue(value)}, but this needs a human check.`,
    why: input.simulateDecimalShiftError
      ? "The simulated first pass misread the document's decimal placement."
      : "The value was matched to a labeled source block in the document.",
    evidence,
    requiresHumanReview: confidence < AI_CONFIDENCE_THRESHOLDS.high,
  }
}

export async function flagAnomalies(
  inputs: AnomalyInput[],
): Promise<SimulatedAnomaly[]> {
  return inputs
    .map((input) => {
      const difference = input.observedValue - input.expectedValue
      const differencePercent =
        input.expectedValue === 0
          ? 100
          : Math.abs(difference / input.expectedValue) * 100
      const confidence = clampScore(55 + Math.min(differencePercent, 40))

      return {
        recommendation: {
          label: `Reconcile ${input.label}`,
          action: "Compare the supporting documents and confirm the variance",
        },
        confidence,
        summary: `${input.label} differs by ${formatValue(Math.abs(difference))}.`,
        why: `The observed amount is ${differencePercent.toFixed(1)}% away from the expected amount.`,
        evidence: input.evidence,
        requiresHumanReview: true,
        difference,
        differencePercent,
      }
    })
    .filter((anomaly) => anomaly.differencePercent >= 2)
}

export async function suggestCorrection(input: {
  previousRecommendation: AIRecommendation
  correctedValue: FieldValue
  reason: string
  evidence: EvidencePointer[]
}): Promise<SimulatedAIResponse> {
  return {
    recommendation: {
      label: `Use corrected ${input.previousRecommendation.label.toLowerCase()}`,
      proposedValue: input.correctedValue,
    },
    confidence: 100,
    summary: `Use ${formatValue(input.correctedValue)} instead of the prior suggestion.`,
    why: input.reason,
    evidence: input.evidence,
    requiresHumanReview: false,
  }
}

export function createCorrectionRecord(input: {
  id: string
  previousRecommendation: AIRecommendation
  correctedRecommendation: AIRecommendation
  reason: string
  correctedByUserId: string
  correctedAt: string
}): AICorrection {
  return { ...input }
}

export function createFakeAIOutput(output: AIOutput): AIOutput {
  return {
    ...output,
    confidence: clampScore(output.confidence),
    evidence: [...output.evidence],
    correctionHistory: [...output.correctionHistory],
  }
}
