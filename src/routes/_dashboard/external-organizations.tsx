import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { ExternalOrganizationsPage } from '@/features/external-organizations/components/ExternalOrganizationPage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <ExternalOrganizationsPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/external-organizations')({
  component: ProtectedRouteComponent,
});
