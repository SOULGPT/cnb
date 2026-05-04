
import { db } from "./firebase"
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where,
  orderBy
} from "firebase/firestore"
import { CheckoutOffer } from "@/types"

const OFFERS_COLLECTION = "checkout_offers"

export function subscribeToCheckoutOffers(callback: (offers: CheckoutOffer[]) => void) {
  const q = query(collection(db, OFFERS_COLLECTION))
  return onSnapshot(q, (snapshot) => {
    const offers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CheckoutOffer[]
    callback(offers)
  })
}

export async function addCheckoutOffer(offer: Omit<CheckoutOffer, "id">) {
  return addDoc(collection(db, OFFERS_COLLECTION), offer)
}

export async function updateCheckoutOffer(id: string, offer: Partial<CheckoutOffer>) {
  const docRef = doc(db, OFFERS_COLLECTION, id)
  return updateDoc(docRef, offer)
}

export async function deleteCheckoutOffer(id: string) {
  return deleteDoc(doc(db, OFFERS_COLLECTION, id))
}
