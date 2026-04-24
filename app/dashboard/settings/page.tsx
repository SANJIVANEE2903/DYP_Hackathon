'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Moon, 
  Sun, 
  Github, 
  Shield, 
  Key, 
  Bell, 
  User,
  Check,
  ExternalLink,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [ghToken, setGhToken] = useState('');
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSaveToken = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your GitHub configuration has been updated.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and integrations.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Appearance Section */}
        <Card className="rounded-3xl border-none bg-card shadow-lg shadow-black/5 overflow-hidden">
          <CardHeader className="bg-muted/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sun className="w-5 h-5 text-primary dark:hidden" />
                <Moon className="w-5 h-5 text-primary hidden dark:block" />
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how RepoForge looks on your screen.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
              />
            </div>
          </CardContent>
        </Card>

        {/* GitHub Integration */}
        <Card className="rounded-3xl border-none bg-card shadow-lg shadow-black/5 overflow-hidden">
          <CardHeader className="bg-muted/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>GitHub Configuration</CardTitle>
                <CardDescription>Securely connect your GitHub account for deeper auditing.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700/80 leading-relaxed">
                Personal Access Tokens (Classic) require <code>repo</code>, <code>admin:repo_hook</code>, and <code>workflow</code> scopes to enable automated fixes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gh-token">Personal Access Token</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="gh-token" 
                    type="password" 
                    placeholder="ghp_xxxxxxxxxxxx" 
                    value={ghToken}
                    onChange={(e) => setGhToken(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-border focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link href="https://github.com/settings/tokens" target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                  Generate new token
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Button 
                  onClick={handleSaveToken} 
                  disabled={saving || !ghToken}
                  className="rounded-full px-8 h-10"
                >
                  {saving ? 'Saving...' : 'Update Token'}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">OAuth Connected</p>
                  <p className="text-xs text-muted-foreground">Logged in as {user?.login}</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-full text-xs h-8">Disconnect</Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Section */}
        <Card className="rounded-3xl border-none bg-card shadow-lg shadow-black/5 overflow-hidden">
          <CardHeader className="bg-muted/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Manage your profile and subscription plan.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={user?.name || ''} readOnly className="rounded-xl h-12 bg-muted/30 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={user?.email || ''} readOnly className="rounded-xl h-12 bg-muted/30 cursor-not-allowed" />
              </div>
            </div>
            
            <div className="p-6 rounded-3xl bg-secondary/50 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-lg">Pro Plan</p>
                  <p className="text-sm text-muted-foreground">Next billing date: May 23, 2026</p>
                </div>
                <Badge className="bg-primary text-primary-foreground">Active</Badge>
              </div>
              <Button variant="outline" className="w-full rounded-xl bg-background hover:bg-muted">Manage Subscription</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
