import { ShowForRole } from '@/features/authentication/components/ShowForRole';
import { AdminDashboard, SuperAdminDashboard } from '@/features/dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container py-6">
      <ShowForRole roles={['admin']}>
        <AdminDashboard />
      </ShowForRole>
      <ShowForRole roles={['superadmin']}>
        {/* <SuperAdminDashboard /> */}
        <AdminDashboard />
      </ShowForRole>
    </div>
  );
}
