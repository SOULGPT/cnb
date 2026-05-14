import { getFirebaseDbSync, isFirebaseConfigured } from "./firebase"
import type { MenuItem, Order, Promotion } from "@/types"
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, getDocs, Timestamp, limit } from "firebase/firestore"

export const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID || "curry-burger-main"

// ============================================
// MENU ITEMS - /restaurants/{restaurantId}/items/{itemId}
// ============================================

export interface FirestoreMenuItem {
  title: string
  description: string
  price: number
  imageUrl: string
  published: boolean
  categoryId: string
  orderCount: number
  createdAt: any
  updatedAt: any
}

export function subscribeToPublishedItems(callback: (items: MenuItem[]) => void) {
  const db = getFirebaseDbSync()
  if (!isFirebaseConfigured() || !db) {
    return () => {}
  }

  const itemsRef = collection(db, "restaurants", RESTAURANT_ID, "items")
  const q = query(itemsRef, where("published", "==", true), orderBy("title"))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.title || "Unknown Item",
          description: data.description || "",
          priceEur: Number(data.price) || 0,
          imageUrl: data.imageUrl || "/placeholder.svg",
          categoryId: data.categoryId || "uncategorized",
          published: data.published ?? true,
          orderCount: data.orderCount || 0,
          available: data.published ?? true,
        }
      }) as MenuItem[]

      callback(items)
    },
    (error) => {
      console.error("Error subscribing to items:", error)
    },
  )

  return unsubscribe
}

export function subscribeToAllItems(callback: (items: MenuItem[]) => void) {
  const db = getFirebaseDbSync()
  if (!isFirebaseConfigured() || !db) return () => {}

  const itemsRef = collection(db, "restaurants", RESTAURANT_ID, "items")
  const q = query(itemsRef, orderBy("title"))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.title || "Unknown Item",
          description: data.description || "",
          priceEur: Number(data.price) || 0,
          imageUrl: data.imageUrl || "/placeholder.svg",
          categoryId: data.categoryId || "uncategorized",
          published: data.published ?? true,
          orderCount: data.orderCount || 0,
          available: data.published ?? true,
        }
      }) as MenuItem[]

      callback(items)
    },
    (error) => {
      console.error("Error subscribing to all items:", error)
    },
  )

  return unsubscribe
}

export async function createMenuItem(item: Omit<FirestoreMenuItem, "createdAt" | "updatedAt" | "orderCount">) {
  const db = getFirebaseDbSync()
  if (!db) throw new Error("Firebase not configured")

  const itemsRef = collection(db, "restaurants", RESTAURANT_ID, "items")
  const docRef = await addDoc(itemsRef, {
    ...item,
    orderCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export async function updateMenuItem(itemId: string, updates: Partial<FirestoreMenuItem>) {
  const db = getFirebaseDbSync()
  if (!db) throw new Error("Firebase not configured")

  const itemRef = doc(db, "restaurants", RESTAURANT_ID, "items", itemId)
  await updateDoc(itemRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteMenuItem(itemId: string) {
  const db = getFirebaseDbSync()
  if (!db) throw new Error("Firebase not configured")

  const itemRef = doc(db, "restaurants", RESTAURANT_ID, "items", itemId)
  await deleteDoc(itemRef)
}

// ============================================
// OFFERS - /restaurants/{restaurantId}/offers/{offerId}
// ============================================

export interface FirestoreOffer {
  title: string
  discountPercent: number
  startsAt: any
  endsAt: any
  active: boolean
  createdAt: any
  imageUrl?: string
  description?: string
}

export function subscribeToActiveOffers(callback: (offers: Promotion[]) => void) {
  const db = getFirebaseDbSync()
  if (!isFirebaseConfigured() || !db) return () => {}

  const offersRef = collection(db, "restaurants", RESTAURANT_ID, "offers")
  const now = Timestamp.now()
  const q = query(offersRef, where("active", "==", true), where("endsAt", ">", now), orderBy("endsAt"))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const offers = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description || "",
        imageUrl: doc.data().imageUrl || "",
        discount: `${doc.data().discountPercent}%`,
        validUntil: doc.data().endsAt.toDate(),
        active: doc.data().active,
      })) as Promotion[]

      callback(offers)
    },
    (error) => {
      console.error("Error subscribing to offers:", error)
    },
  )

  return unsubscribe
}

