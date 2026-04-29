'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';


export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname.startsWith('/reset-password');
  const isDashboardRoute = pathname.startsWith('/customer') || 
                           pathname.startsWith('/admin') || 
                           pathname.startsWith('/management');
  const hideChrome = isAuthRoute || isDashboardRoute; // Hide navbar/footer on these routes

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {!hideChrome && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideChrome && <Footer />}
      
      <ToastContainer 
        position="top-right" 
        autoClose={4000} 
        theme="light"
      />
    </GoogleOAuthProvider>
  );

}

