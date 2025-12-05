import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { OrganizationalStructurePage } from '@/features/organizational-structure/components/OrganizationalStructurePage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <OrganizationalStructurePage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/organizational-structure')({
  component: ProtectedRouteComponent,
});