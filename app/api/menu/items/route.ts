import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export const dynamic = "force-dynamic"
export const revalidate = 0

// GET all menu items
export async function GET() {
  try {
    if (!adminDb) {
      console.error("[API] Firebase Admin not configured")
      return NextResponse.json({ items: [], source: "no-admin-db", error: "Database not configured" }, { status: 500 })
    }

    const snapshot = await adminDb.collection("menu_items").get()
    
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log(`[API] GET /api/menu/items - Found ${items.length} items`)

    return NextResponse.json({
      items,
      source: "firebase-admin",
      count: items.length,
    })
  } catch (error: any) {
    console.error("[API] GET menu items error:", error)
    return NextResponse.json({ items: [], source: "error", error: error.message }, { status: 500 })
  }
}

// POST - Add new menu item
export async function POST(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()
    
    // Clean the data - remove undefined values
    const cleanData: Record<string, any> = {}
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        cleanData[key] = value
      }
    }
    
    // Add timestamps and sync isActive with published
    cleanData.createdAt = new Date().toISOString()
    cleanData.updatedAt = new Date().toISOString()
    cleanData.orderCount = 0
    cleanData.published = cleanData.published ?? true
    cleanData.isActive = cleanData.published // Sync with Firestore rules

    const docRef = await adminDb.collection("menu_items").add(cleanData)
    
    console.log(`[API] POST /api/menu/items - Created item ${docRef.id}`)

    return NextResponse.json({ id: docRef.id, success: true })
  } catch (error: any) {
    console.error("[API] POST menu item error:", error)
    return NextResponse.json({ error: error.message || "Failed to add item" }, { status: 500 })
  }
}
