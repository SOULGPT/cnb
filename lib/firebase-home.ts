import { getFirebaseDb, waitForFirebase } from "./firebase"
import type { HomeBanner } from "@/types"

const bannerListeners: Set<(banners: HomeBanner[]) => void> = new Set()
let currentBanners: HomeBanner[] = []
let bannerUnsubscribe: (() => void) | null = null

function notifyBannerListeners(banners: HomeBanner[]) {
  const sorted = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0))
  currentBanners = sorted
  bannerListeners.forEach((callback) => {
    try {
      callback(sorted)
    } catch (error) {
      console.error("[firebase-home] Banner listener error:", error)
    }
  })
}

export async function setupHomeBannersListener() {
  if (bannerUnsubscribe) return

  const ready = await waitForFirebase(3)
  if (!ready) return

  const db = await getFirebaseDb()
  if (!db) return

  try {
    const { collection, onSnapshot, query, where } = await import("firebase/firestore")
    const bannerRef = collection(db, "banners")
    
    // Subscribe to all banners (admin will filter in UI if needed)
    bannerUnsubscribe = onSnapshot(
      bannerRef,
      (snapshot) => {
        const banners = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as HomeBanner[]
        notifyBannerListeners(banners)
      },
      (error) => {
        console.error("[firebase-home] Listener error:", error)
      }
    )
  } catch (error) {
    console.error("[firebase-home] Setup error:", error)
  }
}

export function subscribeToHomeBanners(callback: (banners: HomeBanner[]) => void) {
  bannerListeners.add(callback)
  if (currentBanners.length > 0) {
    callback(currentBanners)
  }
  setupHomeBannersListener()
  return () => {
    bannerListeners.delete(callback)
  }
}

export async function addHomeBanner(banner: Omit<HomeBanner, "id">): Promise<string> {
  const db = await getFirebaseDb()
  if (!db) throw new Error("Firebase not initialized")
  
  const { collection, addDoc } = await import("firebase/firestore")
  const docRef = await addDoc(collection(db, "banners"), banner)
  return docRef.id
}

export async function updateHomeBanner(id: string, updates: Partial<HomeBanner>) {
  const db = await getFirebaseDb()
  if (!db) throw new Error("Firebase not initialized")
  
  const { doc, updateDoc } = await import("firebase/firestore")
  await updateDoc(doc(db, "banners", id), updates)
}

export async function deleteHomeBanner(id: string) {
  const db = await getFirebaseDb()
  if (!db) throw new Error("Firebase not initialized")
  
  const { doc, deleteDoc } = await import("firebase/firestore")
  await deleteDoc(doc(db, "banners", id))
}
