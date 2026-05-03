'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from '@/lib/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/auth/forgotpassword', { email });
      toast.success('Reset link sent! Check your email.', { icon: '📧' });
      setIsSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#f8efe5] text-brown font-sans flex flex-col justify-center items-center p-4 py-16 sm:py-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_28%,rgba(212,163,115,0.2),transparent_34%),radial-gradient(circle_at_90%_76%,rgba(138,154,91,0.16),transparent_36%)]" />

      <Link
        href="/login"
        className="absolute top-4 left-4 z-50 flex items-center gap-2 rounded-full border border-brown/10 bg-white/40 px-4 py-1.5 text-xs font-medium text-brown backdrop-blur-md transition-all hover:bg-white/60 group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        Back to Login
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[400px] bg-white rounded-3xl p-8 shadow-xl border border-brown/10 text-center space-y-6"
      >
        <div className="mx-auto w-16 h-16 bg-caramel/10 rounded-2xl flex items-center justify-center">
          <KeyRound className="h-8 w-8 text-caramel" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-serif text-brown">Forgot Password?</h1>
          <p className="text-sm text-brown/60">No worries! Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <Label htmlFor="email" className="text-xs text-brown/80 ml-2">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brown/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-full border-caramel/45 bg-white/50 pl-11 pr-4 text-sm focus-visible:ring-caramel/55"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-caramel text-white hover:bg-[#c78f61] transition-all font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <div className="py-4 space-y-4">
            <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-sm">
              We've sent a password reset link to <span className="font-bold">{email}</span>. Please check your inbox.
            </div>
            <Button
              variant="outline"
              onClick={() => setIsSent(false)}
              className="w-full rounded-full border-caramel/30 text-caramel hover:bg-caramel/5"
            >
              Try another email
            </Button>
          </div>
        )}

        <p className="text-xs text-brown/50 ">
          Remember your password? <Link href="/login" className="text-caramel font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
