'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, User, LogOut, Menu, Heart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, hasHydrated, checkAuth } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const { wishlist, fetchWishlist, clearWishlist } = useWishlistStore();
  const cartCount = getTotalItems();
  const [isMounted, setIsMounted] = useState(false);
  const safeCartCount = isMounted ? cartCount : 0;

  useEffect(() => {
    if (hasHydrated) {
      checkAuth();
      fetchWishlist();
    }
  }, [hasHydrated, checkAuth, fetchWishlist]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin/products';
    if (role === 'manager') return '/management';
    return '/customer';
  };
  const handleLogout = () => {
    logout();
    clearWishlist();
    toast.info('Logged out. See you soon!', { icon: '👋' });
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
        {!pathname.startsWith('/customer') && !pathname.startsWith('/admin') && !pathname.startsWith('/management') && (
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
        )}

        {/* Icons / Auth */}
        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="relative w-10 h-10 flex items-center justify-center text-brown hover:text-caramel transition-all duration-300 group active:scale-95">
            <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {isMounted && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-caramel text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background animate-in fade-in zoom-in duration-300">
                {wishlist.length}
              </span>
            )}
          </Link>

          <motion.div
            key={safeCartCount}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/cart" className="relative w-10 h-10 flex items-center justify-center text-brown hover:text-caramel transition-all duration-300 group active:scale-95">
              <ShoppingBasket className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {safeCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-caramel text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background animate-in fade-in zoom-in duration-300">
                  {safeCartCount}
                </span>
              )}
            </Link>
          </motion.div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                aria-label="Open account menu"
                className="p-2 hover:bg-cream-highlight rounded-xl transition-colors outline-none cursor-pointer"
              >
                <User className="w-6 h-6 text-brown" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                sideOffset={12}
                className="w-64 rounded-[1.5rem] border border-border-light bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-[1002]"
              >
                <div className="px-4 py-3 border-b border-border-light/50 mb-1">
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-brown truncate">{user.email}</p>
                </div>
                <DropdownMenuItem
                  onClick={() => router.push(getDashboardPath(user.role))}
                  className="cursor-pointer rounded-xl py-3 px-4 flex items-center gap-3 text-brown hover:bg-cream-highlight transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center">
                    <Menu className="w-4 h-4 text-sage" />
                  </div>
                  <span className="font-medium">Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-xl py-3 px-4 flex items-center gap-3 text-red-500 focus:text-red-600 focus:bg-red-50 transition-colors mt-1"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="font-bold uppercase tracking-widest text-[10px]">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="bg-brown hover:bg-caramel text-white rounded-full px-8 h-11 font-bold shadow-soft transition-all active:scale-95 border-none">
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
