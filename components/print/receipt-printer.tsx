import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import type { Order } from "@/types"
import { StoreSettings, DEFAULT_STORE_SETTINGS } from "@/types/settings"
import { getStoreSettings } from "@/lib/settings-utils"

interface ReceiptPrinterProps {
  order: Order
  type: "customer" | "kot"
}

export function ReceiptPrinter({ order, type }: ReceiptPrinterProps) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS)

  useEffect(() => {
    async function loadSettings() {
      const config = await getStoreSettings()
      setSettings(config)
    }
    loadSettings()
  }, [])

  // Calculate IVA Breakdown
  const items = Array.isArray(order.items) ? order.items : []
  
  // Create a map to accumulate totals by IVA rate
  const ivaTotals = new Map<number, { net: number, tax: number, gross: number }>()

  // Process items
  items.forEach(item => {
    const category = item.ivaCategory || "food"
    const rate = category === "drinks" ? settings.ivaRates.drinks : settings.ivaRates.food
    
    // Total price of the item includes tax
    const gross = Number(item.totalPrice) || 0
    // Net amount = Gross / (1 + rate)
    const net = gross / (1 + rate)
    const tax = gross - net

    const existing = ivaTotals.get(rate) || { net: 0, tax: 0, gross: 0 }
    ivaTotals.set(rate, {
      net: existing.net + net,
      tax: existing.tax + tax,
      gross: existing.gross + gross
    })
  })

  // Process delivery fee
  const deliveryFee = order.type === "delivery" ? (order.deliveryFee ?? settings.fees.deliveryCharge) : 0
  if (deliveryFee > 0) {
    const rate = settings.ivaRates.delivery
    const gross = deliveryFee
    const net = gross / (1 + rate)
    const tax = gross - net

    const existing = ivaTotals.get(rate) || { net: 0, tax: 0, gross: 0 }
    ivaTotals.set(rate, {
      net: existing.net + net,
      tax: existing.tax + tax,
      gross: existing.gross + gross
    })
  }

  // Process coperto (Service Charge)
  const copertoFee = order.type === "dinein" ? (order.copertoFee ?? 0) : 0
  if (copertoFee > 0) {
    const rate = settings.ivaRates.food // Usually service follows food rate
    const gross = copertoFee
    const net = gross / (1 + rate)
    const tax = gross - net

    const existing = ivaTotals.get(rate) || { net: 0, tax: 0, gross: 0 }
    ivaTotals.set(rate, {
      net: existing.net + net,
      tax: existing.tax + tax,
      gross: existing.gross + gross
    })
  }

  const sortedIvaRates = Array.from(ivaTotals.entries()).sort((a, b) => a[0] - b[0])
  const totalEur = order.totalEur || Array.from(ivaTotals.values()).reduce((sum, val) => sum + val.gross, 0)

  if (type === "customer") {
    return (
      <div className="print-only" style={{ display: 'none' }}>
        <div className="text-center mb-4">
          <img 
            src={settings.logoUrl || "/logo.png"} 
            alt={`${settings.restaurantName} Logo`} 
            className="w-24 h-24 mx-auto object-contain grayscale" 
          />
        </div>
        
        <div className="text-center font-bold mb-2">====================================</div>
        <div className="text-center font-bold text-lg mb-2">{settings.restaurantName.toUpperCase()}</div>
        <div className="text-center font-bold mb-4">====================================</div>
        
        <div className="text-center mb-4">
          <p>{settings.address}</p>
          <p>Tel: {settings.phone}</p>
          <p>P.IVA: {settings.pIva}</p>
        </div>

        <div className="text-center mb-2">------------------------------------</div>
        <div className="text-center font-bold mb-2">DOCUMENTO COMMERCIALE</div>
        <div className="text-center mb-4">------------------------------------</div>

        <div className="flex justify-between mb-1">
          <span>Data: {order.createdAt ? format(new Date(order.createdAt), "dd/MM/yyyy") : ""}</span>
          <span>Ora: {order.createdAt ? format(new Date(order.createdAt), "HH:mm") : ""}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Ordine N: #{order.id.substring(0, 8).toUpperCase()}</span>
          <span>Tipo: {order.type === "pickup" ? "Asporto" : order.type === "delivery" ? "Delivery" : "Dine-in"}</span>
        </div>
        {order.type === "dinein" && order.tableNumber && (
          <div className="flex justify-between mb-4">
            <span>Tavolo: {order.tableNumber}</span>
          </div>
        )}

        <div className="text-center mb-2">------------------------------------</div>
        <div className="flex justify-between font-bold mb-2">
          <span>DESCRIZIONE</span>
          <span>PREZZO (€)</span>
        </div>
        <div className="text-center mb-4">------------------------------------</div>

        <div className="space-y-3 mb-4">
          {items.map((item, idx) => {
            const category = item.ivaCategory || "food"
            const rate = category === "drinks" ? settings.ivaRates.drinks : settings.ivaRates.food
            return (
              <div key={idx}>
                <div className="flex justify-between">
                  <span className="flex-1 pr-2">{item.quantity}x {item.menuItem?.name || item.name} ({category.charAt(0).toUpperCase() + category.slice(1)})</span>
                  <span>{(Number(item.totalPrice) || 0).toFixed(2)} ({(rate * 100).toFixed(0)}%)</span>
                </div>
                {item.note && (
                  <div className="text-sm pl-4 mt-1">* Note: {item.note}</div>
                )}
                {Array.isArray(item.customizations) && item.customizations.length > 0 && (
                  <div className="text-sm pl-4 mt-1">
                    * {item.customizations
                      .map((c: any) => c.options?.map((o: any) => o.name).join(", "))
                      .filter(Boolean)
                      .join(" | ")}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {deliveryFee > 0 && (
          <>
            <div className="text-center mb-2">------------------------------------</div>
            <div className="flex justify-between font-bold mb-2">
              <span>CONSEGNA / DELIVERY FEE</span>
              <span>{deliveryFee.toFixed(2)}</span>
            </div>
          </>
        )}

        {copertoFee > 0 && (
          <>
            <div className="text-center mb-2">------------------------------------</div>
            <div className="flex justify-between font-bold mb-2">
              <span>COPERTO / SERVICE FEE</span>
              <span>{copertoFee.toFixed(2)}</span>
            </div>
          </>
        )}

        <div className="text-center mb-2">------------------------------------</div>
        <div className="flex justify-between font-bold text-lg mb-2">
          <span>TOTALE COMPLESSIVO</span>
          <span>{totalEur.toFixed(2)} €</span>
        </div>
        <div className="text-center mb-4">------------------------------------</div>

        <div className="mb-4">
          <div className="font-bold mb-1">RIEPILOGO IVA:</div>
          <div className="flex justify-between text-xs font-bold mb-1 border-b pb-1">
            <span className="w-16">ALIQUOTA</span>
            <span className="w-16 text-right">NETTO</span>
            <span className="w-16 text-right">IMPOSTA</span>
            <span className="w-16 text-right">TOTALE</span>
          </div>
          {sortedIvaRates.map(([rate, vals]) => (
            <div key={rate} className="flex justify-between text-xs mb-1">
              <span className="w-16">IVA {(rate * 100).toFixed(0)}%</span>
              <span className="w-16 text-right">{vals.net.toFixed(2)} €</span>
              <span className="w-16 text-right">{vals.tax.toFixed(2)} €</span>
              <span className="w-16 text-right">{vals.gross.toFixed(2)} €</span>
            </div>
          ))}
        </div>

        <div className="font-bold mb-6">
          PAGAMENTO: {order.paymentMethod?.toUpperCase() || "CARTA"}
        </div>

        <div className="text-center mb-2">------------------------------------</div>
        
        {settings.specialAnnouncement && (
          <div className="text-center font-bold mb-4">{settings.specialAnnouncement}</div>
        )}

        <div className="text-center font-bold mb-2">====================================</div>
        <div className="text-center mb-2 whitespace-pre-wrap">{settings.footerMessage}</div>
        <div className="text-center font-bold mb-8">====================================</div>
      </div>
    )
  }

  // KOT Template (Kitchen Order Ticket)
  return (
    <div className="print-only" style={{ display: 'none' }}>
      <div className="text-center font-bold mb-2">====================================</div>
      <div className="text-center font-bold text-xl mb-2">*** CUCINA / KITCHEN ***</div>
      <div className="text-center font-bold mb-4">====================================</div>
      
      <div className="font-bold text-lg mb-1">ORDINE N: #{order.id.substring(0, 8).toUpperCase()}</div>
      <div className="font-bold text-lg mb-2">TAVOLO / ASPORTO: {order.tableNumber || (order.type === "pickup" ? "ASPORTO" : "DELIVERY")}</div>
      
      <div className="mb-4">
        Data: {order.createdAt ? format(new Date(order.createdAt), "dd/MM/yyyy") : ""} | Ora: {order.createdAt ? format(new Date(order.createdAt), "HH:mm") : ""}
      </div>
      
      <div className="text-center mb-6">------------------------------------</div>

      <div className="space-y-6 mb-6">
        {items.map((item, idx) => (
          <div key={idx} className="mb-4">
            <div className="font-bold text-xl mb-1">
              [GRANDE] {item.quantity}x {(item.menuItem?.name || item.name)?.toUpperCase()}
            </div>
            {item.note && (
              <div className="font-bold text-lg pl-4 mt-2">
                * NOTE: {item.note.toUpperCase()}
              </div>
            )}
            {Array.isArray(item.customizations) && item.customizations.length > 0 && (
              <div className="font-bold text-lg pl-4 mt-2">
                * MODS: {item.customizations
                  .map((c: any) => c.options?.map((o: any) => o.name).join(", "))
                  .filter(Boolean)
                  .join(" | ")
                  .toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mb-2">------------------------------------</div>
      <div className="text-center font-bold mb-8">====================================</div>
    </div>
  )
}
