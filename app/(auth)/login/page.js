'use client';

import { useState } from 'react';
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

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await axios.post('/auth/google', { 
          accessToken: tokenResponse.access_token 
        });
        
        useAuthStore.getState().setAuth(data.user, data.token);
        toast.success('Welcome! Logged in with Google.', { icon: '👋' });
        router.push('/');
      } catch (err) {
        toast.error('Google Login failed');
      }
    },
    onError: () => toast.error('Google Login Failed'),
  });



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError('');
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
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

  return (
    <div className="relative h-screen overflow-hidden bg-[#f8efe5] text-brown font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_28%,rgba(212,163,115,0.2),transparent_34%),radial-gradient(circle_at_90%_76%,rgba(138,154,91,0.16),transparent_36%)]" />

      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-4 left-4 z-50 flex items-center gap-2 rounded-full border border-brown/10 bg-white/40 px-4 py-1.5 text-xs font-medium text-brown backdrop-blur-md transition-all hover:bg-white/60 group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        Back
      </Link>

      <div className="relative mx-auto flex h-full max-w-[1000px] w-full items-center justify-center p-2 sm:p-4">
        <main className="relative grid h-[520px] w-full overflow-hidden rounded-3xl border border-brown/10 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
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
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10 rounded-full border-caramel/45 bg-white/50 px-4 text-sm focus-visible:ring-caramel/55"
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
                      value={formData.password}
                      onChange={handleChange}
                      className="h-10 rounded-full border-caramel/45 bg-white/50 pl-4 pr-10 text-sm focus-visible:ring-caramel/55"
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

                <div className="flex items-center justify-between text-[11px] text-brown/70">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-3 w-3 rounded border-caramel/50" />
                    Remember me
                  </label>
                  <Link href="/forgot-password" size="sm" className="hover:text-caramel underline-offset-2 hover:underline">Forgot password?</Link>
                </div>

                <Button

                  type="submit"
                  className="h-10 w-full rounded-full bg-caramel text-white hover:bg-[#c78f61] transition-all text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-brown/10" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-brown/40 bg-white px-2">
                    Or continue with
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full rounded-full border-brown/10 bg-white hover:bg-brown/5 transition-all text-sm flex items-center justify-center gap-2"
                  onClick={() => handleGoogleLogin()}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-4 w-4" />
                  Sign in with Google
                </Button>


                <div className="text-center text-[11px] text-brown/70 pt-2">
                  Don't have an account? <Link href="/register" className="font-bold text-caramel hover:underline">Create account</Link>
                </div>
              </form>

            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
