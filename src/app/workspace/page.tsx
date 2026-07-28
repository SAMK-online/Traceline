import { WorkspaceDashboard } from "@/components/workspace/workspace-dashboard";
import { getWorkspaceDashboardData } from "@/lib/workspace-data";
import { mockRepository } from "@/mock-data/repository";

export default async function WorkspacePage() {
  const [users, data] = await Promise.all([
    mockRepository.listUsers(),
    getWorkspaceDashboardData(),
  ]);

  return <WorkspaceDashboard users={users} data={data} />;
}
