import { CartContent } from "@/components/cart/cart-content"

export default function CartPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-md lg:max-w-6xl mx-auto w-full px-4 md:px-6 py-6 md:py-8 overflow-hidden">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-6 md:mb-8 tracking-tight px-0.5">
          Your Cart
        </h1>
        <CartContent />
      </div>
    </div>
  )
}
