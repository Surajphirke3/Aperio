import { ReactNode } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-gray-50 p-4">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <span className="text-2xl">♻️</span>
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Aperio
          </span>
        </Link>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 text-gray-700 hover:text-emerald-600">
            Dashboard
          </Link>
          <Link href="/dashboard/batches" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 text-gray-700 hover:text-emerald-600">
            Batches
          </Link>
          <Link href="/dashboard/vendors" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 text-gray-700 hover:text-emerald-600">
            Vendors
          </Link>
          <Link href="/dashboard/carbon" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 text-gray-700 hover:text-emerald-600">
            Carbon
          </Link>
          <Link href="/dashboard/chat" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 text-gray-700 hover:text-emerald-600">
            Chat
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
}