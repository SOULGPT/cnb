import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export const dynamic = "force-dynamic"

// POST - Migrate all items to add isActive field based on published field
export async function POST() {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const results = {
      menuItems: { updated: 0, total: 0 },
      categories: { updated: 0, total: 0 },
    }

    // Migrate menu_items
    const itemsSnapshot = await adminDb.collection("menu_items").get()
    results.menuItems.total = itemsSnapshot.size

    for (const doc of itemsSnapshot.docs) {
      const data = doc.data()
      const isPublished = data.published !== false
      
      // Only update if isActive doesn't match published
      if (data.isActive !== isPublished) {
        await doc.ref.update({ isActive: isPublished })
        results.menuItems.updated++
      }
    }

    // Migrate menu_categories
    const categoriesSnapshot = await adminDb.collection("menu_categories").get()
    results.categories.total = categoriesSnapshot.size

    for (const doc of categoriesSnapshot.docs) {
      const data = doc.data()
      const isPublished = data.published !== false
      
      // Only update if isActive doesn't match published
      if (data.isActive !== isPublished) {
        await doc.ref.update({ isActive: isPublished })
        results.categories.updated++
      }
    }

    console.log("[API] Migration complete:", results)

    return NextResponse.json({
      success: true,
      message: "Migration complete",
      results,
    })
  } catch (error: any) {
    console.error("[API] Migration error:", error)
    return NextResponse.json({ error: error.message || "Migration failed" }, { status: 500 })
  }
}
