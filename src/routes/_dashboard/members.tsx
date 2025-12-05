import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { MembersPage } from '@/features/member/components/MembersPage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <MembersPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/members')({
  component: ProtectedRouteComponent,
});