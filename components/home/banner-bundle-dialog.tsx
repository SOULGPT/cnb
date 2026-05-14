
"use client"

import { useState, useEffect } from "react"
import { HomeBanner, MenuItem, CartItem } from "@/types"
import { useMenuItems } from "@/hooks/use-menu-items"
import { useCart } from "@/contexts/cart-context"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, Loader2, Sparkles, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BannerBundleDialogProps {
  banner: HomeBanner | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BannerBundleDialog({ banner, open, onOpenChange }: BannerBundleDialogProps) {
  const { items: allMenuItems, loading } = useMenuItems()
  const { addItems } = useCart()
  const { toast } = useToast()
  const [bundleDetails, setBundleDetails] = useState<MenuItem[]>([])

  useEffect(() => {
    if (open && banner?.bundleItems && allMenuItems.length > 0) {
      const items = banner.bundleItems
        .map(id => allMenuItems.find(m => m.id === id))
        .filter(Boolean) as MenuItem[]
      setBundleDetails(items)
    }
  }, [open, banner, allMenuItems])

  const handleAddBundle = () => {
    if (bundleDetails.length === 0) return

    const dealPrice = parseFloat(banner?.price || "0")
    
    // Create a single Bundle Item representing the whole deal
    const bundleItem: CartItem = {
      id: `bundle-${banner?.id}-${Date.now()}`,
      menuItem: {
        id: banner?.id || "bundle",
        categoryId: "deals",
        name: banner?.title || "Special Bundle",
        description: bundleDetails.map(i => i.name).join(" + "),
        priceEur: dealPrice,
        imageUrl: banner?.imageUrl || "",
        available: true,
      },
      quantity: 1,
      customizations: [],
      totalPrice: dealPrice,
      isDeal: true,
      dealId: banner?.id,
      dealTitle: banner?.title
    }

    addItems([bundleItem])
    toast({
      title: "Combo Added!",
      description: `${banner?.title} has been added to your cart for €${dealPrice.toFixed(2)}.`,
    })
    onOpenChange(false)
  }

  if (!banner) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="p-0 overflow-hidden rounded-t-[32px] border-none h-[85vh] sm:h-auto sm:max-w-md mx-auto">
        {/* Drag Handle for Native Feel */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 rounded-full z-20" />
        
        <div className="relative h-48 sm:h-56">
          <img 
            src={banner.imageUrl} 
            alt={banner.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
            <Badge className="w-fit mb-2 bg-[#E78A00] text-white border-none font-bold">SPECIAL BUNDLE</Badge>
            <SheetTitle className="text-white text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-tight">
              {banner.title}
            </SheetTitle>
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 active:scale-90 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1 overflow-y-auto pb-32">
          <SheetDescription className="text-base text-gray-600 font-medium leading-relaxed">
            {banner.subtitle || "Enjoy this specially curated combo deal at a great price!"}
          </SheetDescription>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E78A00]" />
              Items in this Deal
            </h4>
            
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#E78A00]" />
                </div>
              ) : (
                bundleDetails.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-gray-100 shadow-sm">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base text-gray-900 leading-none truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 pb-10">
          <Button 
            onClick={handleAddBundle}
            className="w-full h-14 rounded-2xl bg-[#E78A00] hover:bg-[#C67500] text-white font-bold text-lg shadow-xl shadow-[#E78A00]/30 active:scale-95 transition-all"
            disabled={bundleDetails.length === 0}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Bundle to Cart
            {banner.price && <span className="ml-2 font-black">| €{banner.price}</span>}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
