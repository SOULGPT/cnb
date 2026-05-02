import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export const dynamic = "force-dynamic"
export const revalidate = 0

// GET all categories
export async function GET() {
  try {
    if (!adminDb) {
      console.error("[API] Firebase Admin not configured")
      return NextResponse.json({ categories: [], source: "no-admin-db", error: "Database not configured" }, { status: 500 })
    }

    const snapshot = await adminDb.collection("menu_categories").orderBy("order", "asc").get()
    
    const categories = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((cat: any) => {
        // Must have a name
        if (!cat.name || String(cat.name).trim() === "") return false
        // Only show published categories (default true if not set)
        return cat.published !== false
      })

    console.log(`[API] GET /api/menu/categories - Found ${categories.length} published categories`)

    return NextResponse.json({
      categories,
      source: "firebase-admin",
      count: categories.length,
    })
  } catch (error: any) {
    console.error("[API] GET categories error:", error)
    return NextResponse.json({ categories: [], source: "error", error: error.message }, { status: 500 })
  }
}

// POST - Add new category
export async function POST(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()
    
    // Clean the data
    const cleanData: Record<string, any> = {
      name: body.name || "",
      description: body.description || "",
      order: body.order ?? 0,
      published: body.published ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const docRef = await adminDb.collection("menu_categories").add(cleanData)
    
    console.log(`[API] POST /api/menu/categories - Created category ${docRef.id}`)

    return NextResponse.json({ id: docRef.id, success: true })
  } catch (error: any) {
    console.error("[API] POST category error:", error)
    return NextResponse.json({ error: error.message || "Failed to add category" }, { status: 500 })
  }
}
