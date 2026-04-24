'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Github,
  Loader2,
  Sparkles,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { AuthForm } from '@/components/AuthForm';

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, signUp, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignUp = async (data: any) => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      await signUp(data.email, data.password, data.fullName);
      setSuccess('Account created! Please check your email to verify.');
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: "http://localhost:3000/dashboard"
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'GitHub authentication failed');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-indigo-600/20" />
        <div className="relative z-10 flex flex-col justify-center p-16 w-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-white font-black text-xl">R</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">RepoForge</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Join the future of <span className="text-primary">repository intelligence</span>.
          </h1>
          <p className="text-zinc-400 text-lg mb-12">
            Create an account to start auditing and automating your GitHub workflows today.
          </p>
          <div className="space-y-6">
            {[
              { icon: Sparkles, title: 'AI-Powered Insights' },
              { icon: Zap, title: 'Smart Automation' },
              { icon: ShieldCheck, title: 'Secure Integration' }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-white font-medium">{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-[420px] relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create an account</h2>
            <p className="text-muted-foreground">Start your 14-day free trial today</p>
          </div>

          <div className="rounded-3xl bg-card border border-border p-8 shadow-2xl shadow-black/5">
            <AuthForm 
              type="signup" 
              onSubmit={handleSignUp} 
              isSubmitting={isSubmitting} 
              error={error} 
              success={success}
            />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
