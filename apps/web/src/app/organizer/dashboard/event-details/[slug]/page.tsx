import EventDetailsView from '@/views/organizer/eventDetails';

export default function EventDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <>
      <EventDetailsView eventId={params.slug} />
    </>
  );
}
