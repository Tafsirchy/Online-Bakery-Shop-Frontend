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
        <Link href="/" className="text-xl font-serif text-brown font-bold tracking-tight block mb-8 px-2">
          The Cozy <span className="text-caramel">Bakery</span>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 bg-sage rounded-full" />
          <h2 className="text-3xl font-serif text-brown font-bold tracking-tight">Dashboard</h2>
        </div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-5 opacity-60">
          {user?.role || 'Customer'} Portal
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive = user?.role === 'admin' 
            ? pathname === link.path 
            : pathname === '/customer' && currentTab === link.tab;

          return (
            <Link 
              key={link.path} 
              href={link.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${
                isActive 
                  ? 'bg-sage text-white shadow-lg' 
                  : 'text-muted hover:bg-white hover:text-brown'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 mt-auto border-t border-border-light/50 bg-cream-highlight/50 space-y-4">
        <Link 
          href="/"
          className="flex items-center gap-4 px-6 py-4 rounded-2xl text-brown hover:bg-white font-bold transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-sage/10 transition-colors">
            <Home className="w-5 h-5 text-brown" />
          </div>
          <span className="uppercase tracking-widest text-xs">Back to Home</span>
        </Link>

        <button 
          onClick={logout}
          className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 hover:shadow-sm transition-all w-full text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-bold uppercase tracking-widest text-xs">Logout</span>
        </button>
        <div className="mt-6 text-[9px] text-muted/30 font-bold uppercase tracking-[0.2em] pl-2">
          The Cozy Bakery © 2026
        </div>
      </div>
    </aside>
  );
}
