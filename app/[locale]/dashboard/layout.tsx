import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/**
 * Dashboard Layout - Editorial Minimal Design
 */

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#fafaf9', fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}

