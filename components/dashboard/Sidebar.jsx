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
      <div className="p-8 pb-12">
        <h2 className="text-3xl font-serif text-brown font-bold tracking-tight">Dashboard</h2>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] mt-1 ml-1">{user?.role}</p>
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

        <div className="pt-8 mt-8 border-t border-border-light/50">
          <Link 
            href="/"
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-muted hover:text-brown hover:bg-white font-bold transition-all"
          >
            <Home className="w-5 h-5" />
            Store
          </Link>
        </div>
      </nav>

      <div className="p-8 space-y-4">
        <button 
          onClick={logout}
          className="flex items-center gap-4 px-6 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full text-left text-xs font-bold uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
        <div className="text-[10px] text-muted/30 font-bold uppercase tracking-widest pl-6">
          The Cozy Bakery © 2026
        </div>
      </div>
    </aside>
  );
}
