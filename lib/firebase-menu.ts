import { getFirebaseDb, waitForFirebase } from "./firebase"
import type { MenuItem, MenuCategory } from "@/types"

// Listener sets for real-time updates
const menuItemListeners: Set<(items: MenuItem[]) => void> = new Set()
const categoryListeners: Set<(categories: MenuCategory[]) => void> = new Set()

// Current data cache
let currentMenuItems: MenuItem[] = []
let currentCategories: MenuCategory[] = []

// Unsubscribe functions
let menuUnsubscribe: (() => void) | null = null
let categoryUnsubscribe: (() => void) | null = null

// Polling intervals for real-time fallback
let menuPollingInterval: ReturnType<typeof setInterval> | null = null
let categoryPollingInterval: ReturnType<typeof setInterval> | null = null

// Initialization flags
let isMenuInitialized = false
let isCategoryInitialized = false

// Polling interval (10 seconds for better real-time experience)
const POLLING_INTERVAL = 10000

// Notify all menu listeners
function notifyMenuListeners(items: MenuItem[]) {
  currentMenuItems = items
  menuItemListeners.forEach((callback) => {
    try {
      callback(items)
    } catch (error) {
      console.error("[firebase-menu] Menu listener error:", error)
    }
  })
}

// Notify all category listeners
function notifyCategoryListeners(categories: MenuCategory[]) {
  // Sort by order
  const sorted = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0))
  currentCategories = sorted
  categoryListeners.forEach((callback) => {
    try {
      callback(sorted)
    } catch (error) {
      console.error("[firebase-menu] Category listener error:", error)
    }
  })
}

// Fetch menu items from API (initial load)
async function fetchMenuItemsFromAPI(): Promise<MenuItem[]> {
  try {
    const response = await fetch(`/api/menu/items?t=${Date.now()}`, { 
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    })
    if (response.ok) {
      const data = await response.json()
      if (data.items && Array.isArray(data.items)) {
        console.log(`[firebase-menu] API returned ${data.items.length} items (source: ${data.source})`)
        return data.items
      }
    }
  } catch (error) {
    console.error("[firebase-menu] API fetch error:", error)
  }
  return []
}

// Fetch categories from API (initial load)
async function fetchCategoriesFromAPI(): Promise<MenuCategory[]> {
  try {
    const response = await fetch(`/api/menu/categories?t=${Date.now()}`, { 
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    })
    if (response.ok) {
      const data = await response.json()
      if (data.categories && Array.isArray(data.categories)) {
        console.log(`[firebase-menu] API returned ${data.categories.length} categories (source: ${data.source})`)
        return data.categories
      }
    }
  } catch (error) {
    console.error("[firebase-menu] API categories fetch error:", error)
  }
  return []
}

// Setup real-time Firebase listener for menu items
async function setupMenuFirebaseListener() {
  if (menuUnsubscribe) return // Already listening

  // Initial load from API
  if (!isMenuInitialized) {
    isMenuInitialized = true
    const items = await fetchMenuItemsFromAPI()
    if (items.length > 0) {
      notifyMenuListeners(items)
    }
  }

  // Setup real-time listener
  const ready = await waitForFirebase(3)
  if (!ready) {
    console.warn("[firebase-menu] Firebase not available for real-time menu updates")
    return
  }

  const db = await getFirebaseDb()
  if (!db) return

  try {
    const { collection, onSnapshot } = await import("firebase/firestore")
    const menuRef = collection(db, "menu_items")

    menuUnsubscribe = onSnapshot(
      menuRef,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MenuItem[]

        console.log(`[firebase-menu] Real-time update: ${items.length} items`)
        notifyMenuListeners(items)
      },
      (error: any) => {
        // Permission errors are expected - Firestore rules may restrict client access
        // Data is still served via API routes with admin SDK
        if (error?.code === "permission-denied") {
          console.warn("[firebase-menu] Firestore read denied - starting API polling fallback")
          // Start polling since real-time won't work
          startMenuPolling()
        } else {
          console.error("[firebase-menu] Menu listener error:", error)
        }
      }
    )
  } catch (error) {
    console.error("[firebase-menu] Failed to setup menu listener:", error)
    // Start polling as fallback
    startMenuPolling()
  }
}

// Polling fallback for when Firestore client access is denied
function startMenuPolling() {
  if (menuPollingInterval) return // Already polling
  
  menuPollingInterval = setInterval(async () => {
    const items = await fetchMenuItemsFromAPI()
    if (items.length > 0) {
      notifyMenuListeners(items)
    }
  }, POLLING_INTERVAL)
}

// Setup real-time Firebase listener for categories
async function setupCategoriesFirebaseListener() {
  if (categoryUnsubscribe) return // Already listening

  // Initial load from API
  if (!isCategoryInitialized) {
    isCategoryInitialized = true
    const categories = await fetchCategoriesFromAPI()
    if (categories.length > 0) {
      notifyCategoryListeners(categories)
    }
  }

  // Setup real-time listener
  const ready = await waitForFirebase(3)
  if (!ready) {
    console.warn("[firebase-menu] Firebase not available for real-time category updates")
    return
  }

  const db = await getFirebaseDb()
  if (!db) return

  try {
    const { collection, onSnapshot } = await import("firebase/firestore")
    const catRef = collection(db, "menu_categories")

    categoryUnsubscribe = onSnapshot(
      catRef,
      (snapshot) => {
        const categories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MenuCategory[]

        console.log(`[firebase-menu] Real-time update: ${categories.length} categories`)
        notifyCategoryListeners(categories)
      },
      (error: any) => {
        if (error?.code === "permission-denied") {
          console.warn("[firebase-menu] Firestore category read denied - starting API polling fallback")
          startCategoryPolling()
        } else {
          console.error("[firebase-menu] Category listener error:", error)
        }
      }
    )
  } catch (error) {
    console.error("[firebase-menu] Failed to setup category listener:", error)
    startCategoryPolling()
  }
}

