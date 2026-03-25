import { initializeApp, getApps } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { env } from '@/core/config/env';

export interface AuthUser {
  uid: string;
  email: string | null;
}

interface DevAuthSession {
  token: string;
  user: AuthUser;
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigured = Object.values(firebaseConfig).every((value) => value.trim().length > 0);
const app = isConfigured ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : null;
const DEV_AUTH_KEY = 'aperio.dev-auth';

export const isFirebaseConfigured = isConfigured;
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;

export function getStoredDevSession(): DevAuthSession | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(DEV_AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DevAuthSession;
  } catch {
    window.localStorage.removeItem(DEV_AUTH_KEY);
    return null;
  }
}

export function setStoredDevSession(session: DevAuthSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DEV_AUTH_KEY, JSON.stringify(session));
}

export function clearStoredDevSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DEV_AUTH_KEY);
}

export async function getAccessToken(): Promise<string | null> {
  if (auth?.currentUser) {
    return auth.currentUser.getIdToken();
  }
  return getStoredDevSession()?.token ?? null;
}
