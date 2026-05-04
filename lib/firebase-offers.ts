
import { getFirebaseDb, waitForFirebase } from "./firebase"
import { CheckoutOffer } from "@/types"

const OFFERS_COLLECTION = "checkout_offers"

export async function subscribeToCheckoutOffers(callback: (offers: CheckoutOffer[]) => void) {
  // Wait for Firebase to be ready
  const ready = await waitForFirebase(3)
  if (!ready) {
    console.warn("[firebase-offers] Firebase not available")
    return () => {}
  }

  const db = await getFirebaseDb()
  if (!db) return () => {}

  try {
    const { collection, onSnapshot, query } = await import("firebase/firestore")
    const q = query(collection(db, OFFERS_COLLECTION))
    
    return onSnapshot(q, (snapshot) => {
      const offers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CheckoutOffer[]
      callback(offers)
    })
  } catch (error) {
    console.error("[firebase-offers] Subscription error:", error)
    return () => {}
  }
}

export async function addCheckoutOffer(offer: Omit<CheckoutOffer, "id">) {
  const db = await getFirebaseDb()
  if (!db) throw new Error("Database not ready")

  const { collection, addDoc } = await import("firebase/firestore")
  return addDoc(collection(db, OFFERS_COLLECTION), offer)
}

export async function updateCheckoutOffer(id: string, offer: Partial<CheckoutOffer>) {
  const db = await getFirebaseDb()
  if (!db) throw new Error("Database not ready")

  const { doc, updateDoc } = await import("firebase/firestore")
  const docRef = doc(db, OFFERS_COLLECTION, id)
  return updateDoc(docRef, offer)
}

export async function deleteCheckoutOffer(id: string) {
  const db = await getFirebaseDb()
  if (!db) throw new Error("Database not ready")

  const { doc, deleteDoc } = await import("firebase/firestore")
  return deleteDoc(doc(db, OFFERS_COLLECTION, id))
}
