'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isFirebaseConfigured } from '@/core/auth/firebase';
import { useAuthContext } from '@/core/providers/AuthProvider';
import { Button } from '@/shared/ui';

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle, user, loading } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nextPath = searchParams.get('next') || '/chat';

  useEffect(() => {
    if (!loading && user) {
      router.replace(nextPath);
    }
  }, [loading, nextPath, router, user]);

  const handleEmail = async () => {
    try {
      await signInWithEmail(email, password);
      router.push(nextPath);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push(nextPath);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-[var(--accent-primary)]">aperio</h1>
        <p className="text-sm font-mono text-[var(--text-muted)] mt-1">Material Traceability</p>
      </div>

      {!isFirebaseConfigured && (
        <p className="text-xs font-mono text-[var(--text-muted)] text-center">
          Dev auth mode is active. Any email and password will sign in locally.
        </p>
      )}

      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent-primary)]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent-primary)]"
        />
        <Button onClick={handleEmail} className="w-full">Sign in</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-[10px] font-mono text-[var(--text-muted)]">or</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <Button variant="secondary" onClick={handleGoogle} className="w-full">
        Sign in with Google
      </Button>

      {error && <p className="text-xs font-mono text-[var(--status-danger)] text-center">{error}</p>}
    </div>
  );
}
