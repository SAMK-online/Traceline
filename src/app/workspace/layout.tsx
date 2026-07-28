import { WorkspaceFrame } from "@/components/workspace/workspace-frame";
import { mockRepository } from "@/mock-data/repository";

export default async function WorkspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [users, taxReturns] = await Promise.all([
    mockRepository.listUsers(),
    mockRepository.listTaxReturns(),
  ]);
  const clientReturnMap = Object.fromEntries(
    taxReturns.map((taxReturn) => [taxReturn.clientId, taxReturn.id]),
  );

  return (
    <WorkspaceFrame users={users} clientReturnMap={clientReturnMap}>
      {children}
    </WorkspaceFrame>
  );
}
