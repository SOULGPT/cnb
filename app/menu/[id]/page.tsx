"use client"

import { FloatingCartButton } from "@/components/floating-cart-button"
import { ItemDetails } from "@/components/menu/item-details"
import { useMenuItems } from "@/hooks/use-menu-items"
import { Loader2, ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function MenuItemPage() {
  const params = useParams()
  const id = params.id as string
  const { getItemById, loading } = useMenuItems()
  const router = useRouter()
  const item = getItemById(id)

  if (loading) {
    return (
      <div className="bg-background">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#E78A00]" />
        </div>
        <FloatingCartButton />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
          <p className="text-muted-foreground mb-6">The menu item you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/menu")} className="bg-[#E78A00] hover:bg-[#C67500]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>
        <FloatingCartButton />
      </div>
    )
  }

  return (
    <div className="bg-background">
      <ItemDetails item={item} />
      <FloatingCartButton />
    </div>
  )
}
