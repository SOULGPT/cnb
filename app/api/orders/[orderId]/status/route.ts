import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

export const dynamic = "force-dynamic"

// PATCH - Update order status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params
    const body = await request.json()
    const { status, paymentStatus } = body

    if (!adminDb) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 })
    }

    if (!status && !paymentStatus) {
      return NextResponse.json({ success: false, error: "Status or paymentStatus is required" }, { status: 400 })
    }

    const orderRef = adminDb.collection("orders").doc(orderId)
    
    const doc = await orderRef.get()
    if (!doc.exists) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const updateData: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (status) {
      updateData.status = status
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus
    }

    await orderRef.update(updateData)

    console.log(`[API] PATCH /api/orders/${orderId}/status - Updated`)

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
    })
  } catch (error: any) {
    console.error("[API] PATCH order status error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order status" },
      { status: 500 }
    )
  }
}

// GET - Get single order
export async function GET(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params

    if (!adminDb) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 })
    }

    const doc = await adminDb.collection("orders").doc(orderId).get()
    
    if (!doc.exists) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const data = doc.data()
    const order = {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || null,
    }

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("[API] GET order error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch order" },
      { status: 500 }
    )
  }
}
