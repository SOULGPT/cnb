import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export const dynamic = "force-dynamic"

// GET all coupons
export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ coupons: [], error: "Database not configured" }, { status: 500 })
    }

    const snapshot = await adminDb.collection("coupons").get()
    
    const coupons = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        validFrom: data.validFrom?.toDate?.()?.toISOString() || data.validFrom,
        validTo: data.validTo?.toDate?.()?.toISOString() || data.validTo,
      }
    })

    console.log(`[API] GET /api/coupons - Found ${coupons.length} coupons`)

    return NextResponse.json({ coupons, success: true })
  } catch (error: any) {
    console.error("[API] GET coupons error:", error)
    return NextResponse.json({ coupons: [], error: error.message }, { status: 500 })
  }
}

// POST - Add new coupon
export async function POST(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()
    
    const couponData = {
      code: (body.code || "").toUpperCase(),
      discountType: body.discountType || "percentage",
      discountValue: body.discountValue || 0,
      validFrom: body.validFrom ? new Date(body.validFrom) : new Date(),
      validTo: body.validTo ? new Date(body.validTo) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      active: body.active ?? true,
      usagePerCustomer: body.usagePerCustomer || "single",
      usedBy: body.usedBy || [],
      usageCount: 0,
      minOrderAmount: body.minOrderAmount || null,
      maxDiscount: body.maxDiscount || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await adminDb.collection("coupons").add(couponData)
    
    console.log(`[API] POST /api/coupons - Created coupon ${docRef.id}`)

    return NextResponse.json({ id: docRef.id, success: true })
  } catch (error: any) {
    console.error("[API] POST coupon error:", error)
    return NextResponse.json({ error: error.message || "Failed to add coupon" }, { status: 500 })
  }
}
