
"use client"

import { useState, useEffect, useMemo } from "react"
import { useCart } from "@/contexts/cart-context"
import { useMenuItems } from "@/hooks/use-menu-items"
import { useMenuCategories } from "@/hooks/use-menu-categories"
import { CheckoutOffer, MenuItem } from "@/types"
import { subscribeToCheckoutOffers } from "@/lib/firebase-offers"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Sparkles, ChevronRight, ChevronLeft } from "lucide-react"

export function SmartUpsell() {
  const { items: cartItems, addItem } = useCart()
  const { items: allMenuItems, loading: itemsLoading } = useMenuItems()
  const { categories: allCategories } = useMenuCategories()
  const [offers, setOffers] = useState<CheckoutOffer[]>([])

  useEffect(() => {
    let unsubscribe: (() => void) | null = null
    
    const setup = async () => {
      unsubscribe = await subscribeToCheckoutOffers(setOffers)
    }
    
    setup()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const recommendedItems = useMemo(() => {
    if (itemsLoading || !allMenuItems.length) return []

    // 1. Get IDs of items already in cart to avoid suggesting them
    const cartItemIds = cartItems.map(item => item.menuItem.id)
    const cartCategoryIds = Array.from(new Set(cartItems.map(item => item.menuItem.categoryId)))

    // 2. Find matching rules
    const activeOffers = offers.filter(o => o.isActive)
    const cartCategories = Array.from(new Set(cartItems.map(item => item.menuItem.categoryId)))
    const cartCategoryNames = Array.from(new Set(cartItems.map(item => {
      // Find category name in allCategories (we need to fetch categories too)
      return allCategories.find(c => c.id === item.menuItem.categoryId)?.name || ""
    })))
    
    let suggestedIds: string[] = []

    // Check category-specific rules (by ID or Title match)
    activeOffers.forEach(offer => {
      const isMatch = (offer.sourceCategoryId && cartCategories.includes(offer.sourceCategoryId)) ||
                     (offer.title && cartCategoryNames.some(name => offer.title?.toLowerCase().includes(name.toLowerCase())))
      
      if (isMatch) {
        suggestedIds = [...suggestedIds, ...offer.suggestedItemIds]
      }
    })

    // ALWAYS add global fallbacks as a safety net
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


    return finalItems
  }, [cartItems, allMenuItems, allCategories, offers, itemsLoading])

  if (recommendedItems.length === 0) return null

  return (
    <div className="mt-8 mb-4 w-full overflow-hidden">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="w-8 h-8 rounded-full bg-[#E78A00]/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#E78A00]" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-tight">
          Ottimo con il tuo ordine
        </h3>
      </div>

      <div className="relative group/scroll w-full overflow-hidden">
        {/* Universal webkit scrollbar hiding rule to support all iOS/Android Capacitor/browser webviews */}
        <style dangerouslySetInnerHTML={{ __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none !important;
          }
        `}} />
        <div 
          className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory flex flex-row flex-nowrap gap-3 pb-4 px-1 scroll-smooth"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {recommendedItems.map((item) => (
            <div key={item.id} className="snap-start shrink-0 flex-shrink-0">
              <UpsellCard item={item} onAdd={() => addItem(item)} />
            </div>
          ))}
          {/* Spacer for the end to ensure padding is respected */}
          <div className="shrink-0 flex-shrink-0 w-4" />
        </div>
        
        {/* Gradient edge indicators */}
        <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-white/80 to-transparent pointer-events-none opacity-0 group-hover/scroll:opacity-100 transition-opacity" />
        <div className="absolute top-0 left-0 bottom-4 w-12 bg-gradient-to-r from-white/80 to-transparent pointer-events-none opacity-0 group-hover/scroll:opacity-100 transition-opacity" />
      </div>
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
    <Card className="w-[140px] xs:w-[160px] md:w-[180px] overflow-hidden group border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white flex-shrink-0 flex flex-col h-full">
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 flex-shrink-0">
        <img 
          src={item.imageUrl || "/placeholder.svg"} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-2.5 flex flex-col justify-between flex-1">
        <h4 
          className="font-bold text-xs sm:text-sm text-gray-900 mb-1 min-h-[2rem] sm:min-h-[2.5rem] leading-tight text-ellipsis"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.name}
        </h4>
        <div className="flex items-center justify-between mt-1 pt-1">
          <span className="text-[#E78A00] font-bold text-xs sm:text-sm">€{item.priceEur.toFixed(2)}</span>
          <Button 
            size="icon" 
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-300 ${
              isAdded ? "bg-[#00C897] scale-110" : "bg-[#E78A00] hover:bg-[#C67500]"
            }`}
            onClick={handleAdd}
            disabled={isAdded}
          >
            {isAdded ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            ) : (
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
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
