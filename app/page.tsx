"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { FloatingCartButton } from "@/components/floating-cart-button"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedItems } from "@/components/home/featured-items"
import { PromoBanner } from "@/components/home/promo-banner"

import { DynamicBanners } from "@/components/home/dynamic-banners"

export default function HomePage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const mode = searchParams.get("mode")
    const branchId = searchParams.get("branchId")
    const table = searchParams.get("table")

    if (mode === "dinein" && branchId && table) {
      localStorage.setItem(
        "dineInParams",
        JSON.stringify({
          mode,
          branchId,
          tableNumber: table,
        }),
      )
    }
  }, [searchParams])

  return (
    <div className="bg-background pb-20">
      <HeroSection />
      <DynamicBanners />
      <PromoBanner />
      <FeaturedItems />
      <FloatingCartButton />
    </div>
  )
}
