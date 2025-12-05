import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { TeamPage } from '@/features/team/components/TeamPage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <TeamPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/team')({
  component: ProtectedRouteComponent,
});