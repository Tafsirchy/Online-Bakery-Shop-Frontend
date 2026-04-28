'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, isLoading, hasHydrated, checkAuth } = useAuthStore();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-cream-highlight border-b border-brown/5 flex items-center justify-between px-6 z-40 backdrop-blur-md bg-white/80">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-brown hover:bg-brown/5 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-serif text-brown font-bold text-base">Dashboard</span>
        <div className="w-9 h-9 rounded-full bg-sage/10 flex items-center justify-center text-sage font-bold text-[10px] border border-sage/20">
          {user.name?.[0] || 'U'}
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
