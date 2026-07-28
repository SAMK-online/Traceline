import { notFound } from "next/navigation";

import { ReturnReview } from "@/components/workspace/return-review";
import { mockRepository } from "@/mock-data/repository";
import type { TaxReturnWorkspace } from "@/mock-data/repository";

export async function generateStaticParams() {
  const taxReturns = await mockRepository.listTaxReturns();
  return taxReturns.map((taxReturn) => ({ returnId: taxReturn.id }));
}

export default async function ReturnReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ returnId: string }>;
  searchParams: Promise<{ field?: string | string[] }>;
}) {
  const [{ returnId }, query] = await Promise.all([params, searchParams]);

  let workspace: TaxReturnWorkspace;
  try {
    workspace = await mockRepository.getTaxReturnWorkspace(returnId);
  } catch {
    notFound();
  }

  const fields = workspace.fields.slice(
    0,
    returnId === "return-northstar-2025" ? 40 : 24,
  );
  const fieldIds = new Set(fields.map((field) => field.id));
  const documentIds = new Set(
    fields.flatMap((field) =>
      field.sourcePointers.map((pointer) => pointer.documentId),
    ),
  );

  return (
    <ReturnReview
      taxReturn={workspace.taxReturn}
      client={workspace.client}
      preparer={workspace.preparer}
      reviewer={workspace.reviewer}
      fields={fields}
      documents={workspace.documents.filter((document) =>
        documentIds.has(document.id),
      )}
      transformations={workspace.transformations.filter((transformation) =>
        fieldIds.has(transformation.returnFieldId),
      )}
      aiOutputs={workspace.aiOutputs.filter(
        (output) =>
          output.target.kind !== "field" || fieldIds.has(output.target.id),
      )}
      openIssueCount={
        workspace.issues.filter((issue) => issue.status === "open").length
      }
      messageCount={workspace.messages.length}
      initialFieldId={Array.isArray(query.field) ? query.field[0] : query.field}
    />
  );
}
