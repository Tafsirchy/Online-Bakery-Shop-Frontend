'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const { user, isLoading, hasHydrated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated) {
      checkAuth();
    }
  }, [hasHydrated, checkAuth]);

  useEffect(() => {
    if (hasHydrated && !isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, hasHydrated, router]);

  if (!hasHydrated || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
