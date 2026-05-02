"use client"

import { useEffect } from "react"
import { Capacitor } from "@capacitor/core"
import { StatusBar } from "@capacitor/status-bar"

export function NativeBridge() {
  useEffect(() => {
    async function initNative() {
      if (Capacitor.isNativePlatform()) {
        try {
          // Allow the WebView to span behind the Status Bar (notch)
          await StatusBar.setOverlaysWebView({ overlay: true })
        } catch (e) {
          console.warn("StatusBar plugin error:", e)
        }
      }
    }
    
    initNative()
  }, [])

  return null
}