export async function createOffer(offer: Omit<FirestoreOffer, "createdAt">) {
  const db = getFirebaseDbSync()
  if (!db) throw new Error("Firebase not configured")

  const offersRef = collection(db, "restaurants", RESTAURANT_ID, "offers")
  const docRef = await addDoc(offersRef, {
    ...offer,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

// ============================================
// ORDERS - /orders/{orderId}
// ============================================

export interface FirestoreOrder {
  restaurantId: string
  userId: string
  items: Array<{
    itemId: string
    name: string
    qty: number
    price: number
  }>
  total: number
  status: string
  type: "pickup" | "delivery"
  createdAt: any
  customerContact: {
    name: string
    email: string
    phone: string
  }
  deliveryAddress?: {
    street: string
    city: string
    postalCode: string
  }
  metadata?: Record<string, any>
}

export async function createOrder(order: Omit<FirestoreOrder, "createdAt" | "restaurantId">) {
  const db = getFirebaseDbSync()
  if (!db) throw new Error("Firebase not configured")

  const ordersRef = collection(db, "orders")
  const docRef = await addDoc(ordersRef, {
    ...order,
    restaurantId: RESTAURANT_ID,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export function subscribeToUserOrders(userId: string, callback: (orders: Order[]) => void) {
  const db = getFirebaseDbSync()
  if (!isFirebaseConfigured() || !db) return () => {}

  const ordersRef = collection(db, "orders")
  const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          userId: data.userId,
          branchId: data.restaurantId,
          items: (data.items || []).map((item: any) => ({
            id: item.itemId || Math.random().toString(36).substr(2, 9),
            menuItem: {
              id: item.itemId || "unknown",
              name: item.name || "Unknown Item",
              priceEur: Number(item.price) || 0,
              categoryId: "unknown",
              imageUrl: "/placeholder.svg",
              available: true
            },
            quantity: Number(item.qty) || 1,
            totalPrice: (Number(item.price) || 0) * (Number(item.qty) || 1),
            customizations: [],
          })),
          totalEur: data.total,
          status: data.status,
          type: data.type,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.createdAt?.toDate() || new Date(),
        }
      }) as Order[]

      callback(orders)
    },
    (error) => {
      console.error("Error subscribing to user orders:", error)
    },
  )

  return unsubscribe
}

export function subscribeToRestaurantOrders(callback: (orders: any[]) => void) {
  const db = getFirebaseDbSync()
  if (!isFirebaseConfigured() || !db) return () => {}

  const ordersRef = collection(db, "orders")
  const q = query(ordersRef, where("restaurantId", "==", RESTAURANT_ID), orderBy("createdAt", "desc"), limit(50))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }))

      callback(orders)
    },
    (error) => {
      console.error("Error subscribing to restaurant orders:", error)
    },
  )

  return unsubscribe
}

export async function updateOrderStatus(orderId: string, status: string) {
  const db = getFirebaseDbSync()
  if (!db) throw new Error("Firebase not configured")

  const orderRef = doc(db, "orders", orderId)
  await updateDoc(orderRef, { status })
}

// ============================================
// ANALYTICS - /analytics/popularItems/{restaurantId}/{itemId}
// ============================================

export async function getPopularItems(limitCount = 4): Promise<MenuItem[]> {
  const db = getFirebaseDbSync()
  if (!isFirebaseConfigured() || !db) return []

  try {
    const itemsRef = collection(db, "restaurants", RESTAURANT_ID, "items")
    const q = query(itemsRef, where("published", "==", true), orderBy("orderCount", "desc"), limit(limitCount))

    const snapshot = await getDocs(q)
    const items = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.title || "Unknown Item",
        description: data.description || "",
        priceEur: Number(data.price) || 0,
        imageUrl: data.imageUrl || "/placeholder.svg",
        categoryId: data.categoryId || "uncategorized",
        published: data.published ?? true,
        orderCount: data.orderCount || 0,
        available: true,
      }
    }) as MenuItem[]

    return items
  } catch (error) {
    console.error("Error fetching popular items:", error)
    return []
  }
}
