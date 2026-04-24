'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, CheckCircle2, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="text-white font-black text-xl">R</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">RepoForge</span>
        </div>

        <Card className="rounded-[2.5rem] border-white/5 bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="p-10 pb-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">New Password</CardTitle>
            <CardDescription className="text-zinc-400">Secure your account with a new strong password.</CardDescription>
          </CardHeader>
          
          <CardContent className="p-10 pt-4">
            {success ? (
              <div className="text-center space-y-8 py-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Password Updated!</h3>
                  <p className="text-zinc-400">Your password has been changed successfully. You can now log in with your new credentials.</p>
                </div>
                <Button asChild className="w-full h-14 rounded-2xl text-lg font-bold">
                  <Link href="/login">Go to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">New Password</label>
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:border-primary/50 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:border-primary/50 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3">
                    <Zap className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Update Password'}
                </Button>

                <Button variant="ghost" asChild className="w-full h-12 rounded-2xl text-zinc-400 hover:text-white">
                  <Link href="/login" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure Handshake</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
