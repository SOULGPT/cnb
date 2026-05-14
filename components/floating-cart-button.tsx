"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { memo } from "react"

export const FloatingCartButton = memo(function FloatingCartButton() {
  const { totalItems, totalPrice, isReady } = useCart()

  if (!isReady || totalItems === 0) return null

  return (
    <div
      className="fixed left-0 right-0 z-50 px-4 pointer-events-none
        /* Phone: sit above the BottomNav (h-14 = 56px + safe area) */
        bottom-[calc(56px+env(safe-area-inset-bottom,0px)+8px)]
        /* Tablet/Desktop: BottomNav is hidden, so sit at true bottom */
        md:bottom-0 md:py-4"
    >
      <Link href="/cart" className="pointer-events-auto block">
        <Button
          size="lg"
          className={cn(
            "w-full max-w-lg mx-auto h-14",
            "bg-[#E78A00]/90 hover:bg-[#C67500] text-white",
            "backdrop-blur-xl shadow-[0_8px_32px_rgba(231,138,0,0.3)] rounded-2xl px-6",
            "flex items-center justify-between",
            "animate-slide-up active:scale-[0.98] transition-all duration-200",
            "border border-white/20"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#7B1E2D] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            </div>
            <span className="text-base font-black uppercase tracking-tight">View Order</span>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
            <span className="text-base font-black">€{totalPrice.toFixed(2)}</span>
          </div>
        </Button>
      </Link>
    </div>
  )
})
