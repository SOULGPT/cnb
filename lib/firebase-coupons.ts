import { getFirebaseDb, waitForFirebase } from "./firebase"
import type { Coupon } from "@/types"

// Listener sets for real-time updates
const couponListeners: Set<(coupons: Coupon[]) => void> = new Set()
let currentCoupons: Coupon[] = []
let couponUnsubscribe: (() => void) | null = null
let isInitialized = false

// Notify all listeners
function notifyCouponListeners(coupons: Coupon[]) {
  currentCoupons = coupons
  couponListeners.forEach((callback) => {
    try {
      callback(coupons)
    } catch (error) {
      console.error("[firebase-coupons] Listener error:", error)
    }
  })
}

// Fetch coupons from API
async function fetchCouponsFromAPI(): Promise<Coupon[]> {
  try {
    const response = await fetch(`/api/coupons?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
    if (response.ok) {
      const data = await response.json()
      if (data.coupons && Array.isArray(data.coupons)) {
        return data.coupons.map((c: any) => ({
          ...c,
          validFrom: c.validFrom ? new Date(c.validFrom) : new Date(),
          validTo: c.validTo ? new Date(c.validTo) : new Date(),
        }))
      }
    }
  } catch (error) {
    console.error("[firebase-coupons] API fetch error:", error)
  }
  return []
}

// Setup real-time listener
async function setupCouponsFirebaseListener() {
  if (couponUnsubscribe) return

  // Initial load from API
  if (!isInitialized) {
    isInitialized = true
    const coupons = await fetchCouponsFromAPI()
    if (coupons.length > 0) {
      notifyCouponListeners(coupons)
    }
  }

  // Setup real-time listener
  const ready = await waitForFirebase(3)
  if (!ready) return

  const db = await getFirebaseDb()
  if (!db) return

  try {
    const { collection, onSnapshot } = await import("firebase/firestore")
    const couponsRef = collection(db, "coupons")

    couponUnsubscribe = onSnapshot(
      couponsRef,
      (snapshot) => {
        const coupons = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          validFrom: doc.data().validFrom?.toDate?.() || new Date(),
          validTo: doc.data().validTo?.toDate?.() || new Date(),
        })) as Coupon[]

        console.log(`[firebase-coupons] Real-time update: ${coupons.length} coupons`)
        notifyCouponListeners(coupons)
      },
      (error) => {
        console.error("[firebase-coupons] Listener error:", error)
      }
    )
  } catch (error) {
    console.error("[firebase-coupons] Failed to setup listener:", error)
  }
}

// Public: Subscribe to coupons
export function subscribeToCoupons(callback: (coupons: Coupon[]) => void) {
  couponListeners.add(callback)

  if (currentCoupons.length > 0) {
    callback(currentCoupons)
  }

  setupCouponsFirebaseListener()

  return () => {
    couponListeners.delete(callback)
  }
}

// Public: Add coupon
export async function addCoupon(coupon: Omit<Coupon, "id">): Promise<string> {
  const response = await fetch("/api/coupons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coupon),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to add coupon")
  }

  const data = await response.json()
  return data.id
}

// Public: Update coupon
export async function updateCoupon(id: string, updates: Partial<Coupon>) {
  const response = await fetch(`/api/coupons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update coupon")
  }
}

// Public: Delete coupon
export async function deleteCoupon(id: string) {
  const response = await fetch(`/api/coupons/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete coupon")
  }
}

// Public: Validate coupon
export async function validateCoupon(
  code: string,
  orderTotal: number,
  userId?: string
): Promise<{ valid: boolean; coupon?: Coupon; discount?: number; message: string }> {
  // First check current cached coupons
  const coupon = currentCoupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase() && c.active
  )

  if (!coupon) {
    // Try fetching fresh from API
    const freshCoupons = await fetchCouponsFromAPI()
    const freshCoupon = freshCoupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase() && c.active
    )

    if (!freshCoupon) {
      return { valid: false, message: "Invalid coupon code" }
    }

    return validateCouponData(freshCoupon, orderTotal, userId)
  }

  return validateCouponData(coupon, orderTotal, userId)
}

// Helper: Validate coupon data
function validateCouponData(
  coupon: Coupon,
  orderTotal: number,
  userId?: string
): { valid: boolean; coupon?: Coupon; discount?: number; message: string } {
  // Check if user has already used this coupon (for single-use coupons)
  if (userId && coupon.usagePerCustomer === "single" && coupon.usedBy?.includes(userId)) {
    return { valid: false, message: "You have already used this coupon" }
  }

  // Check validity dates
  const now = new Date()
  const validFrom = new Date(coupon.validFrom)
  const validTo = new Date(coupon.validTo)
  if (now < validFrom || now > validTo) {
    return { valid: false, message: "This coupon has expired or is not yet valid" }
  }

  // Check minimum order amount
  if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `Minimum order amount is €${coupon.minOrderAmount.toFixed(2)}`,
    }
  }

  // Calculate discount
  let discount =
    coupon.discountType === "percentage"
      ? orderTotal * (coupon.discountValue / 100)
      : coupon.discountValue

  // Apply max discount cap if set
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount
  }

  return {
    valid: true,
    coupon,
    discount,
    message: `Coupon applied! You saved €${discount.toFixed(2)}`,
  }
}

// Public: Increment coupon usage
export async function incrementCouponUsage(couponId: string, userId?: string) {
  const response = await fetch(`/api/coupons/${couponId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  })

  if (!response.ok) {
    console.error("[firebase-coupons] Failed to increment usage")
  }
}
