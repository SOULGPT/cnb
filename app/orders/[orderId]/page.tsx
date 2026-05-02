import { OrderTracking } from "@/components/orders/order-tracking"

export default async function OrderTrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params

  return (
    <div className="bg-background">
      {/* No inner BottomNav — the global layout already renders it fixed at the bottom */}
      <OrderTracking orderId={orderId} />
    </div>
  )
}
