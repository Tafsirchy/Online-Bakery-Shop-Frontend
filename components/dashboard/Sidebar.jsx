'use client';

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
  Ticket
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'orders';
  const { user, logout } = useAuthStore();

  const adminLinks = [
    { name: 'Analytics', path: '/management', icon: BarChart3 },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
  ];

  const customerLinks = [
    { name: 'My Orders', path: '/customer?tab=orders', icon: ShoppingBag, tab: 'orders' },
    { name: 'Profile', path: '/customer?tab=profile', icon: User, tab: 'profile' },
  ];

  const links = user?.role === 'admin' ? adminLinks : customerLinks;

  return (
    <aside className="w-72 bg-cream-highlight border-r border-border-light flex flex-col shrink-0 h-full">
      <div className="p-8 pb-4">
        <Link href="/" className="text-3xl font-serif text-brown font-bold tracking-tight block mb-6 px-1 transition-transform hover:scale-105 origin-left">
          The Cozy <span className="text-caramel">Bakery</span>
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1.5 h-6 bg-sage rounded-full" />
          <h2 className="text-xl font-bold text-brown tracking-tight">Dashboard</h2>
        </div>
        <p className="text-[9px] font-bold text-muted uppercase tracking-[0.3em] ml-4.5 opacity-50">
          {user?.role || 'Customer'} Portal
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const isActive = user?.role === 'admin' 
            ? pathname === link.path 
            : pathname === '/customer' && currentTab === link.tab;

          return (
            <Link 
              key={link.path} 
              href={link.path}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-bold group ${
                isActive 
                  ? 'bg-sage text-white shadow-lg' 
                  : 'text-muted hover:bg-white hover:text-brown'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted group-hover:text-brown'}`} />
              <span className="text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-border-light/50 bg-cream-highlight/50 space-y-3">
        <Link 
          href="/"
          className="flex items-center gap-4 px-5 py-3 rounded-2xl text-brown hover:bg-white font-bold transition-all group border border-transparent hover:border-border-light/50"
        >
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center group-hover:bg-sage/10 transition-colors shadow-sm">
            <Home className="w-4.5 h-4.5 text-brown" />
          </div>
          <span className="uppercase tracking-widest text-[10px]">Back to Home</span>
        </Link>

        <button 
          onClick={logout}
          className="flex items-center gap-4 px-5 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all w-full text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors shadow-sm">
            <LogOut className="w-4.5 h-4.5" />
          </div>
          <span className="font-bold uppercase tracking-widest text-[10px]">Logout</span>
        </button>
        <div className="pt-2 text-[8px] text-muted/30 font-bold uppercase tracking-[0.2em] pl-1">
          The Cozy Bakery © 2026
        </div>
      </div>
    </aside>
  );
}
