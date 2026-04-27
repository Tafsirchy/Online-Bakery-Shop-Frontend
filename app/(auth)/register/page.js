'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import axios from '@/lib/axios';

function RegisterPageContent() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const searchParams = useSearchParams();

  // Build a stable redirect URI from env var
  const redirectUri = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/register`
    : typeof window !== 'undefined'
    ? `${window.location.origin}/register`
    : 'http://localhost:3000/register';

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: redirectUri,
  });

  // Handle the code from the redirect
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      const exchangeCode = async () => {
        try {
          const { data } = await axios.post('/auth/google', { code });
          useAuthStore.getState().setAuth(data.user, data.token);
          toast.success('Account created! Welcome to the family.', { icon: '🥖' });
          router.push('/');
        } catch (err) {
          console.error('Google Exchange Error:', err);
          const msg = err.response?.data?.message || 'Google registration failed';
          toast.error(msg);
        }
      };
      exchangeCode();
    }
  }, [searchParams, router]);




  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

    setPasswordStrength({
      score,
      label: labels[score],
      color: colors[score]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }

    if (formError) setFormError('');
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      const msg = 'Password must be at least 6 characters long';
      setFormError(msg);
      toast.warning(msg);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match';
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (passwordStrength.score < 2) {
      const msg = 'Please use a stronger password (include numbers or symbols)';
      setFormError(msg);
      toast.warning(msg);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      await register(payload);
      toast.success('Account created! Welcome to the family.', {
        icon: '🥖',
      });
      router.push('/');
    } catch (err) {
      let msg = err.response?.data?.message || err.message || 'Registration failed';
      if (msg.includes('ECONNREFUSED') || msg.includes('querySrv')) {
        msg = 'Database Connection Failed. Please check your MongoDB connection.';
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
        <main className="relative grid h-[520px] w-full overflow-hidden rounded-3xl border border-brown/10 bg-white shadow-xl lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left Side: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex h-full items-center justify-center px-6 py-4 sm:px-10"
          >
            <div className="w-full max-w-[340px] space-y-3">
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-serif text-brown sm:text-3xl">Join Us</h1>
                <p className="text-[11px] text-muted tracking-tight">Create an account to start your cozy journey.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2">
                {(formError || error) && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-[10px] text-red-600">
                    {formError || error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-[10px] text-brown/80 uppercase tracking-wider">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="h-9 rounded-xl border-caramel/45 bg-white/50 px-3 text-xs focus-visible:ring-caramel/55"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-[10px] text-brown/80 uppercase tracking-wider">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@email.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="h-9 rounded-xl border-caramel/45 bg-white/50 px-3 text-xs focus-visible:ring-caramel/55"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[10px] text-brown/80 uppercase tracking-wider">Password</Label>
                    {formData.password && (
                      <span className={`text-[9px] font-bold px-1.5 rounded-full text-white ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="h-9 rounded-xl border-caramel/45 bg-white/50 pl-3 pr-9 text-xs focus-visible:ring-caramel/55"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {/* Strength Bar */}
                  {formData.password && (
                    <div className="flex gap-1 h-1 mt-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div 
                          key={step} 
                          className={`flex-1 rounded-full transition-all duration-500 ${
                            step <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="confirmPassword" className="text-[10px] text-brown/80 uppercase tracking-wider">Confirm Password</Label>
                    {formData.confirmPassword && (
                      <span className={`text-[9px] font-bold ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                        {formData.password === formData.confirmPassword ? 'Match' : 'Mismatch'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`h-9 rounded-xl border-caramel/45 bg-white/50 pl-3 pr-9 text-xs focus-visible:ring-caramel/55 ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 bg-red-50/30' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown/70 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>



                <Button
                  type="submit"
                  className="mt-2 h-10 w-full rounded-full bg-caramel text-white hover:bg-[#c78f61] transition-all text-xs font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Register'}
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-brown/10" />
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase tracking-widest text-brown/40 bg-white px-2">
                    Or sign up with
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full rounded-full border-brown/10 bg-white hover:bg-brown/5 transition-all text-xs flex items-center justify-center gap-2"
                  onClick={() => handleGoogleLogin()}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-4 w-4" />
                  Sign up with Google
                </Button>


                <p className="text-center text-[11px] text-brown/70 pt-1">
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold text-caramel hover:underline">
                    Sign in
                  </Link>
                </p>

              </form>
            </div>
          </motion.div>

          {/* Right Side: Visuals */}
          <div className="relative hidden h-full overflow-hidden lg:block bg-[#fdfaf7]">
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full w-full"
            >
              <img
                src="https://images.unsplash.com/photo-1587241321921-91a834d6d191?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Bakery Interior"
                className="h-full w-full object-cover brightness-[0.95]"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-l from-brown/30 to-transparent opacity-40" />
            <div className="absolute bottom-6 right-6 max-w-[200px] text-right text-white drop-shadow-md">
              <p className="font-serif text-lg leading-tight italic">Freshly baked dreams.</p>
              <div className="mt-2 h-0.5 w-12 bg-white/80 ml-auto" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading registration...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
