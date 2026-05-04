
"use client"

import { useState, useEffect, useMemo } from "react"
import { useCart } from "@/contexts/cart-context"
import { useMenuItems } from "@/hooks/use-menu-items"
import { CheckoutOffer, MenuItem } from "@/types"
import { subscribeToCheckoutOffers } from "@/lib/firebase-offers"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Sparkles, ChevronRight, ChevronLeft } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function SmartUpsell() {
  const { items: cartItems, addItem } = useCart()
  const { items: allMenuItems, loading: itemsLoading } = useMenuItems()
  const [offers, setOffers] = useState<CheckoutOffer[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToCheckoutOffers(setOffers)
    return () => unsubscribe()
  }, [])

  const recommendedItems = useMemo(() => {
    if (itemsLoading || !allMenuItems.length) return []

    // 1. Get IDs of items already in cart to avoid suggesting them
    const cartItemIds = cartItems.map(item => item.menuItem.id)
    const cartCategoryIds = Array.from(new Set(cartItems.map(item => item.menuItem.categoryId)))

    // 2. Find matching rules
    const activeOffers = offers.filter(o => o.isActive)
    
    let suggestedIds: string[] = []

    // Check category-specific rules
    activeOffers.forEach(offer => {
      if (offer.sourceCategoryId && cartCategoryIds.includes(offer.sourceCategoryId)) {
        suggestedIds = [...suggestedIds, ...offer.suggestedItemIds]
      }
    })

    // ALWAYS add global fallbacks to ensure the section isn't empty
    const fallbacks = activeOffers.filter(o => o.isGlobalFallback)
    fallbacks.forEach(offer => {
      suggestedIds = [...suggestedIds, ...offer.suggestedItemIds]
    })

    // 3. Remove duplicates and items already in cart
    const uniqueIds = Array.from(new Set(suggestedIds)).filter(id => !cartItemIds.includes(id))

    // 4. Map to actual menu items
    const finalItems = uniqueIds
      .map(id => allMenuItems.find(m => m.id === id))
      .filter((m): m is MenuItem => !!m && m.available)
      .slice(0, 10)

    console.log(`[SmartUpsell] Found ${finalItems.length} recommendations. Cart Categories:`, cartCategoryIds)
    return finalItems
  }, [cartItems, allMenuItems, offers, itemsLoading])

  if (recommendedItems.length === 0) return null

  return (
    <div className="mt-8 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#E78A00]/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#E78A00]" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
          Ottimo con il tuo ordine
        </h3>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-xl">
        <div className="flex w-max gap-4 p-1">
          {recommendedItems.map((item) => (
            <UpsellCard key={item.id} item={item} onAdd={() => addItem(item)} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  )
}

function UpsellCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = () => {
    setIsAdded(true)
    onAdd()
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Card className="w-48 overflow-hidden group border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        <img 
          src={item.imageUrl || "/placeholder.svg"} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-3">
        <h4 className="font-bold text-sm text-gray-900 truncate mb-1">{item.name}</h4>
        <div className="flex items-center justify-between">
          <span className="text-[#E78A00] font-bold text-sm">€{item.priceEur.toFixed(2)}</span>
          <Button 
            size="icon" 
            className={`w-8 h-8 rounded-full transition-all duration-300 ${
              isAdded ? "bg-[#00C897] scale-110" : "bg-[#E78A00] hover:bg-[#C67500]"
            }`}
            onClick={handleAdd}
            disabled={isAdded}
          >
            {isAdded ? (
                <Check className="w-4 h-4 text-white" />
            ) : (
                <Plus className="w-4 h-4 text-white" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

function Check({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    )
}
