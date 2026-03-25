'use client';

import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  auth,
  type AuthUser,
  clearStoredDevSession,
  getStoredDevSession,
  isFirebaseConfigured,
  setStoredDevSession,
} from './firebase';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      const session = getStoredDevSession();
      setUser(session?.user ?? null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser ? { uid: nextUser.uid, email: nextUser.email } : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth || !isFirebaseConfigured) {
      const session = {
        token: `dev-token-${Date.now()}`,
        user: {
          uid: `dev-${email || 'user'}`,
          email: email || 'dev@example.com',
        },
      };
      setStoredDevSession(session);
      setUser(session.user);
      return session;
    }

    const credential = await signInWithEmailAndPassword(auth, email, password);
    setUser({ uid: credential.user.uid, email: credential.user.email });
    return credential;
  };

  const signInWithGoogle = async () => {
    if (!auth || !isFirebaseConfigured) {
      const session = {
        token: `dev-google-token-${Date.now()}`,
        user: {
          uid: 'dev-google-user',
          email: 'dev-google@example.com',
        },
      };
      setStoredDevSession(session);
      setUser(session.user);
      return session;
    }

    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    setUser({ uid: credential.user.uid, email: credential.user.email });
    return credential;
  };

  const signOut = async () => {
    clearStoredDevSession();
    setUser(null);
    if (auth && isFirebaseConfigured) {
      await firebaseSignOut(auth);
    }
  };

  return { user, loading, signInWithEmail, signInWithGoogle, signOut };
}
