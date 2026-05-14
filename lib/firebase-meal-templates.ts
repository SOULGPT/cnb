import { getFirebaseDbSync, isFirebaseConfigured } from "./firebase"
import type { MealTemplate } from "@/types"
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore"

const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID || "default"

// Subscribe to meal templates with real-time updates
export function subscribeToMealTemplates(callback: (templates: MealTemplate[]) => void) {
  const db = getFirebaseDbSync()

  if (!isFirebaseConfigured() || !db) {
    callback([])
    return () => {}
  }

  const q = query(collection(db, "meal_templates"), where("restaurantId", "==", RESTAURANT_ID), orderBy("name"))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const templates: MealTemplate[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      templates.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as MealTemplate)
    })
    callback(templates)
  })

  return unsubscribe
}

// Add new meal template
export async function addMealTemplate(template: Omit<MealTemplate, "id" | "createdAt" | "updatedAt" | "restaurantId">) {
  const db = getFirebaseDbSync()
  if (!db) throw new Error("Firebase not configured")

  const now = Timestamp.now()
  const data: any = {
    ...template,
    restaurantId: RESTAURANT_ID,
    createdAt: now,
    updatedAt: now,
  }

  // Remove undefined fields
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) {
      delete data[key]
    }
  })

  return await addDoc(collection(db, "meal_templates"), data)
}

// Update meal template
export async function updateMealTemplate(id: string, updates: Partial<MealTemplate>) {
  const db = getFirebaseDbSync()
  if (!db) throw new Error("Firebase not configured")

  const templateRef = doc(db, "meal_templates", id)
  const data: any = {
    ...updates,
    updatedAt: Timestamp.now(),
  }

  // Remove undefined fields
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) {
      delete data[key]
    }
  })

  return await updateDoc(templateRef, data)
}

// Delete meal template
export async function deleteMealTemplate(id: string) {
  const db = getFirebaseDbSync()
  if (!db) throw new Error("Firebase not configured")

  const templateRef = doc(db, "meal_templates", id)
  return await deleteDoc(templateRef)
}
