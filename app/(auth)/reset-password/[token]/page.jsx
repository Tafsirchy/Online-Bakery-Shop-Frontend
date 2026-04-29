'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from '@/lib/axios';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setIsLoading(true);
    try {
      await axios.put(`/auth/resetpassword/${token}`, { password: formData.password });
      toast.success('Password reset successfully! Please login.', { icon: '🔐' });
      router.push('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[#f8efe5] text-brown font-sans flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_28%,rgba(212,163,115,0.2),transparent_34%),radial-gradient(circle_at_90%_76%,rgba(138,154,91,0.16),transparent_36%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[400px] bg-white rounded-3xl p-8 shadow-xl border border-brown/10 space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-brown">Reset Password</h1>
          <p className="text-sm text-brown/60">Create a new secure password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brown/40" />
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-12 rounded-full border-caramel/45 bg-white/50 pl-11 pr-4"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brown/40" />
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-12 rounded-full border-caramel/45 bg-white/50 pl-11 pr-4"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-caramel text-white hover:bg-[#c78f61] transition-all font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Update Password'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
