import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { ProgramAlumniPage } from '@/features/program-alumni/components/ProgramAlumniPage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <ProgramAlumniPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/program-alumnis')({
  component: ProtectedRouteComponent,
});