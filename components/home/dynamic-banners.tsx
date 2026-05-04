"use client"

import { useHomeBanners } from "@/hooks/use-home-banners"
import type { HomeBanner, BannerTemplateId } from "@/types"
import { useRouter } from "next/navigation"
import { ArrowRight, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { BannerBundleDialog } from "./banner-bundle-dialog"

export function DynamicBanners() {
  const { banners, loading } = useHomeBanners()
  const router = useRouter()
  const [selectedBundle, setSelectedBundle] = useState<HomeBanner | null>(null)

  if (loading) return (
    <div className="container px-4 py-8 mx-auto -mt-8 relative z-10 animate-pulse">
      <div className="space-y-4">
        {[1, 2].map(i => <div key={i} className="h-48 bg-gray-200 rounded-3xl" />)}
      </div>
    </div>
  )

  const handleAction = (banner: HomeBanner) => {
    // If it has bundle items, always open the bundle view first
    if (Array.isArray(banner.bundleItems) && banner.bundleItems.length > 0) {
      setSelectedBundle(banner)
      return
    }

    switch (banner.actionType) {
      case "link":
        router.push(banner.actionValue)
        break
      case "category":
        router.push(`/menu?category=${banner.actionValue}`)
        break
      case "item":
        router.push(`/menu/${banner.actionValue}`)
        break
      case "deal":
        router.push(`/menu/${banner.actionValue}?mode=deal`)
        break
    }
  }

  return (
    <section className="container px-4 py-8 mx-auto -mt-8 relative z-10 space-y-4">
      {banners.map((banner) => (
        <BannerRenderer key={banner.id} banner={banner} onClick={() => handleAction(banner)} />
      ))}

      <BannerBundleDialog 
        banner={selectedBundle}
        open={!!selectedBundle}
        onOpenChange={(open) => !open && setSelectedBundle(null)}
      />
    </section>
  )
}

function BannerRenderer({ banner, onClick }: { banner: HomeBanner, onClick: () => void }) {
  const { templateId } = banner

  const getBackgroundStyle = () => {
    if (banner.backgroundGradient) {
      return {
        background: `linear-gradient(${banner.backgroundGradient.direction}, ${banner.backgroundGradient.from}, ${banner.backgroundGradient.to})`
      }
    }
    return { backgroundColor: banner.backgroundColor || "#E78A00" }
  }

  switch (templateId) {
    case "orange-heat":
      return (
        <div 
          onClick={onClick}
          style={getBackgroundStyle()}
          className="relative h-48 rounded-[32px] overflow-hidden shadow-xl cursor-pointer group transition-transform active:scale-95"
        >
          <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
            <h2 className="text-white text-3xl font-black uppercase leading-none tracking-tighter drop-shadow-md">
              {banner.title.split(' ').map((word, i) => <div key={i}>{word}</div>)}
            </h2>
            {banner.price && (
              <span className="text-white text-3xl font-black drop-shadow-md">€{banner.price}</span>
            )}
          </div>
          <img 
            src={banner.imageUrl} 
            alt={banner.title}
            className="absolute right-0 top-0 h-full w-[60%] object-cover transition-transform group-hover:scale-110 drop-shadow-2xl"
          />
        </div>
      )

    case "summer-gradient":
      return (
        <div 
          onClick={onClick}
          style={getBackgroundStyle()}
          className="relative h-48 rounded-[32px] overflow-hidden shadow-xl cursor-pointer group transition-transform active:scale-95 flex items-center"
        >
          <div className="flex-1 p-8 z-10">
            <h2 className="text-white text-4xl font-black uppercase tracking-tighter mb-2 italic">
              {banner.title}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center">
                <ArrowRight className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="relative h-full aspect-square flex items-center justify-center p-4">
             <div className="absolute inset-4 bg-white/20 rounded-full blur-2xl" />
             <img 
                src={banner.imageUrl} 
                alt={banner.title}
                className="relative h-full w-full object-cover rounded-full drop-shadow-2xl z-10 group-hover:rotate-12 transition-transform"
              />
          </div>
        </div>
      )

    case "dark-emerald":
      return (
        <div 
          onClick={onClick}
          style={{ backgroundColor: banner.backgroundColor || "#064e3b" }}
          className="relative h-48 rounded-[32px] overflow-hidden shadow-xl cursor-pointer group transition-transform active:scale-95 flex"
        >
          <div className="relative w-1/2 h-full flex items-center justify-center">
             <div className="w-32 h-32 bg-[#E78A00] rounded-full absolute" />
             <img 
                src={banner.imageUrl} 
                alt={banner.title}
                className="relative h-32 w-32 rounded-full object-cover z-10 drop-shadow-lg group-hover:scale-110 transition-transform border-4 border-[#E78A00]"
              />
          </div>
          <div className="w-1/2 p-6 flex flex-col justify-center items-start text-white">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
              {banner.title}
            </h2>
            <ArrowRight className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      )

    case "split":
      return (
        <div 
          onClick={onClick}
          className="relative h-48 rounded-[32px] overflow-hidden shadow-xl cursor-pointer group transition-transform active:scale-95 flex bg-white"
        >
          <div className="w-2/5 h-full relative overflow-hidden">
             <img src={banner.imageUrl} className="w-full h-full object-cover" alt="" />
             <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white" />
          </div>
          <div className="w-3/5 p-6 flex flex-col justify-center gap-2" style={{ backgroundColor: banner.backgroundColor || "#fff" }}>
            <Badge className="w-fit bg-[#E78A00]">{banner.subtitle || "OFFER"}</Badge>
            <h2 className="text-2xl font-black text-gray-900 leading-tight uppercase">
              {banner.title}
            </h2>
            {banner.price && (
              <span className="text-2xl font-black text-[#7B1E2D]">€{banner.price}</span>
            )}
          </div>
        </div>
      )

    case "hero-card":
      return (
        <div 
          onClick={onClick}
          className="relative h-48 rounded-[32px] overflow-hidden shadow-xl cursor-pointer group transition-transform active:scale-95"
        >
          <img 
            src={banner.imageUrl} 
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
             <h2 className="text-white text-3xl font-black uppercase leading-tight">
               {banner.title}
             </h2>
             <p className="text-white/80 text-sm font-medium">{banner.subtitle}</p>
          </div>
          {banner.price && (
            <div className="absolute top-4 right-4 bg-[#E78A00] text-white p-3 rounded-2xl font-black shadow-lg">
              €{banner.price}
            </div>
          )}
        </div>
      )

    default:
      return null
  }
}
