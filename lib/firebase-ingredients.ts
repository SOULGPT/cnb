import { getFirebaseDbSync, isFirebaseConfigured, waitForFirebase } from "./firebase"
import type { Ingredient, IngredientCategory } from "@/types"
import { collection, onSnapshot } from "firebase/firestore"

// Listener sets for real-time updates
const ingredientListeners: Set<(ingredients: Ingredient[]) => void> = new Set()
let currentIngredients: Ingredient[] = []
let isInitialized = false

// Notify all listeners
function notifyIngredientListeners(ingredients: Ingredient[]) {
  currentIngredients = ingredients
  ingredientListeners.forEach((callback) => {
    try {
      callback(ingredients)
    } catch (error) {
      console.error("[firebase-ingredients] Listener error:", error)
    }
  })
}

// Fetch ingredients from API
async function fetchIngredientsFromAPI(): Promise<Ingredient[]> {
  try {
    const response = await fetch(`/api/ingredients?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
    if (response.ok) {
      const data = await response.json()
      if (data.ingredients && Array.isArray(data.ingredients)) {
        return data.ingredients
      }
    }
  } catch (error) {
    console.error("[firebase-ingredients] API fetch error:", error)
  }
  return []
}

// Setup real-time listener
function setupIngredientsFirebaseListener() {
  const db = getFirebaseDbSync()
  if (!db) {
    waitForFirebase().then(ready => {
        if (ready) {
            const asyncDb = getFirebaseDbSync()
            if (asyncDb) startListener(asyncDb)
        }
    })
    return
  }
  startListener(db)

  function startListener(dbInstance: any) {
    const ingredientsRef = collection(dbInstance, "ingredients")
    return onSnapshot(
      ingredientsRef,
      (snapshot) => {
        const ingredients = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Ingredient[]

        console.log(`[firebase-ingredients] Real-time update: ${ingredients.length} ingredients`)
        notifyIngredientListeners(ingredients)
      },
      (error) => {
        console.error("[firebase-ingredients] Listener error:", error)
      }
    )
  }
}

// Public: Subscribe to ingredients
export function subscribeToIngredients(callback: (ingredients: Ingredient[]) => void) {
  ingredientListeners.add(callback)

  if (currentIngredients.length > 0) {
    callback(currentIngredients)
  } else if (!isInitialized) {
      isInitialized = true
      fetchIngredientsFromAPI().then(ingredients => {
          if (ingredients.length > 0) notifyIngredientListeners(ingredients)
      })
  }

  setupIngredientsFirebaseListener()

  return () => {
    ingredientListeners.delete(callback)
  }
}

// Public: Get ingredients by category
export async function getIngredientsByCategory(category: IngredientCategory): Promise<Ingredient[]> {
  if (currentIngredients.length === 0) {
    const ingredients = await fetchIngredientsFromAPI()
    currentIngredients = ingredients
  }
  return currentIngredients.filter((i) => i.category === category && i.active)
}

// Public: Get ingredients by IDs
export async function getIngredientsByIds(ids: string[]): Promise<Ingredient[]> {
  if (ids.length === 0) return []
  if (currentIngredients.length === 0) {
    const ingredients = await fetchIngredientsFromAPI()
    currentIngredients = ingredients
  }
  return currentIngredients.filter((i) => ids.includes(i.id))
}

// Public: Add ingredient
export async function addIngredient(
  ingredient: Omit<Ingredient, "id" | "createdAt" | "updatedAt" | "restaurantId">
): Promise<{ id: string }> {
  const response = await fetch("/api/ingredients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredient),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to add ingredient")
  }

  const data = await response.json()
  return { id: data.id }
}

// Public: Update ingredient
export async function updateIngredient(id: string, updates: Partial<Ingredient>) {
  const response = await fetch(`/api/ingredients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update ingredient")
  }
}

// Public: Delete ingredient
export async function deleteIngredient(id: string) {
  const response = await fetch(`/api/ingredients/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete ingredient")
  }
}

// Public: Get ingredients for a menu item
export async function getIngredientsForItem(menuItemId: string): Promise<Ingredient[]> {
  if (currentIngredients.length === 0) {
    const ingredients = await fetchIngredientsFromAPI()
    currentIngredients = ingredients
  }
  return currentIngredients.filter((i) => i.active)
}

// Public: Assign ingredients to menu item
export async function assignIngredientsToMenuItem(menuItemId: string, ingredientIds: string[]) {
  const response = await fetch(`/api/menu/items/${menuItemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ingredients: ingredientIds,
      customizable: ingredientIds.length > 0,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to assign ingredients")
  }
}
