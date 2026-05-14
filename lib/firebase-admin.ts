import "server-only"
import { initializeApp, getApps, cert, getApp, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let adminApp: App | null = null
let adminAuth: Auth | null = null
let adminDb: Firestore | null = null

function initializeFirebaseAdmin() {
  if (adminApp) return

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("[v0] Firebase Admin credentials missing. Admin features will not work.")
    return
  }

  try {
    const firebaseAdminConfig = {
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    }

    adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApp()
    adminAuth = getAuth(adminApp)
    adminDb = getFirestore(adminApp)
  } catch (error) {
    console.error("[v0] Failed to initialize Firebase Admin:", error)
  }
}

// Initialize on module load
initializeFirebaseAdmin()

// Export as functions or non-null assertions to satisfy TypeScript
// Note: If env vars are missing, these will still be null at runtime,
// but the app should handle that or the build should fail if mandatory.
export const getAdminApp = () => {
    if (!adminApp) throw new Error("Firebase Admin App not initialized. Check your environment variables.")
    return adminApp
}

export const getAdminAuth = () => {
    if (!adminAuth) throw new Error("Firebase Admin Auth not initialized. Check your environment variables.")
    return adminAuth
}

export const getAdminDb = () => {
    if (!adminDb) throw new Error("Firebase Admin Firestore not initialized. Check your environment variables.")
    return adminDb
}

// Keep the old exports for compatibility but use non-null assertions
// Since these are only used in server-side routes, we expect env vars to be there.
export { adminAuth, adminDb }
