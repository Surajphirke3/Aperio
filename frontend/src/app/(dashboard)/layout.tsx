import { ReactNode } from 'react';
import Link from 'next/link';
import { SWRProvider } from '@/core/providers/SWRProvider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SWRProvider>
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-gray-50 p-4">
          <nav className="space-y-2">
            <Link href="/" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100">Dashboard</Link>
            <Link href="/batches" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100">Batches</Link>
            <Link href="/vendors" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100">Vendors</Link>
            <Link href="/carbon" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100">Carbon</Link>
            <Link href="/chat" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100">Chat</Link>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </SWRProvider>
  );
}
