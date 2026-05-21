import React from "react"
import { format } from "date-fns"
import type { Order } from "@/types"

interface ReceiptPrinterProps {
  order: Order
  type: "customer" | "kot"
}

export function ReceiptPrinter({ order, type }: ReceiptPrinterProps) {
  // Use existing total or calculate it
  const calculateSubtotal = () => {
    if (!Array.isArray(order.items)) return 0
    return order.items.reduce((sum, item) => sum + (Number(item?.totalPrice) || 0), 0)
  }

  const subtotal = calculateSubtotal()
  const deliveryFee = order.type === "delivery" ? order.deliveryFee || 2.5 : 0
  const discount = order.discount || 0
  const total = order.totalEur || subtotal + deliveryFee - discount
  // Tax calculation based on 10% IVA as specified in template
  const taxAmount = (total * 0.1).toFixed(2)

  const items = Array.isArray(order.items) ? order.items : []

  if (type === "customer") {
    return (
      <div className="print-only" style={{ display: 'none' }}>
        <div className="text-center mb-4">
          <img src="/logo.png" alt="Curry & Burger Logo" className="w-24 h-24 mx-auto object-contain grayscale" />
        </div>
        
        <div className="text-center font-bold mb-2">====================================</div>
        <div className="text-center font-bold text-lg mb-2">CURRY & BURGER</div>
        <div className="text-center font-bold mb-4">====================================</div>
        
        <div className="text-center mb-4">
          <p>Via XYZ, Porto Recanati (MC) - 62017</p>
          <p>Tel: +39 333 36386399</p>
          <p>P.IVA: 02167740436</p>
        </div>

        <div className="text-center mb-2">------------------------------------</div>
        <div className="text-center font-bold mb-2">DOCUMENTO COMMERCIALE</div>
        <div className="text-center mb-4">------------------------------------</div>

        <div className="flex justify-between mb-1">
          <span>Data: {order.createdAt ? format(new Date(order.createdAt), "dd/MM/yyyy") : ""}</span>
          <span>Hora: {order.createdAt ? format(new Date(order.createdAt), "HH:mm") : ""}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Ordine N: #{order.id.substring(0, 8).toUpperCase()}</span>
          <span>Tavolo: {order.tableNumber || (order.type === "pickup" ? "ASPORTO" : "DELIVERY")}</span>
        </div>

        <div className="text-center mb-2">------------------------------------</div>
        <div className="flex justify-between font-bold mb-2">
          <span>DESCRIZIONE</span>
          <span>PREZZO (€)</span>
        </div>
        <div className="text-center mb-4">------------------------------------</div>

        <div className="space-y-3 mb-4">
          {items.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between">
                <span className="flex-1 pr-2">{item.quantity}x {item.menuItem?.name || item.name}</span>
                <span>{(Number(item.totalPrice) || 0).toFixed(2)}</span>
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
          ))}
        </div>

        <div className="text-center mb-2">------------------------------------</div>
        <div className="flex justify-between font-bold text-lg mb-2">
          <span>TOTALE COMPLESSIVO</span>
          <span>{total.toFixed(2)} €</span>
        </div>
        <div className="text-center mb-4">------------------------------------</div>

        <div className="flex justify-between mb-4">
          <span>Di cui IVA (10%):</span>
          <span>{taxAmount} €</span>
        </div>

        <div className="font-bold mb-6">
          PAGAMENTO: {order.paymentMethod?.toUpperCase() || "CARTA"}
        </div>

        <div className="text-center font-bold mb-2">====================================</div>
        <div className="text-center mb-1">Grazie per la visita!</div>
        <div className="text-center mb-2">A presto / See you again!</div>
        <div className="text-center font-bold mb-8">====================================</div>
      </div>
    )
  }

  // KOT Template
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
