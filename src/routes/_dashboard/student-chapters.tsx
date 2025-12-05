import { createFileRoute } from '@tanstack/react-router';
import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { StudentChapterPage } from '@/features/student-chapter/components/StudentChapterPage';

function RouteComponent() {
  return <StudentChapterPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/student-chapters')({
  component: ProtectedRouteComponent,
});
