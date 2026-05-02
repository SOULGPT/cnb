"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useMemo } from "react"

interface MenuContextType {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: React.ReactNode }) {
  // Start with empty - will be auto-set to first category when categories load
  const [selectedCategory, setSelectedCategoryState] = useState("")

  const setSelectedCategory = useCallback((category: string) => {
    setSelectedCategoryState(category)
  }, [])

  const value = useMemo(
    () => ({
      selectedCategory,
      setSelectedCategory,
    }),
    [selectedCategory, setSelectedCategory],
  )

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export function useMenuContext() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider")
  }
  return context
}
