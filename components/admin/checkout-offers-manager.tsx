
"use client"

import { useState, useEffect } from "react"
import { CheckoutOffer, MenuItem, MenuCategory } from "@/types"
import { subscribeToCheckoutOffers, addCheckoutOffer, updateCheckoutOffer, deleteCheckoutOffer } from "@/lib/firebase-offers"
import { useMenuItems } from "@/hooks/use-menu-items"
import { useMenuCategories } from "@/hooks/use-menu-categories"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit2, Save, X, Search, Check, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function CheckoutOffersManager() {
  const [offers, setOffers] = useState<CheckoutOffer[]>([])
  const [editingOffer, setEditingOffer] = useState<Partial<CheckoutOffer> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { items: allItems } = useMenuItems()
  const { categories } = useMenuCategories()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = subscribeToCheckoutOffers(setOffers)
    return () => unsubscribe()
  }, [])

  const handleSave = async () => {
    if (!editingOffer?.title) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" })
      return
    }

    try {
      if (editingOffer.id) {
        await updateCheckoutOffer(editingOffer.id, editingOffer)
        toast({ title: "Updated", description: "Offer updated successfully" })
      } else {
        await addCheckoutOffer({
          ...editingOffer as CheckoutOffer,
          suggestedItemIds: editingOffer.suggestedItemIds || [],
          isGlobalFallback: editingOffer.isGlobalFallback || false,
          isActive: true
        })
        toast({ title: "Created", description: "Offer created successfully" })
      }
      setEditingOffer(null)
    } catch (error) {
      toast({ title: "Error", description: "Failed to save offer", variant: "destructive" })
    }
  }

  const toggleSuggestedItem = (itemId: string) => {
    const currentItems = editingOffer?.suggestedItemIds || []
    const isAlreadyIn = currentItems.includes(itemId)
    
    setEditingOffer(prev => ({
      ...prev,
      suggestedItemIds: isAlreadyIn 
        ? currentItems.filter(id => id !== itemId)
        : [...currentItems, itemId]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Checkout Offers</h2>
          <p className="text-muted-foreground">Boost your AOV with smart cart recommendations.</p>
        </div>
        <Button onClick={() => setEditingOffer({ title: "New Offer", suggestedItemIds: [] })}>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {editingOffer && (
        <Card className="p-6 border-2 border-[#E78A00]/20 bg-[#E78A00]/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E78A00]" />
              {editingOffer.id ? "Edit Rule" : "New Smart Rule"}
            </h3>
            <Button variant="ghost" size="icon" onClick={() => setEditingOffer(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rule Title (Internal)</Label>
                <Input 
                  value={editingOffer.title || ""} 
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  placeholder="e.g. Burger Lovers Special"
                />
              </div>

              <div className="space-y-2">
                <Label>Trigger Category (If cart contains...)</Label>
                <Select 
                  value={editingOffer.sourceCategoryId || "fallback"} 
                  onValueChange={(v) => setEditingOffer({ 
                    ...editingOffer, 
                    sourceCategoryId: v === "fallback" ? undefined : v,
                    isGlobalFallback: v === "fallback"
                  })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fallback">Global Fallback (Always show)</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Switch 
                  id="offer-active" 
                  checked={editingOffer.isActive !== false} 
                  onCheckedChange={(v) => setEditingOffer({ ...editingOffer, isActive: v })}
                />
                <Label htmlFor="offer-active">Active Rule</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Suggested Items ({editingOffer.suggestedItemIds?.length || 0})</Label>
                <div className="relative w-48">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>
              </div>
              
              <ScrollArea className="h-64 rounded-md border bg-white p-2">
                <div className="space-y-1">
                  {allItems
                    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(item => {
                      const isSelected = editingOffer.suggestedItemIds?.includes(item.id)
                      return (
                        <div 
                          key={item.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-colors ${
                            isSelected ? "bg-[#E78A00]/10 border-[#E78A00]" : "hover:bg-muted"
                          }`}
                          onClick={() => toggleSuggestedItem(item.id)}
                        >
                          <div className="flex items-center gap-2">
                            {item.imageUrl && <img src={item.imageUrl} className="w-8 h-8 rounded-sm object-cover" alt="" />}
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-[10px] text-muted-foreground">€{item.priceEur}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#E78A00]" />}
                        </div>
                      )
                    })}
                </div>
              </ScrollArea>
              
              <Button className="w-full bg-[#E78A00] hover:bg-[#C67500]" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Recommendation Rule
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="p-4 relative hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold">{offer.title}</h4>
                <Badge variant={offer.isGlobalFallback ? "secondary" : "outline"} className="text-[10px] mt-1">
                  {offer.isGlobalFallback ? "Global" : "Category Specific"}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditingOffer(offer)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteCheckoutOffer(offer.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-4 flex -space-x-2 overflow-hidden">
                {offer.suggestedItemIds.slice(0, 5).map(id => {
                    const item = allItems.find(i => i.id === id)
                    return item?.imageUrl ? (
                        <img key={id} src={item.imageUrl} className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" alt="" />
                    ) : null
                })}
                {offer.suggestedItemIds.length > 5 && (
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white text-[10px] font-bold">
                        +{offer.suggestedItemIds.length - 5}
                    </div>
                )}
            </div>

            {!offer.isActive && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive">Disabled</Badge>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
