import CreatePromotionView from '@/views/organizer/createPromotion';

export default function CreatePromotionPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <>
      <CreatePromotionView eventId={params.slug} />
    </>
  );
}
