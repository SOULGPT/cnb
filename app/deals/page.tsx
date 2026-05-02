import { FloatingCartButton } from "@/components/floating-cart-button"
import { DealsContent } from "@/components/deals/deals-content"

export default function DealsPage() {
  return (
    <div className="bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Hot Deals</h1>
          <p className="text-lg text-muted-foreground">Save big on your favorite meals</p>
        </div>
        <DealsContent />
      </div>
      <FloatingCartButton />
    </div>
  )
}
