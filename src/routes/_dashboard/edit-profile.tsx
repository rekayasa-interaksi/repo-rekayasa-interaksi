import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/edit-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/edit-profile"!</div>
}
