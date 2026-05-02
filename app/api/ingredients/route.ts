import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export const dynamic = "force-dynamic"

// GET all ingredients
export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ ingredients: [], error: "Database not configured" }, { status: 500 })
    }

    const snapshot = await adminDb.collection("ingredients").get()
    
    const ingredients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log(`[API] GET /api/ingredients - Found ${ingredients.length} ingredients`)

    return NextResponse.json({ ingredients, success: true })
  } catch (error: any) {
    console.error("[API] GET ingredients error:", error)
    return NextResponse.json({ ingredients: [], error: error.message }, { status: 500 })
  }
}

// POST - Add new ingredient
export async function POST(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()
    
    const ingredientData = {
      name: body.name || "",
      category: body.category || "Other",
      priceAdjustment: body.priceAdjustment || 0,
      imageUrl: body.imageUrl || "",
      default: body.default ?? false,
      optional: body.optional ?? true,
      active: body.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await adminDb.collection("ingredients").add(ingredientData)
    
    console.log(`[API] POST /api/ingredients - Created ingredient ${docRef.id}`)

    return NextResponse.json({ id: docRef.id, success: true })
  } catch (error: any) {
    console.error("[API] POST ingredient error:", error)
    return NextResponse.json({ error: error.message || "Failed to add ingredient" }, { status: 500 })
  }
}
