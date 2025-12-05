import { createFileRoute } from '@tanstack/react-router'
import { EventDataPage } from '@/features/events/components/EventDataPage';
import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';

function RouteComponent() {
  return <EventDataPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/event-data/$event_id')({
  component: ProtectedRouteComponent,
})