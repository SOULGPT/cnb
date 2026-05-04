
"use client"

import { useState, useEffect } from "react"
import { HomeBanner, MenuItem, CartItem } from "@/types"
import { useMenuItems } from "@/hooks/use-menu-items"
import { useCart } from "@/contexts/cart-context"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, Loader2, Sparkles } from "lucide-react"
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

    const cartItems: CartItem[] = bundleDetails.map(item => ({
      id: `${item.id}-${Date.now()}-${Math.random()}`,
      menuItem: item,
      quantity: 1,
      customizations: [],
      totalPrice: item.priceEur
    }))

    addItems(cartItems)
    toast({
      title: "Bundle Added!",
      description: `${banner?.title} has been added to your cart.`,
    })
    onOpenChange(false)
  }

  if (!banner) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-[32px] border-none">
        <div className="relative h-40">
          <img 
            src={banner.imageUrl} 
            alt={banner.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
            <Badge className="w-fit mb-2 bg-[#E78A00] text-white border-none">SPECIAL BUNDLE</Badge>
            <DialogTitle className="text-white text-2xl font-black uppercase tracking-tighter">
              {banner.title}
            </DialogTitle>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <DialogDescription className="text-base text-gray-600 font-medium">
            {banner.subtitle || "Enjoy this specially curated combo deal at a great price!"}
          </DialogDescription>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E78A00]" />
              What's Included:
            </h4>
            <ScrollArea className="h-48 pr-4">
              <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#E78A00]" />
                  </div>
                ) : (
                  bundleDetails.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white border">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-900 leading-none">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                      </div>
                      <Badge variant="outline" className="text-[#E78A00] border-[#E78A00]/20 bg-[#E78A00]/5">
                        Included
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button 
            onClick={handleAddBundle}
            className="w-full h-14 rounded-2xl bg-[#E78A00] hover:bg-[#E78A00]/90 text-white font-bold text-lg shadow-lg shadow-[#E78A00]/20"
            disabled={bundleDetails.length === 0}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Bundle to Cart
            {banner.price && <span className="ml-2 opacity-80">| €{banner.price}</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
