'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/core/auth/firebase';
import type { DashboardStats } from '@/shared/types';

export function useRealtimeStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'material_entries'), (snapshot) => {
      const entries = snapshot.docs.map((d) => d.data());
      const byMaterial: Record<string, number> = {};
      const byStage: Record<string, number> = {};
      let totalDispatched = 0;

      for (const e of entries) {
        const mat = (e.material as string) ?? 'unknown';
        const qty = (e.quantity_kg as number) ?? 0;
        byMaterial[mat] = (byMaterial[mat] ?? 0) + qty;
        const stage = (e.stage as string) ?? 'unknown';
        byStage[stage] = (byStage[stage] ?? 0) + qty;
        if (e.intent === 'dispatch') totalDispatched += qty;
      }

      setStats({
        total_entries: entries.length,
        by_material: byMaterial,
        by_stage: byStage,
        total_dispatched_kg: Math.round(totalDispatched * 100) / 100,
      });
    });

    return () => unsubscribe();
  }, []);

  return { stats };
}