import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

export const dynamic = "force-dynamic"

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { userId, items, total, type, customerContact, deliveryAddress, metadata, note, tableNumber, paymentMethod } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Items are required" }, { status: 400 })
    }

    // Create order document
    const orderData: Record<string, any> = {
      userId: userId || "guest",
      items: items.map((item: any) => ({
        menuItemId: item.menuItemId || item.id,
        name: item.name || item.menuItem?.name || "Unknown",
        quantity: item.quantity || 1,
        priceEur: item.priceEur || item.menuItem?.priceEur || 0,
        totalPrice: item.totalPrice || (item.priceEur || 0) * (item.quantity || 1),
        spiceLevel: item.spiceLevel || null,
        customizations: item.customizations || [],
        note: item.note || null,
      })),
      totalEur: total || 0,
      status: "placed",
      paymentStatus: paymentMethod === "pay_online" ? "paid" : "pending",
      paymentMethod: paymentMethod || "cash_on_delivery",
      type: type || "delivery",
      customerContact: customerContact || {},
      deliveryAddress: type === "delivery" ? (deliveryAddress || null) : null,
      tableNumber: type === "dinein" ? (tableNumber || null) : null,
      note: note || null,
      metadata: metadata || {},
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }

    const orderRef = await adminDb.collection("orders").add(orderData)
    const orderId = orderRef.id

    console.log(`[API] POST /api/orders - Created order ${orderId}`)

    // Increment orderCount for each menu item
    const batch = adminDb.batch()
    for (const item of items) {
      const itemId = item.menuItemId || item.id
      if (itemId) {
        const itemRef = adminDb.collection("menu_items").doc(itemId)
        batch.update(itemRef, {
          orderCount: FieldValue.increment(item.quantity || 1),
        })
      }
    }

    try {
      await batch.commit()
    } catch (batchError) {
      // Non-critical - order is still created
      console.warn("[API] Failed to increment order counts:", batchError)
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order created successfully",
    })
  } catch (error: any) {
    console.error("[API] POST order error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    )
  }
}

// GET - Fetch orders
export async function GET(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, orders: [], error: "Database not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const limitCount = parseInt(searchParams.get("limit") || "50", 10)

    let query: FirebaseFirestore.Query = adminDb.collection("orders").orderBy("createdAt", "desc")

    if (userId) {
      query = query.where("userId", "==", userId)
    }

    if (status && status !== "all") {
      query = query.where("status", "==", status)
    }

    const snapshot = await query.limit(limitCount).get()

    const orders = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      }
    })

    console.log(`[API] GET /api/orders - Found ${orders.length} orders`)

    return NextResponse.json({ success: true, orders })
  } catch (error: any) {
    console.error("[API] GET orders error:", error)
    return NextResponse.json(
      { success: false, orders: [], error: error.message || "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
