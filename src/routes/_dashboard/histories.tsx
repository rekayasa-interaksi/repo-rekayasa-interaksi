import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { HistoryPage } from '@/features/history/components/HistoryPage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <HistoryPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/histories')({
  component: ProtectedRouteComponent,
});