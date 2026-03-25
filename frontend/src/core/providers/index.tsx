'use client';

import { ReactNode } from 'react';
import { SWRProvider } from './SWRProvider';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SWRProvider>{children}</SWRProvider>
    </ThemeProvider>
  );
}