// Polling fallback for categories
function startCategoryPolling() {
  if (categoryPollingInterval) return // Already polling
  
  categoryPollingInterval = setInterval(async () => {
    const categories = await fetchCategoriesFromAPI()
    if (categories.length > 0) {
      notifyCategoryListeners(categories)
    }
  }, POLLING_INTERVAL)
}

// Public: Subscribe to menu items
export function subscribeToMenuItems(callback: (items: MenuItem[]) => void) {
  menuItemListeners.add(callback)

  // Immediately provide cached data if available
  if (currentMenuItems.length > 0) {
    callback(currentMenuItems)
  }

  // Setup listener (no-op if already active)
  setupMenuFirebaseListener()

  // Return unsubscribe function
  return () => {
    menuItemListeners.delete(callback)
  }
}

// Public: Subscribe to categories
export function subscribeToMenuCategories(callback: (categories: MenuCategory[]) => void) {
  categoryListeners.add(callback)

  // Immediately provide cached data if available
  if (currentCategories.length > 0) {
    callback(currentCategories)
  }

  // Setup listener (no-op if already active)
  setupCategoriesFirebaseListener()

  // Return unsubscribe function
  return () => {
    categoryListeners.delete(callback)
  }
}

// Helper: Clean data for Firestore
function sanitizeForFirebase<T extends Record<string, any>>(data: T): Record<string, any> {
  const sanitized: Record<string, any> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue
    if (value === null) {
      sanitized[key] = null
    } else if (Array.isArray(value)) {
      sanitized[key] = value.filter((v) => v !== undefined)
    } else if (typeof value === "object" && !(value instanceof Date)) {
      sanitized[key] = sanitizeForFirebase(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

// Public: Add menu item
export async function addMenuItem(item: Omit<MenuItem, "id">): Promise<string> {
  const isPublished = item.published ?? true
  const sanitizedItem = sanitizeForFirebase({
    name: item.name || "",
    description: item.description || "",
    priceEur: item.priceEur || 0,
    categoryId: item.categoryId || "",
    imageUrl: item.imageUrl || "/placeholder.svg",
    available: item.available ?? true,
    published: isPublished,
    isActive: isPublished, // Required by Firestore rules
    preparationTime: item.preparationTime ?? 15,
    calories: item.calories ?? null,
    allergens: Array.isArray(item.allergens) ? item.allergens : [],
    isVegetarian: item.isVegetarian ?? false,
    isVegan: item.isVegan ?? false,
    isGlutenFree: item.isGlutenFree ?? false,
    spicyLevel: item.spicyLevel ?? 0,
    orderCount: 0,
  })

  const response = await fetch("/api/menu/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sanitizedItem),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to add item")
  }

  const data = await response.json()
  return data.id
}

// Public: Update menu item
export async function updateMenuItem(id: string, updates: Partial<MenuItem>) {
  // Sync isActive with published for Firestore rules compatibility
  if (updates.published !== undefined) {
    (updates as any).isActive = updates.published
  }
  const sanitizedUpdates = sanitizeForFirebase(updates)

  const response = await fetch(`/api/menu/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sanitizedUpdates),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update item")
  }
}

// Public: Delete menu item
export async function deleteMenuItem(id: string) {
  const response = await fetch(`/api/menu/items/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete item")
  }
}

// Public: Add category
export async function addCategory(category: Omit<MenuCategory, "id">): Promise<string> {
  const isPublished = category.published ?? true
  const sanitized = sanitizeForFirebase({
    name: category.name,
    description: category.description || "",
    order: category.order ?? 0,
    published: isPublished,
    isActive: isPublished, // Required by Firestore rules
  })

  const response = await fetch("/api/menu/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sanitized),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to add category")
  }

  const data = await response.json()
  return data.id
}

// Public: Update category
export async function updateCategory(id: string, updates: Partial<MenuCategory>) {
  // Sync isActive with published for Firestore rules compatibility
  if (updates.published !== undefined) {
    (updates as any).isActive = updates.published
  }
  const sanitized = sanitizeForFirebase(updates)

  const response = await fetch(`/api/menu/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sanitized),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update category")
  }
}

// Public: Delete category
export async function deleteCategory(id: string) {
  console.log(`[firebase-menu] Deleting category: ${id}`)
  
  const response = await fetch(`/api/menu/categories/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) {
    let errorMsg = "Failed to delete category"
    try {
      const text = await response.text()
      if (text) {
        const error = JSON.parse(text)
        errorMsg = error.error || errorMsg
      }
    } catch {
      // Response wasn't JSON
    }
    throw new Error(errorMsg)
  }
  
  console.log(`[firebase-menu] Category ${id} deleted`)
}

// Legacy exports (no-ops for compatibility)
export async function incrementItemOrderCount(itemId: string) {}
export async function getPopularItems(limit = 4): Promise<MenuItem[]> {
  return currentMenuItems.slice(0, limit)
}
export async function initializeMenuData() {}
export function clearDeletedItemIds() {}
