'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

// The global footer is hidden on dashboard/admin routes, which provide
// their own full-height layout (sidebar + mobile nav).
export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }
  return <Footer />;
}
