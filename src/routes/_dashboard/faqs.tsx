import { withRoleProtection } from '@/features/authentication/components/withRoleProtection';
import { FaqPage } from '@/features/faq/components/FaqPage';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <FaqPage />;
}

const ProtectedRouteComponent = withRoleProtection(['superadmin', 'admin'])(RouteComponent);

export const Route = createFileRoute('/_dashboard/faqs')({
  component: ProtectedRouteComponent,
});