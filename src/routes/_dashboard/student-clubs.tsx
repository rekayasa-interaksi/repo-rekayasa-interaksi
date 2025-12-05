import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { StudentClubsPage } from '@/features/student-clubs/components/StudentClubsPage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <StudentClubsPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/student-clubs')({
  component: ProtectedRouteComponent,
});
