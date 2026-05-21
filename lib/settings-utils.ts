import { getFirebaseDb, isFirebaseConfigured } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { StoreSettings, DEFAULT_STORE_SETTINGS } from "@/types/settings"

export async function getStoreSettings(): Promise<StoreSettings> {
  if (!isFirebaseConfigured()) {
    return DEFAULT_STORE_SETTINGS
  }

  try {
    const db = await getFirebaseDb()
    if (!db) return DEFAULT_STORE_SETTINGS

    const settingsDoc = await getDoc(doc(db, "settings", "store_config"))
    if (settingsDoc.exists()) {
      return { ...DEFAULT_STORE_SETTINGS, ...settingsDoc.data() } as StoreSettings
    }
  } catch (error) {
    console.error("Error fetching store settings:", error)
  }

  return DEFAULT_STORE_SETTINGS
}

export async function saveStoreSettings(settings: StoreSettings): Promise<boolean> {
  if (!isFirebaseConfigured()) return false

  try {
    const db = await getFirebaseDb()
    if (!db) return false

    await setDoc(doc(db, "settings", "store_config"), settings, { merge: true })
    return true
  } catch (error) {
    console.error("Error saving store settings:", error)
    return false
  }
}
