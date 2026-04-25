import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import AdminNav from './AdminNav';

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className='flex min-h-screen bg-background'>
      {/* Sidebar — desktop only */}
      <aside className='hidden lg:flex w-56 shrink-0 border-r border-border bg-surface flex-col py-6 px-3'>
        <div className='px-3 mb-1'>
          <Link href='/' className='text-lg font-extrabold text-accent'>
            Rentola
          </Link>
        </div>
        <p className='px-3 mb-6 text-xs font-bold uppercase tracking-widest text-muted'>
          Admin Panel
        </p>

        <nav className='flex flex-col gap-1'>
          <AdminNav />
        </nav>

        <div className='mt-auto border-t border-border pt-4 px-3 flex items-center gap-3'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white'>
            AD
          </div>
          <div className='min-w-0 flex-1'>
            <p className='text-xs font-semibold text-foreground'>Admin</p>
            <p className='truncate text-xs text-muted'>{session.user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className='fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden'>
        <Link href='/' className='text-lg font-extrabold text-accent'>
          Rentola
        </Link>
        <span className='text-xs font-bold uppercase tracking-widest text-muted'>
          Admin Panel
        </span>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white'>
          AD
        </div>
      </header>

      {/* Main content */}
      <main className='flex-1 overflow-y-auto p-4 pt-[72px] pb-24 lg:p-8 lg:pt-8 lg:pb-8'>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className='fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface lg:hidden'>
        <AdminNav mobile />
      </nav>
    </div>
  );
}
