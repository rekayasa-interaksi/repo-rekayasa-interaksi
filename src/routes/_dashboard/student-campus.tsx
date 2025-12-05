import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { StudentCampusPage } from '@/features/student-campus/components/StudentCampusPage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <StudentCampusPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/student-campus')({
  component: ProtectedRouteComponent,
})
