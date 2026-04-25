'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, User, LogOut, Menu } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, hasHydrated, checkAuth } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  useEffect(() => {
    if (hasHydrated) {
      checkAuth();
    }
  }, [hasHydrated, checkAuth]);

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin/products';
    if (role === 'manager') return '/management';
    return '/customer';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Our Story', path: '/story' },
  ];

  return (
    <nav className="sticky top-0 z-[1001] bg-background/80 backdrop-blur-md border-b border-border-light">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif text-brown font-bold tracking-tight">
          The Cozy <span className="text-caramel">Bakery</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center text-muted font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`hover:text-brown transition-colors ${pathname === link.path ? 'text-brown font-bold' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons / Auth */}
        <div className="flex items-center gap-4">
          <motion.div
            key={cartCount}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/cart" className="relative p-2 text-brown hover:bg-cream-highlight rounded-xl transition-colors">
              <ShoppingBasket className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-caramel text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background">
                  {cartCount}
                </span>
              )}
            </Link>
          </motion.div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 hover:bg-cream-highlight rounded-xl transition-colors outline-none cursor-pointer">
                <User className="w-6 h-6 text-brown" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-cream-highlight border-border-light rounded-xl shadow-soft">
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <Link href={getDashboardPath(user.role)} className="w-full">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <Link href="/profile" className="w-full">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={logout}
                  className="p-3 cursor-pointer text-red-500 focus:text-red-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="bg-sage hover:bg-brown-hover text-white rounded-xl px-6">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <Button variant="ghost" className="md:hidden p-2">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
