import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export const dynamic = "force-dynamic"

// GET single menu item
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const doc = await adminDb.collection("menu_items").doc(id).get()
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ id: doc.id, ...doc.data() })
  } catch (error: any) {
    console.error("[API] GET menu item error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update menu item
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Clean the data - remove undefined values
    const cleanData: Record<string, any> = {}
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        cleanData[key] = value
      }
    }
    
    // Add update timestamp and sync isActive with published
    cleanData.updatedAt = new Date().toISOString()
    if (cleanData.published !== undefined) {
      cleanData.isActive = cleanData.published
    }

    const docRef = adminDb.collection("menu_items").doc(id)
    
    // Check if document exists
    const doc = await docRef.get()
    if (!doc.exists) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    await docRef.update(cleanData)
    
    console.log(`[API] PUT /api/menu/items/${id} - Updated successfully`)

    return NextResponse.json({ success: true, id })
  } catch (error: any) {
    console.error("[API] PUT menu item error:", error)
    return NextResponse.json({ error: error.message || "Failed to update item" }, { status: 500 })
  }
}

// DELETE - Remove menu item
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const docRef = adminDb.collection("menu_items").doc(id)
    
    // Check if document exists
    const doc = await docRef.get()
    if (!doc.exists) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    await docRef.delete()
    
    console.log(`[API] DELETE /api/menu/items/${id} - Deleted successfully`)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[API] DELETE menu item error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete item" }, { status: 500 })
  }
}
