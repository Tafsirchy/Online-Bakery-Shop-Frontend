'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';


export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {!isAuthRoute && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAuthRoute && <Footer />}
      
      <ToastContainer 
        position="top-right" 
        autoClose={4000} 
        theme="light"
      />
    </GoogleOAuthProvider>
  );

}

