import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { ProgramPage } from '@/features/program/components/ProgramPage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <ProgramPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/programs')({
  component: ProtectedRouteComponent,
});