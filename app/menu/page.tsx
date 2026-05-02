import { FloatingCartButton } from "@/components/floating-cart-button"
import { MenuCategoryTabs } from "@/components/menu/menu-category-tabs"
import { MenuItemsGrid } from "@/components/menu/menu-items-grid"
import { MenuProvider } from "@/contexts/menu-context"

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
          Category Tabs — sticky within the global window scroll.
          top must account for the fixed TopNav height to not hide behind it.
        */}
        <div 
          className="sticky z-30 bg-white border-b border-gray-100"
          style={{ top: '100px' }}
        >
          <div className="max-w-7xl mx-auto">
            <MenuCategoryTabs />
          </div>
        </div>

        {/* Menu items — no bottom padding here; global <main> handles safe-area clearance */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <MenuItemsGrid />
        </div>

        <FloatingCartButton />
      </div>
    </MenuProvider>
  )
}
