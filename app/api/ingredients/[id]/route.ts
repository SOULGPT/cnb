import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export const dynamic = "force-dynamic"

// PUT - Update ingredient
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const cleanData: Record<string, any> = { updatedAt: new Date() }
    
    if (body.name !== undefined) cleanData.name = body.name
    if (body.category !== undefined) cleanData.category = body.category
    if (body.priceAdjustment !== undefined) cleanData.priceAdjustment = body.priceAdjustment
    if (body.imageUrl !== undefined) cleanData.imageUrl = body.imageUrl
    if (body.default !== undefined) cleanData.default = body.default
    if (body.optional !== undefined) cleanData.optional = body.optional
    if (body.active !== undefined) cleanData.active = body.active

    const docRef = adminDb.collection("ingredients").doc(id)
    
    const doc = await docRef.get()
    if (!doc.exists) {
      return NextResponse.json({ error: "Ingredient not found" }, { status: 404 })
    }

    await docRef.update(cleanData)
    
    console.log(`[API] PUT /api/ingredients/${id} - Updated successfully`)

    return NextResponse.json({ success: true, id })
  } catch (error: any) {
    console.error("[API] PUT ingredient error:", error)
    return NextResponse.json({ error: error.message || "Failed to update ingredient" }, { status: 500 })
  }
}

// DELETE - Remove ingredient
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const docRef = adminDb.collection("ingredients").doc(id)
    
    const doc = await docRef.get()
    if (!doc.exists) {
      return NextResponse.json({ error: "Ingredient not found" }, { status: 404 })
    }

    await docRef.delete()
    
    console.log(`[API] DELETE /api/ingredients/${id} - Deleted successfully`)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[API] DELETE ingredient error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete ingredient" }, { status: 500 })
  }
}
