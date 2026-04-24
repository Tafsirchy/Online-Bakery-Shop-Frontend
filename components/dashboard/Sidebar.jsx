'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  User, 
  LayoutDashboard, 
  Package, 
  Users, 
  Ticket, 
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const commonLinks = [
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const customerLinks = [
    { name: 'My Orders', path: '/customer', icon: ShoppingBag },
  ];

  const adminLinks = [
    { name: 'Analytics', path: '/management', icon: BarChart3 },
    { name: 'Manage Products', path: '/admin/products', icon: Package },
    { name: 'Manage Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
  ];

  const links = user?.role === 'admin' ? [...adminLinks, ...commonLinks] : [...customerLinks, ...commonLinks];

  return (
    <aside className="w-64 h-full bg-cream-highlight border-r border-border-light flex flex-col p-6">
      <div className="mb-10 text-center">
        <h2 className="text-xl font-serif text-brown font-bold">Dashboard</h2>
        <p className="text-xs text-muted uppercase tracking-widest mt-1">{user?.role}</p>
      </div>

      <nav className="flex-grow space-y-2">
        {links.map((link) => (
          <Link 
            key={link.path} 
            href={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
              pathname === link.path 
                ? 'bg-sage text-white shadow-soft' 
                : 'text-muted hover:bg-surface-caramel/10 hover:text-brown'
            }`}
          >
            <link.icon className="w-5 h-5" />
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-border-light">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
