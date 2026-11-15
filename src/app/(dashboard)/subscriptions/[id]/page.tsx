import SubscriberDetail from "@/components/subscriptions/SubscriberDetail";

export const metadata = {
  title: "Subscriber Details · Pure Bullion",
};

export default async function SubscriberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubscriberDetail id={id} />;
}
