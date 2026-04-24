'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  Plus, 
  Search,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface Preset {
  id: string;
  name: string;
  description: string;
  tags: string[];
  active?: boolean;
}

export default function PresetsPage() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const defaultPresets = useMemo<Preset[]>(() => [
    {
      id: '1',
      name: 'Production Ready Node.js',
      description: 'Security headers, CI/CD with GitHub Actions, and branch protection.',
      tags: ['Security', 'CI/CD'],
      active: true
    },
    {
      id: '2',
      name: 'Open Source Starter',
      description: 'LICENSE, README template, CONTRIBUTING guide, and issue templates.',
      tags: ['Docs', 'OSS'],
      active: false
    },
    {
      id: '3',
      name: 'Strict Security Audit',
      description: 'Advanced dependency scanning, secret detection, and lockfile validation.',
      tags: ['Security'],
      active: false
    }
  ], []);

  const fetchPresets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/presets');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setPresets(res.data);
      } else {
        setPresets(defaultPresets);
      }
    } catch (err) {
      console.error('Failed to fetch presets:', err);
      setPresets(defaultPresets);
      // Only show error toast if it's not a simple 401 (which is handled by global auth)
      toast({
        title: "Database Sync",
        description: "Could not fetch custom presets. Showing industry standards.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, defaultPresets]);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration Presets</h1>
          <p className="text-muted-foreground font-medium">Standardized configurations to apply across your repositories.</p>
        </div>
        <Button className="rounded-full h-11 px-6 shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 mr-2" />
          Create Custom Preset
        </Button>
      </motion.div>

      <Card className="rounded-[2rem] border-none bg-card shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-6 border-b border-border/50 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search presets..." 
              className="pl-10 h-11 rounded-full border-transparent bg-background shadow-inner focus:ring-2 ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
              <p className="text-muted-foreground text-sm font-medium">Syncing with Supabase...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {presets.map((preset, i) => (
                <motion.div
                  key={preset.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-[2rem] border border-border/50 bg-background hover:shadow-2xl hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
                >
                  {preset.active && (
                    <div className="absolute top-0 right-0 p-6">
                      <Badge className="bg-emerald-500 text-white border-none rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-wider">Active</Badge>
                    </div>
                  )}
                  
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                    <Layers className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{preset.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-2">{preset.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {preset.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="rounded-full text-[10px] font-black px-4 py-1 bg-muted/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 pt-8 border-t border-border/50">
                    <Button className="rounded-full h-11 px-8 flex-1 font-bold">
                      Apply Preset
                    </Button>
                    <Button variant="outline" className="rounded-full h-11 px-8 flex-1 font-bold">
                      Details
                    </Button>
                  </div>
                </motion.div>
              ))}

              {/* AI Suggestion Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-8 rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center text-center group hover:bg-primary/10 transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-3">AI-Generated Preset</h3>
                <p className="text-muted-foreground max-w-[280px] mb-8 font-medium">
                  Let RepoForge analyze your org and suggest a custom preset for your team.
                </p>
                <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white h-11 px-10 font-bold transition-all shadow-lg shadow-primary/5">
                  Run AI Analysis
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
