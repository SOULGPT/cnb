"use client"

import { useMenuCategories } from "@/hooks/use-menu-categories"
import { useMenuContext } from "@/contexts/menu-context"
import { Loader2 } from "lucide-react"
import { useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export function MenuCategoryTabs() {
  const { selectedCategory, setSelectedCategory } = useMenuContext()
  const { categories, loading } = useMenuCategories()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  const validCategories = categories.filter((cat) => cat.name && cat.name.trim() !== "")

  // Handle initial category from URL and auto-select
  useEffect(() => {
    if (validCategories.length > 0) {
      // Priority 1: URL Parameter
      if (categoryParam) {
        const found = validCategories.find(cat => cat.id === categoryParam || cat.name.toLowerCase() === categoryParam.toLowerCase())
        if (found && found.id !== selectedCategory) {
          setSelectedCategory(found.id)
          return
        }
      }

      // Priority 2: Current selection validation
      const categoryExists = validCategories.some(cat => cat.id === selectedCategory)
      if (!categoryExists && !categoryParam) {
        setSelectedCategory(validCategories[0].id)
      }
    }
  }, [validCategories, categoryParam, setSelectedCategory, selectedCategory])

  // Auto-scroll to active category
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current
      const active = activeRef.current
      const containerWidth = container.offsetWidth
      const activeLeft = active.offsetLeft
      const activeWidth = active.offsetWidth
      
      container.scrollTo({
        left: activeLeft - containerWidth / 2 + activeWidth / 2,
        behavior: "smooth"
      })
    }
  }, [selectedCategory])

  if (loading) {
    return (
      <div className="h-14 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[#E78A00]" />
      </div>
    )
  }

  return (
    <div 
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto py-3 px-4 scrollbar-hide"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {validCategories.map((category) => {
        const isActive = selectedCategory === category.id
        return (
          <button
            key={category.id}
            ref={isActive ? activeRef : null}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
              transition-all duration-200 flex-shrink-0
              ${isActive 
                ? "bg-[#E78A00] text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {category.name}
          </button>
        )
      })}
    </div>
  )
}
