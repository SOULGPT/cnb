"use client"

import { useEffect, useState } from "react"
import type { Order } from "@/types"

interface OrderMapProps {
  order: Order
}

export function OrderMap({ order }: OrderMapProps) {
  const [courierLocation, setCourierLocation] = useState(order.courierLocation || { lat: 41.9028, lng: 12.4964 })

  // Simulate courier movement (in real app, this would come from Firebase real-time updates)
  useEffect(() => {
    const interval = setInterval(() => {
      setCourierLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-96 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'radial-gradient(#E78A00 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      {/* Simulated Route Line */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path
          d="M 50,50 L 150,120 L 250,80 L 350,300"
          stroke="#E78A00"
          strokeWidth="3"
          fill="none"
          strokeDasharray="10,5"
          className="animate-pulse opacity-30"
        />
      </svg>

      {/* Map Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 max-w-[280px]">
          <div className="relative w-20 h-20 mx-auto mb-4">
            {/* Pulsing circles */}
            <div className="absolute inset-0 bg-[#E78A00]/20 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-[#E78A00]/40 rounded-full animate-pulse" />
            
            {/* Courier Icon */}
            <div className="absolute inset-4 bg-[#E78A00] rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-500"
                 style={{ transform: `translate(${(courierLocation.lng % 0.01) * 1000}px, ${(courierLocation.lat % 0.01) * 1000}px)` }}>
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h3 className="font-bold text-gray-900">Tracking Courier</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Real-time GPS: {courierLocation.lat.toFixed(4)}, {courierLocation.lng.toFixed(4)}
          </p>
          
          <div className="flex items-center justify-between gap-4 text-left border-t pt-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Estimated Arrival</p>
              <p className="text-sm font-bold text-[#E78A00]">15-20 min</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Distance</p>
              <p className="text-sm font-bold text-gray-700">2.4 km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Decoration Elements */}
      <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1.5 rounded-full shadow-sm border text-[10px] font-bold text-gray-500 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        LIVE TRAFFIC DATA ENABLED
      </div>
    </div>
  )
}
