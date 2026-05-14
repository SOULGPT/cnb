"use client"

import { TopNav } from "./top-nav"

export function SafeHeader() {
  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
      style={{ 
        // Force a hardcoded 44px min-padding to protect the iPhone notch/status bar area
        // while also respecting env() if available.
        paddingTop: 'max(44px, env(safe-area-inset-top, 44px))' 
      }}
    >
      <TopNav />
    </div>
  )
}
