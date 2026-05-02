import { OrdersList } from "@/components/orders/orders-list"

export default function OrdersPage() {
  return (
    <div className="bg-background">
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>
        <OrdersList />
      </div>
    </div>
  )
}
