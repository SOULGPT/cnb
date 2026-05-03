"use client"

import { useState, useEffect } from "react"
import { subscribeToHomeBanners } from "@/lib/firebase-home"
import type { HomeBanner } from "@/types"

export function useHomeBanners() {
  const [banners, setBanners] = useState<HomeBanner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToHomeBanners((newBanners) => {
      // Filter for active banners
      const activeBanners = newBanners.filter(b => b.isActive)
      
      // Filter by time if needed
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`

      const timeFilteredBanners = activeBanners.filter(banner => {
        if (!banner.startTime || !banner.endTime) return true
        
        // Handle overnight ranges (e.g., 23:00 to 03:00)
        if (banner.startTime > banner.endTime) {
          return currentTimeStr >= banner.startTime || currentTimeStr <= banner.endTime
        }
        return currentTimeStr >= banner.startTime && currentTimeStr <= banner.endTime
      })

      setBanners(timeFilteredBanners)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { banners, loading }
}
