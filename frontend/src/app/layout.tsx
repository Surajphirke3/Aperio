import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/core/providers';

export const metadata: Metadata = {
  title: 'Aperio — Material Traceability',
  description: 'Intelligent recycled materials traceability system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}