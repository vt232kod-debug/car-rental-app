'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

function initialsFrom(name?: string | null, email?: string | null) {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  return (email?.[0] ?? 'U').toUpperCase();
}

export default function UserMenu({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isAdmin = session.user?.role === 'ADMIN';
  const name = session.user?.name ?? 'User';
  const email = session.user?.email ?? '';
  const initials = initialsFrom(session.user?.name, session.user?.email);

  const dashboardHref = isAdmin ? '/admin' : '/dashboard';
  const bookingsHref = isAdmin ? '/admin/bookings' : '/dashboard/bookings';
  const profileHref = isAdmin ? '/admin/profile' : '/dashboard/profile';

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const menuItems = [
    {
      href: dashboardHref,
      label: isAdmin ? 'Admin panel' : 'Dashboard',
      icon: (
        <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' />
      ),
    },
    {
      href: bookingsHref,
      label: 'My Bookings',
      icon: (
        <>
          <rect x='3' y='4' width='18' height='18' rx='2' />
          <line x1='16' y1='2' x2='16' y2='6' />
          <line x1='8' y1='2' x2='8' y2='6' />
          <line x1='3' y1='10' x2='21' y2='10' />
        </>
      ),
    },
    {
      href: profileHref,
      label: 'Profile',
      icon: (
        <>
          <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
          <circle cx='12' cy='7' r='4' />
        </>
      ),
    },
  ];

  return (
    <div className='relative' ref={ref}>
      <button
        type='button'
        onClick={() => setOpen(o => !o)}
        aria-haspopup='menu'
        aria-expanded={open}
        aria-label='Account menu'
        className='flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white ring-2 ring-transparent transition-all hover:opacity-90 hover:ring-accent/30 focus:outline-none focus-visible:ring-accent/40'
      >
        {initials}
      </button>

      {open && (
        <div
          role='menu'
          className='absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-black/10'
        >
          <div className='border-b border-border px-4 py-3'>
            <p className='truncate text-sm font-semibold text-foreground'>
              {name}
            </p>
            <p className='truncate text-xs text-muted'>{email}</p>
          </div>

          <div className='py-1'>
            {menuItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                role='menuitem'
                onClick={() => setOpen(false)}
                className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-alt'
              >
                <svg
                  width='17'
                  height='17'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='shrink-0 text-muted'
                  aria-hidden='true'
                >
                  {item.icon}
                </svg>
                {item.label}
              </Link>
            ))}
          </div>

          <div className='border-t border-border py-1'>
            <button
              type='button'
              role='menuitem'
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className='flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-alt'
            >
              <svg
                width='17'
                height='17'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='shrink-0 text-muted'
                aria-hidden='true'
              >
                <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                <polyline points='16 17 21 12 16 7' />
                <line x1='21' y1='12' x2='9' y2='12' />
              </svg>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
