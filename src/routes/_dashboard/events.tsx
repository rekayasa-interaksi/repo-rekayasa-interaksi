import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { EventsPage } from '@/features/events/components/EventPage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <EventsPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/events')({
  component: ProtectedRouteComponent,
});