import EventDetailsView from '@/views/organizer/eventDetails';

export default function CreatePromotionPage({
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
