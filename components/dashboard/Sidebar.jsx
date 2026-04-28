'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  ShoppingBag, 
  User, 
  Home,
  LogOut,
  BarChart3,
  Package,
  Users,
  Ticket,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'orders';
  const { user, logout } = useAuthStore();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (onClose) onClose();
  }, [pathname, currentTab]);

  const managementLinks = [
    { name: 'Analytics', path: '/management', icon: BarChart3 },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Sparkles },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    ...(user?.role === 'admin' ? [{ name: 'Users', path: '/admin/users', icon: Users }] : []),
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'My Orders', path: '/customer?tab=orders', icon: ShoppingBag, tab: 'orders' },
    { name: 'Profile', path: '/customer?tab=profile', icon: User, tab: 'profile' },
  ];

  const customerLinks = [
    { name: 'My Orders', path: '/customer?tab=orders', icon: ShoppingBag, tab: 'orders' },
    { name: 'Profile', path: '/customer?tab=profile', icon: User, tab: 'profile' },
  ];

  const links = (user?.role === 'admin' || user?.role === 'manager') ? managementLinks : customerLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside className={`
        fixed inset-y-0 left-0 w-64 md:w-72 bg-cream-highlight border-r border-brown/5 flex flex-col shrink-0 h-full z-[60] transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 pb-3">
          <Link href="/" className="text-2xl md:text-3xl font-serif text-brown font-bold tracking-tight block mb-4 px-0 transition-transform hover:scale-105 origin-left whitespace-nowrap">
            The Cozy <span className="text-caramel">Bakery</span>
          </Link>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1 h-5 bg-sage rounded-full" />
            <h2 className="text-lg font-bold text-brown tracking-tight">Dashboard</h2>
          </div>
          <p className="text-[8px] font-bold text-muted uppercase tracking-[0.2em] ml-3 opacity-50">
            {user?.role || 'Customer'} Portal
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
          {links.map((link) => {
            const isManagement = user?.role === 'admin' || user?.role === 'manager';
            const isActive = isManagement 
              ? (link.tab ? (pathname === '/customer' && currentTab === link.tab) : pathname === link.path)
              : pathname === '/customer' && currentTab === link.tab;

            return (
              <Link 
                key={link.path} 
                href={link.path}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all font-bold group ${
                  isActive 
                    ? 'bg-sage text-white shadow-md' 
                    : 'text-muted hover:bg-white hover:text-brown'
                }`}
              >
                <link.icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-muted group-hover:text-brown'}`} />
                <span className="text-xs md:text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-brown/10 bg-cream-highlight/50 space-y-2">
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-brown hover:bg-white font-bold transition-all group border border-transparent hover:border-brown/5"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:bg-sage/10 transition-colors shadow-sm">
              <Home className="w-4 h-4 text-brown" />
            </div>
            <span className="uppercase tracking-widest text-[9px]">Back Home</span>
          </Link>

          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors shadow-sm">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-bold uppercase tracking-widest text-[9px]">Logout</span>
          </button>
          <div className="pt-1 text-[7px] text-muted/30 font-bold uppercase tracking-[0.2em] pl-1 text-center">
            The Cozy Bakery © 2026
          </div>
        </div>
      </aside>
    </>
  );
}
