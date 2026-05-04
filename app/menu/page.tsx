import { FloatingCartButton } from "@/components/floating-cart-button"
import { MenuCategoryTabs } from "@/components/menu/menu-category-tabs"
import { MenuItemsGrid } from "@/components/menu/menu-items-grid"
import { MenuProvider } from "@/contexts/menu-context"
import { Capacitor } from "@capacitor/core"

export default function MenuPage() {
  return (
    <MenuProvider>
      {/* No min-h-screen — the global layout's <main> is already the scroll container */}
      <div className="bg-white">
        {/* Page header — scrolls away with content, reveals the sticky tabs below */}
        <header className="bg-[#E78A00] text-white py-4 md:py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-4xl font-bold">Our Menu</h1>
            <p className="text-sm md:text-base text-white/90 mt-1">Fresh ingredients, bold flavors</p>
          </div>
        </header>

        {/* 
          Category Tabs — STICKY POSITION (Restored)
          We use a solid background and shadow to prevent item bleed-through.
        */}
        <div 
          className="sticky z-40 bg-white shadow-md border-b border-gray-100"
          style={{ 
            top: Capacitor.getPlatform() === 'ios' ? '116px' : '64px' 
          }}
        >
          <div className="max-w-7xl mx-auto">
            <MenuCategoryTabs />
          </div>
        </div>

        {/* Menu items — with top margin to prevent initial overlap */}
        <div className="max-w-7xl mx-auto px-4 py-8 mt-4">
          <MenuItemsGrid />
        </div>

        <FloatingCartButton />
      </div>
    </MenuProvider>
  )
}
