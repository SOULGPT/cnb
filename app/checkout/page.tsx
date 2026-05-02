import { BottomNav } from "@/components/bottom-nav"
import { CheckoutForm } from "@/components/checkout/checkout-form"

export default function CheckoutPage() {
  return (
    <div className="bg-background">
      <div className="container px-4 py-8 mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
        <CheckoutForm />
      </div>
    </div>
  )
}
