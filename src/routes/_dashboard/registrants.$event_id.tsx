import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import {EventRegistrantsPage} from '@/features/events/components/EventRegistrantsPage';
import { createFileRoute } from '@tanstack/react-router'

function RouteComponent() {
  return <EventRegistrantsPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/registrants/$event_id')({
  component: ProtectedRouteComponent,
})