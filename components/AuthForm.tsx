'use client';

import React, { useState } from 'react';
import { Mail, Lock, Loader2, Eye, EyeOff, User as UserIcon, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  error?: string;
  success?: string;
}

export function AuthForm({ type, onSubmit, isSubmitting, error, success }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = type === 'signup' 
      ? { email, password, fullName, confirmPassword }
      : { email, password };
    onSubmit(data);
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'signup' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
          <div className="relative group">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
              required
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
        <div className="relative group">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Password</label>
        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 pl-11 pr-11 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {type === 'signup' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Confirm Password</label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
              required
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs text-center font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs text-center font-medium">
          {success}
        </div>
      )}

      <div className="flex items-center justify-between px-1">
        {type === 'login' && (
          <button type="button" className="text-xs font-bold text-primary hover:underline transition-all">
            Forgot Password?
          </button>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl text-sm font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : type === 'login' ? 'Sign In' : 'Create Account'}
      </Button>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-bold">Or continue with</span>
        </div>
      </div>

      <Button 
        type="button" 
        variant="outline" 
        onClick={handleGithubLogin}
        className="w-full h-12 rounded-xl text-sm font-bold border-border hover:bg-secondary/80 transition-all flex items-center justify-center gap-3"
      >
        <Github className="w-5 h-5" />
        Continue with GitHub
      </Button>
    </form>
  );
}
