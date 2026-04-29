'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';

import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import axios from '@/lib/axios';

function LoginPageContent() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Build a stable redirect URI from env var (baked at build time, same on server & client)
  // Fallback to window.location.origin only as a last resort on the client.
  const redirectUri = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/login`
    : typeof window !== 'undefined'
    ? `${window.location.origin}/login`
    : 'http://localhost:3000/login';

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: redirectUri,
  });

  const exchangeInProgress = useRef(false);

  // Handle the code from the redirect
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !exchangeInProgress.current) {
      exchangeInProgress.current = true;
      const exchangeCode = async () => {
        try {
          const { data } = await axios.post('/auth/google', { 
            code,
            redirectUri: redirectUri 
          });
          useAuthStore.setState({ 
            user: data.user, 
            token: data.token,
            isLoading: false 
          });
          toast.success('Welcome! Logged in with Google.', { icon: '👋' });
          router.push('/');
        } catch (err) {
          console.error('Google Exchange Error:', err);
          const msg = err.response?.data?.message || 'Google Login failed during exchange';
          toast.error(msg);
          exchangeInProgress.current = false;
        }
      };
      exchangeCode();
    }
  }, [searchParams, router]);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError('');
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const emailTrim = formData.email.trim().toLowerCase();

      if (!emailTrim || !formData.password) {
        const msg = 'Please provide an email and password';
        setFormError(msg);
        toast.error(msg);
        return;
      }

      const payload = {
        email: emailTrim,
        password: formData.password,
      };

      await login(payload);
      toast.success('Welcome back! Logged in successfully.', {
        icon: '🍞',
      });
      const redirectTo = searchParams.get('redirect');

      if (redirectTo) {
        router.push(`/${redirectTo.replace(/^\/+/, '')}`);
        return;
      }

      router.push('/');
    } catch (err) {
      let msg = err.response?.data?.message || err.message || 'Login failed';
      if (msg.includes('ECONNREFUSED') || msg.includes('querySrv')) {
        msg = 'Database Connection Failed. Please Add your current IP to MongoDB Atlas Network Access.';
      }
      setFormError(msg);
      toast.error(msg);
    }
  };

  // Prevent form flash during Google Redirect exchange
  if (searchParams.get('code') || (typeof exchangeInProgress !== 'undefined' && exchangeInProgress.current)) {
    return (
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#f8efe5]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-caramel border-t-transparent" />
          <p className="text-sm font-medium text-brown animate-pulse">Authenticating with Google...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#f8efe5] text-brown font-sans flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_28%,rgba(212,163,115,0.2),transparent_34%),radial-gradient(circle_at_90%_76%,rgba(138,154,91,0.16),transparent_36%)]" />

      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-4 left-4 z-50 flex items-center gap-2 rounded-full border border-brown/10 bg-white/40 px-4 py-1.5 text-xs font-medium text-brown backdrop-blur-md transition-all hover:bg-white/60 group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        Back
      </Link>

      <div className="relative mx-auto flex flex-1 max-w-[1000px] w-full items-center justify-center p-4 sm:p-6 lg:p-4 py-20 lg:py-4">
        <main className="relative grid min-h-[520px] h-auto w-full overflow-hidden rounded-3xl border border-brown/10 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Side: Visuals */}
          <div className="relative hidden h-full overflow-hidden lg:block bg-[#fdfaf7]">
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full w-full"
            >
              <img
                src="https://images.unsplash.com/photo-1534432182912-63863115e106?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Freshly baked bread"
                className="h-full w-full object-cover brightness-[0.98] contrast-[1.02]"
              />
            </motion.div>
            
            {/* Artistic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brown/30 to-transparent opacity-40" />
            <div className="absolute bottom-6 left-6 max-w-[180px] text-white drop-shadow-md">
              <p className="font-serif text-lg leading-tight italic">Handcrafted with love.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex h-full items-center justify-center px-6 py-4 sm:px-10"
          >
            <div className="w-full max-w-[320px] space-y-4">
              <h1 className="text-center text-3xl font-serif text-brown">Sign In</h1>

              <form onSubmit={handleSubmit} className="space-y-3">
                {(formError || error) && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-600">
                    {formError || error}
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs text-brown/80">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    autoComplete="username"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 sm:h-11 rounded-full border-caramel/45 bg-white/50 px-5 text-base sm:text-sm focus-visible:ring-caramel/55"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs text-brown/80">Password</Label>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.08em] text-muted">
                      <ShieldCheck className="h-3 w-3 text-sage" />
                      secure
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 sm:h-11 rounded-full border-caramel/45 bg-white/50 pl-5 pr-12 text-base sm:text-sm focus-visible:ring-caramel/55"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                </div>

                <div className="flex items-center justify-between text-sm sm:text-xs text-brown/70 py-1">
                  <label className="inline-flex items-center gap-3 cursor-pointer py-1">
                    <input type="checkbox" className="h-5 w-5 sm:h-4 sm:w-4 rounded border-caramel/50" />
                    Remember me
                  </label>
                  <Link href="/forgot-password" size="sm" className="hover:text-caramel underline-offset-2 hover:underline py-1">Forgot password?</Link>
                </div>

                <Button

                  type="submit"
                  className="min-h-[48px] sm:min-h-[44px] w-full rounded-full bg-caramel text-white hover:bg-[#c78f61] transition-all text-base sm:text-sm font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="relative py-4 sm:py-3">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-brown/10" />
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-[10px] uppercase tracking-widest text-brown/40 bg-white px-3">
                    Or continue with
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="min-h-[48px] sm:min-h-[44px] w-full rounded-full border-brown/10 bg-white hover:bg-brown/5 transition-all text-base sm:text-sm flex items-center justify-center gap-3 font-medium"
                  onClick={() => handleGoogleLogin()}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5 sm:h-4 sm:w-4" />
                  Sign in with Google
                </Button>


                <div className="text-center text-sm sm:text-xs text-brown/70 pt-3 sm:pt-2">
                  Don't have an account? <Link href="/register" className="font-bold text-caramel hover:underline py-2 inline-block">Create account</Link>
                </div>
              </form>

            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-[100dvh] overflow-hidden bg-[#f8efe5] text-brown font-sans flex flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_28%,rgba(212,163,115,0.2),transparent_34%),radial-gradient(circle_at_90%_76%,rgba(138,154,91,0.16),transparent_36%)]" />
          <div className="relative mx-auto flex flex-1 max-w-[1000px] w-full items-center justify-center p-4 sm:p-6 lg:p-4 text-sm text-brown/70">
            Loading login page...
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
