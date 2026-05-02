import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

export const dynamic = "force-dynamic"

// PUT - Update coupon
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const cleanData: Record<string, any> = { updatedAt: new Date() }
    
    if (body.code !== undefined) cleanData.code = body.code.toUpperCase()
    if (body.discountType !== undefined) cleanData.discountType = body.discountType
    if (body.discountValue !== undefined) cleanData.discountValue = body.discountValue
    if (body.validFrom !== undefined) cleanData.validFrom = new Date(body.validFrom)
    if (body.validTo !== undefined) cleanData.validTo = new Date(body.validTo)
    if (body.active !== undefined) cleanData.active = body.active
    if (body.usagePerCustomer !== undefined) cleanData.usagePerCustomer = body.usagePerCustomer
    if (body.minOrderAmount !== undefined) cleanData.minOrderAmount = body.minOrderAmount
    if (body.maxDiscount !== undefined) cleanData.maxDiscount = body.maxDiscount

    const docRef = adminDb.collection("coupons").doc(id)
    
    const doc = await docRef.get()
    if (!doc.exists) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
    }

    await docRef.update(cleanData)
    
    console.log(`[API] PUT /api/coupons/${id} - Updated successfully`)

    return NextResponse.json({ success: true, id })
  } catch (error: any) {
    console.error("[API] PUT coupon error:", error)
    return NextResponse.json({ error: error.message || "Failed to update coupon" }, { status: 500 })
  }
}

// DELETE - Remove coupon
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const docRef = adminDb.collection("coupons").doc(id)
    
    const doc = await docRef.get()
    if (!doc.exists) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
    }

    await docRef.delete()
    
    console.log(`[API] DELETE /api/coupons/${id} - Deleted successfully`)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[API] DELETE coupon error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete coupon" }, { status: 500 })
  }
}

// PATCH - Increment usage
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId } = body

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const docRef = adminDb.collection("coupons").doc(id)
    
    const updates: Record<string, any> = {
      usageCount: FieldValue.increment(1),
      updatedAt: new Date(),
    }

    if (userId) {
      updates.usedBy = FieldValue.arrayUnion(userId)
    }

    await docRef.update(updates)
    
    console.log(`[API] PATCH /api/coupons/${id} - Incremented usage`)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[API] PATCH coupon error:", error)
    return NextResponse.json({ error: error.message || "Failed to update coupon usage" }, { status: 500 })
  }
}
