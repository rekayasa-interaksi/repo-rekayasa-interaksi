import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { HelpCenterPage } from '@/features/help-center/components/HelpCenterPage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <HelpCenterPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/help-center')({
  component: ProtectedRouteComponent,
});