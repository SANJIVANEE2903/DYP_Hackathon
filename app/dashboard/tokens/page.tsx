'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  Github, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  Info,
  ArrowRight,
  Loader2,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabaseClient';
import api from '@/lib/api';

export default function GitHubTokenPage() {
  const { user, loading } = useAuth();
  const [ghToken, setGhToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleGitHubConnect = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard/tokens`
      }
    });
    if (error) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await api.post('/tokens/github', { token: ghToken });
      
      toast({
        title: "GitHub Token Configured",
        description: "Your personal access token has been saved successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Failed to Save Token",
        description: err.response?.data?.error || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isConnected = user?.github_connected || user?.app_metadata?.provider === 'github';

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 rounded-[2rem] bg-zinc-950 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/20 border border-white/5"
        >
          <Github className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-4xl font-black mb-6 tracking-tighter">Connect GitHub to Start</h1>
        <p className="text-muted-foreground text-xl mb-12 max-w-xl mx-auto leading-relaxed">
          To generate secure audit tokens and automate your repository fixes, we need to verify your GitHub identity.
        </p>
        <Button onClick={handleGitHubConnect} size="lg" className="h-16 px-12 rounded-[1.5rem] font-bold text-xl shadow-2xl shadow-primary/20 flex gap-4 hover:scale-105 transition-transform">
          <Github className="w-7 h-7" />
          Continue with GitHub
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-3">GitHub Configuration</h1>
          <p className="text-muted-foreground text-lg">Securely connect your GitHub Personal Access Token to enable automated auditing.</p>
        </div>
        <div className="w-16 h-16 rounded-3xl bg-zinc-950 flex items-center justify-center border border-white/10 shadow-xl">
          <Lock className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: FORM */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-none bg-card shadow-2xl shadow-black/5 overflow-hidden">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-2xl font-bold">Configure Token</CardTitle>
              <CardDescription>Paste your GitHub Personal Access Token (Classic) below.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-4 space-y-8">
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">
                  RepoForge uses this token to perform read-only audits and authorized fixes on your behalf. We never store your main GitHub password.
                </p>
              </div>

              <form onSubmit={handleSaveToken} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="gh-token" className="text-sm font-black uppercase tracking-widest text-muted-foreground">Personal Access Token</Label>
                  <div className="relative">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="gh-token" 
                      type="password" 
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                      className="h-16 rounded-2xl border-border bg-muted/30 focus:ring-primary pl-14 pr-6 text-lg font-mono"
                      value={ghToken}
                      onChange={(e) => setGhToken(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-16 rounded-[1.5rem] text-lg font-bold shadow-2xl shadow-primary/20 group"
                  disabled={isSaving || !ghToken}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      Verifying Token...
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      Authorize & Save Token
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex items-start gap-5 p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10">
            <ShieldAlert className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg text-amber-600 mb-2">Security Warning</h4>
              <p className="text-sm text-amber-700/80 leading-relaxed font-medium">
                Ensure your token has the correct permissions. Without <code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-900">repo</code>, <code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-900">admin:repo_hook</code>, and <code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-900">workflow</code> scopes, some features may be disabled.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: GUIDE */}
        <div className="space-y-6">
          <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
            <Info className="w-6 h-6 text-primary" />
            Generation Guide
          </h3>
          
          <div className="space-y-4">
            {[
              { step: '01', title: 'Login', desc: 'Sign in to your GitHub account.' },
              { step: '02', title: 'Settings', desc: 'Go to Developer Settings in your profile.' },
              { step: '03', title: 'New Token', desc: 'Select Personal Access Tokens (Classic).' },
              { step: '04', title: 'Scopes', desc: 'Select repo, workflow, and repo_hook.' },
              { step: '05', title: 'Generate', desc: 'Click generate and copy the ghp_ string.' },
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all group">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-2xl font-black text-primary/20 group-hover:text-primary transition-colors">{s.step}</span>
                  <span className="font-bold text-sm tracking-tight">{s.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <Button variant="outline" asChild className="w-full h-14 rounded-2xl border-primary/20 text-primary font-bold gap-2">
            <Link href="https://github.com/settings/tokens" target="_blank">
              Go to GitHub Settings
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
