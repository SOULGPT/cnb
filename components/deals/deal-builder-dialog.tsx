"use client"

import { useState, useMemo, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Check, X, Minus, Plus, Utensils, MessageSquare, Tag, Flame } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import type { MenuItem } from "@/types"
import {
  FRIES_OPTIONS,
  DRINK_ITEMS,
  CUSTOMIZATION_OPTIONS,
  EXTRA_FRIES_PRICE,
  EXTRA_DRINKS_PRICE,
} from "@/lib/constants"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface DealBuilderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mainItem: MenuItem
  selectedExtras?: Record<string, number>
  removedItems?: string[]
}

const safePrice = (price: number | undefined | null) => (Number(price) || 0).toFixed(2)

export function DealBuilderDialog({
  open,
  onOpenChange,
  mainItem,
  selectedExtras = {},
  removedItems = [],
}: DealBuilderDialogProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  // Deal selections
  const [dealType, setDealType] = useState<"regular" | "medium" | "large">("medium")
  const [friesSize, setFriesSize] = useState<"small" | "medium" | "large">("medium")
  const [selectedDrinkId, setSelectedDrinkId] = useState(DRINK_ITEMS[0].id)
  const [removeFries, setRemoveFries] = useState(false)
  const [removeDrink, setRemoveDrink] = useState(false)
  const [extraFries, setExtraFries] = useState(0)
  const [extraDrinks, setExtraDrinks] = useState(0)
  const [note, setNote] = useState("")

  const selectedDrink = useMemo(() => DRINK_ITEMS.find((d: any) => d.id === selectedDrinkId), [selectedDrinkId])

  // Base deal price
  const baseDealPrice = useMemo(() => {
    let surcharge = 4.0
    if (dealType === "regular") surcharge = 3.0
    if (dealType === "large") surcharge = 6.0
    return (Number(mainItem.priceEur) || 0) + surcharge
  }, [mainItem.priceEur, dealType])

  // Calculate extras from main item customization
  const mainItemExtrasTotal = useMemo(() => {
    let total = 0
    Object.entries(selectedExtras).forEach(([id, qty]) => {
      const option = CUSTOMIZATION_OPTIONS.find((opt) => opt.id === id)
      if (option) {
        total += (Number(option.priceEur) || 0) * qty
      }
    })
    return total
  }, [selectedExtras])

  // Calculate removal discount
  const removalDiscount = useMemo(() => {
    let discountPerItem = 2.0
    if (dealType === "regular") discountPerItem = 1.5
    if (dealType === "large") discountPerItem = 3.0
    
    let discount = 0
    if (removeFries) discount += discountPerItem
    if (removeDrink) discount += discountPerItem
    return discount
  }, [removeFries, removeDrink, dealType])

  // Calculate fries upgrade cost
  const friesUpgrade = useMemo(() => {
    if (removeFries) return 0
    if (dealType === "large" && friesSize === "large") return 0
    if (dealType === "medium" && friesSize === "medium") return 0
    if (dealType === "regular" && friesSize === "small") return 0
    
    const option = FRIES_OPTIONS.find((f) => f.size === friesSize)
    return Number(option?.extraPrice) || 0
  }, [friesSize, removeFries, dealType])

  // Calculate extra items cost
  const extraItemsCost = useMemo(() => {
    return (extraFries * EXTRA_FRIES_PRICE) + (extraDrinks * EXTRA_DRINKS_PRICE)
  }, [extraFries, extraDrinks])

  // Total deal price
  const finalPrice = useMemo(() => {
    return baseDealPrice + mainItemExtrasTotal + friesUpgrade + extraItemsCost - removalDiscount
  }, [baseDealPrice, mainItemExtrasTotal, friesUpgrade, extraItemsCost, removalDiscount])

  // Savings
  const savedAmount = useMemo(() => {
    const separatePrice = (Number(mainItem.priceEur) || 0) + mainItemExtrasTotal + 3.0 + 2.5
    return Math.max(0, separatePrice - finalPrice)
  }, [mainItem.priceEur, mainItemExtrasTotal, finalPrice])

  const handleAddDeal = () => {
    const dealItem: any = {
      id: `deal-${mainItem.id}-${Date.now()}`,
      menuItem: mainItem,
      quantity: 1,
      customizations: [],
      note: note || undefined,
      isDeal: true,
      dealType: dealType,
      dealId: `deal-${mainItem.id}`,
      dealTitle: `${mainItem.name} ${dealType.charAt(0).toUpperCase() + dealType.slice(1)} Deal`,
      dealSelections: [
        !removeFries && {
          category: "Fries",
          itemName: friesSize.charAt(0).toUpperCase() + friesSize.slice(1),
          size: friesSize,
          extraPrice: friesUpgrade,
        },
        !removeDrink && {
          category: "Drink",
          itemName: selectedDrink?.name,
          extraPrice: 0,
        },
      ].filter(Boolean),
      removedItems: [removeFries && "Fries", removeDrink && "Drink"].filter(Boolean),
      totalPrice: finalPrice,
    }

    addItem(dealItem)
    onOpenChange(false)
    setNote("")

    toast({
      title: "Deal Added",
      description: `${mainItem.name} ${dealType} deal added to cart`,
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] max-h-[90vh] rounded-t-3xl flex flex-col p-0 gap-0 border-t-4 border-[#E78A00]">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-1" />

        <SheetHeader className="px-4 pb-3 pt-2 border-b flex-shrink-0 bg-white rounded-t-3xl text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E78A00]/10 flex items-center justify-center flex-shrink-0">
              <Tag className="w-5 h-5 text-[#E78A00]" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg font-bold">Make it a Deal</SheetTitle>
              <SheetDescription className="text-xs mt-0.5">
                Upgrade your {mainItem.name} to a full meal
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          {/* Step 0: Meal Size */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
              <Tag className="w-4 h-4" /> Select Meal Size
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setDealType("regular")
                  setFriesSize("small")
                }}
                className={`p-3 rounded-xl border-2 transition-all text-center flex flex-col gap-1 ${
                  dealType === "regular" 
                    ? "border-[#E78A00] bg-[#E78A00]/5 shadow-sm" 
                    : "border-gray-100"
                }`}
              >
                <span className="font-bold text-sm">Regular</span>
                <span className="text-[10px] text-muted-foreground">+€3.00</span>
              </button>
              <button
                onClick={() => {
                  setDealType("medium")
                  setFriesSize("medium")
                }}
                className={`p-3 rounded-xl border-2 transition-all text-center flex flex-col gap-1 ${
                  dealType === "medium" 
                    ? "border-[#E78A00] bg-[#E78A00]/5 shadow-sm" 
                    : "border-gray-100"
                }`}
              >
                <span className="font-bold text-sm">Medium</span>
                <span className="text-[10px] text-muted-foreground">+€4.00</span>
              </button>
              <button
                onClick={() => {
                  setDealType("large")
                  setFriesSize("large")
                }}
                className={`p-3 rounded-xl border-2 transition-all text-center flex flex-col gap-1 ${
                  dealType === "large" 
                    ? "border-[#7B1E2D] bg-[#7B1E2D]/5 shadow-sm" 
                    : "border-gray-100"
                }`}
              >
                <span className="font-bold text-sm">Large</span>
                <span className="text-[10px] text-muted-foreground">+€6.00</span>
              </button>
            </div>
          </div>

          {/* Step 1: Fries Selection */}
          <div className={`space-y-3 ${removeFries ? "opacity-40 grayscale pointer-events-none" : ""}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                <Utensils className="w-4 h-4" /> 1. Choose Your Fries
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => { e.stopPropagation(); setRemoveFries(!removeFries); }}
                className="h-8 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {removeFries ? "Add Back" : "No Patatine (-€2.00)"}
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FRIES_OPTIONS.map((option) => (
                <button
                  key={option.size}
                  onClick={() => setFriesSize(option.size as any)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                    friesSize === option.size 
                      ? "border-[#E78A00] bg-[#E78A00]/5" 
                      : "border-gray-100"
                  }`}
                >
                  <span className="text-2xl">🍟</span>
                  <span className="text-xs font-bold">{option.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Drink Selection */}
          <div className={`space-y-3 ${removeDrink ? "opacity-40 grayscale pointer-events-none" : ""}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                <Flame className="w-4 h-4" /> 2. Select Your Drink
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => { e.stopPropagation(); setRemoveDrink(!removeDrink); }}
                className="h-8 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {removeDrink ? "Add Back" : "No Drink (-€2.00)"}
              </Button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {DRINK_ITEMS.map((drink: any) => (
                <button
                  key={drink.id}
                  onClick={() => setSelectedDrinkId(drink.id)}
                  className={`group relative flex flex-col items-center gap-1 p-1 rounded-xl border-2 transition-all ${
                    selectedDrinkId === drink.id 
                      ? "border-[#E78A00] bg-[#E78A00]/5 scale-105" 
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-white mb-1 shadow-sm border border-gray-100">
                    <img src={drink.imageUrl} alt={drink.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight h-6 flex items-center px-1">
                    {drink.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Extras */}
          <div className="space-y-3">
             <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
               <Plus className="w-4 h-4" /> 3. Want Extra?
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 rounded-xl border-2 border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Extra Fries</span>
                    <span className="text-[10px] text-muted-foreground">+€2.50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setExtraFries(Math.max(0, extraFries - 1))} disabled={extraFries === 0}><Minus className="w-3 h-3" /></Button>
                    <span className="text-sm font-bold w-4 text-center">{extraFries}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setExtraFries(extraFries + 1)}><Plus className="w-3 h-3" /></Button>
                  </div>
                </div>
                <div className="p-3 rounded-xl border-2 border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Extra Drink</span>
                    <span className="text-[10px] text-muted-foreground">+€2.00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setExtraDrinks(Math.max(0, extraDrinks - 1))} disabled={extraDrinks === 0}><Minus className="w-3 h-3" /></Button>
                    <span className="text-sm font-bold w-4 text-center">{extraDrinks}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setExtraDrinks(extraDrinks + 1)}><Plus className="w-3 h-3" /></Button>
                  </div>
                </div>
             </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
             <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
               <MessageSquare className="w-4 h-4" /> Special Request
             </h3>
             <Textarea 
               placeholder="Anything else? (e.g., extra ice, no salt on fries)"
               value={note}
               onChange={(e) => setNote(e.target.value)}
               className="h-20 text-sm resize-none rounded-xl"
             />
          </div>
        </div>

        {/* Total & Action */}
        <div className="p-4 bg-gray-50 border-t flex flex-col gap-3 pb-8">
           <div className="flex items-center justify-between px-2">
              <div className="flex flex-col">
                 <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Total Price</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#E78A00]">€{safePrice(finalPrice)}</span>
                 </div>
              </div>
              <Button
                onClick={handleAddDeal}
                size="lg"
                className="bg-[#E78A00] hover:bg-[#C67500] text-white px-8 h-14 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 transition-all active:scale-95"
              >
                Add Deal
              </Button>
           </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
