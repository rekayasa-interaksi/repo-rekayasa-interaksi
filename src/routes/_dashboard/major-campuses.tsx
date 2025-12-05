import { createFileRoute } from '@tanstack/react-router'
import { MajorCampusPage } from '@/features/major-campus/components/MajorCampusPage'

export const Route = createFileRoute('/_dashboard/major-campuses')({
  component: MajorCampusPage,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/major-campuses"!</div>
}
