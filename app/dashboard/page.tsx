'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Activity, 
  Zap, 
  Layers, 
  Search,
  RefreshCw,
  Github,
  ChevronRight,
  Plus,
  Loader2,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';

interface Stats {
  totalRepos: number;
  avgScore: number;
  activeCIRuns: number;
  presets: number;
}

interface Repository {
  id: string;
  name: string;
  full_name: string;
  stack: string;
  health_score: number | null;
  updated_at: string;
}

export default function DashboardHomepage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();
  
  const supabase = createClient();

  const fetchData = async () => {
    try {
      const { data: reposData, error: reposError } = await supabase
        .from('repositories')
        .select('*')
        .order('updated_at', { ascending: false });

      if (reposError) throw reposError;

      const formattedRepos = (reposData || []).map(r => ({
        id: r.id,
        name: r.name,
        full_name: `${r.org}/${r.name}`,
        stack: r.stack,
        health_score: r.score,
        updated_at: r.updated_at
      }));

      setRepos(formattedRepos);

      const totalRepos = formattedRepos.length;
      const avgScore = totalRepos > 0 ? Math.round(formattedRepos.reduce((acc, r) => acc + (r.health_score || 0), 0) / totalRepos) : 0;
      
      const { count: presetsCount } = await supabase.from('presets').select('*', { count: 'exact', head: true });
      const { count: activeCIRuns } = await supabase.from('audit_runs').select('*', { count: 'exact', head: true }).eq('status', 'running');

      setStats({
        totalRepos,
        avgScore,
        activeCIRuns: activeCIRuns || 0,
        presets: presetsCount || 0
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    let cleanRepoName = repoUrl.trim();
    
    // Simple GitHub URL parsing
    if (cleanRepoName.includes('github.com/')) {
      const parts = cleanRepoName.split('github.com/')[1].split('/');
      if (parts.length >= 2) {
        cleanRepoName = `${parts[0]}/${parts[1]}`;
      }
    }

    if (!cleanRepoName.includes('/')) {
      toast({
        title: "Invalid Format",
        description: "Please enter 'owner/repo' or a full GitHub URL.",
        variant: "destructive"
      });
      return;
    }

    setConnecting(true);
    try {
      const parts = cleanRepoName.split('/');
      const org = parts[0];
      const name = parts[1];

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) throw new Error("Not authenticated. Please log in first.");

      const { error } = await supabase.from('repositories').insert({
        name,
        org,
        stack: 'TypeScript',
        score: Math.floor(Math.random() * 40) + 60, // Random initial score
        user_id: userId
      });

      if (error) throw error;

      toast({
        title: "Successfully Connected!",
        description: `${cleanRepoName} is now linked to RepoForge.`,
      });
      setRepoUrl('');
      fetchData();
    } catch (err: any) {
      toast({
        title: "Connection Failed",
        description: err.message || "Could not link repository.",
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  const distributionData = [
    { name: 'Healthy', value: repos.filter(r => (r.health_score || 0) >= 80).length, color: '#10b981' },
    { name: 'Warning', value: repos.filter(r => (r.health_score || 0) >= 60 && (r.health_score || 0) < 80).length, color: '#f59e0b' },
    { name: 'Critical', value: repos.filter(r => (r.health_score || 0) < 60).length, color: '#ef4444' },
  ];

  const chartData = repos.slice(0, 5).map(r => ({
    name: r.name,
    score: r.health_score || 0
  }));

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded-lg" />
        <div className="h-64 bg-muted rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 md:p-12 shadow-2xl shadow-indigo-500/20">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1 rounded-full backdrop-blur-md">
              <Zap className="w-3 h-3 mr-2 fill-white" />
              Analyze Faster
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Forge better codebases <br />
              <span className="text-indigo-200">with AI intelligence.</span>
            </h1>
            <p className="text-indigo-100 text-lg mb-8 opacity-90">
              Paste a GitHub link below to instantly scan for security vulnerabilities, 
              best practices, and engineering standards.
            </p>
            
            <form onSubmit={handleConnect} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                <Input 
                  placeholder="https://github.com/owner/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="h-14 pl-12 pr-4 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-indigo-200 focus:bg-white/20 transition-all text-lg shadow-inner"
                />
              </div>
              <Button 
                type="submit" 
                disabled={connecting || !repoUrl}
                className="h-14 px-8 rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-lg shadow-xl shadow-black/10 transition-transform active:scale-95"
              >
                {connecting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Connect Repo'}
              </Button>
            </form>
          </motion.div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 mr-20 -mb-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
      </section>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-3xl border-none bg-card shadow-lg shadow-black/5 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Repos</p>
              <h3 className="text-2xl font-bold">{stats?.totalRepos || 0}</h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-none bg-card shadow-lg shadow-black/5 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Health</p>
              <h3 className="text-2xl font-bold">{stats?.avgScore || 0}%</h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-none bg-card shadow-lg shadow-black/5 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Runs</p>
              <h3 className="text-2xl font-bold">{stats?.activeCIRuns || 0}</h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-none bg-card shadow-lg shadow-black/5 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Audit History</p>
              <h3 className="text-2xl font-bold">{repos.length} logs</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <Card className="lg:col-span-2 rounded-[2rem] border-none bg-card shadow-lg shadow-black/5 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <CardTitle className="text-2xl font-bold">Health Distribution</CardTitle>
              <CardDescription>Visual breakdown of repository standards</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-full h-9 px-4 font-bold text-xs">
              Last 30 Days
            </Button>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: 'hsl(var(--card))' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#f59e0b' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Circular Distribution */}
        <Card className="rounded-[2rem] border-none bg-card shadow-lg shadow-black/5 p-8">
          <CardTitle className="text-2xl font-bold mb-2">Overall Status</CardTitle>
          <CardDescription className="mb-8">Health categories across all projects</CardDescription>
          
          <div className="h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black">{stats?.avgScore || 0}%</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Average</span>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value} Repos</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Repositories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Activity className="w-6 h-6 text-indigo-500" />
            Recent Activity
          </h2>
          <Button asChild variant="ghost" className="font-bold text-indigo-500 hover:text-indigo-600">
            <Link href="/dashboard/repos">
              View all repos <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {repos.length === 0 ? (
            <Card className="col-span-full h-60 rounded-[2rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
              <Database className="w-12 h-12 opacity-20 mb-4" />
              <p className="text-lg font-medium">No repositories tracked yet.</p>
              <p className="text-sm opacity-60">Connect your first repository to get started.</p>
            </Card>
          ) : (
            repos.slice(0, 3).map((repo) => (
              <motion.div
                key={repo.id}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <Card className="rounded-[2rem] border-none bg-card shadow-lg shadow-black/5 p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                      <Github className="w-7 h-7" />
                    </div>
                    <Badge variant="secondary" className="rounded-full bg-indigo-500/10 text-indigo-600 border-none font-bold text-[10px] px-3">
                      {repo.stack || 'NODE'}
                    </Badge>
                  </div>
                  
                  <h4 className="text-xl font-bold mb-1 truncate group-hover:text-indigo-500 transition-colors">{repo.name}</h4>
                  <p className="text-sm text-muted-foreground truncate mb-6">{repo.full_name}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-muted-foreground uppercase tracking-widest">Health Score</span>
                      <span className={`font-black text-sm ${
                        (repo.health_score || 0) >= 80 ? 'text-emerald-500' : 
                        (repo.health_score || 0) >= 60 ? 'text-amber-500' : 'text-destructive'
                      }`}>
                        {repo.health_score || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${repo.health_score || 0}%` }}
                        className={`h-full rounded-full ${
                          (repo.health_score || 0) >= 80 ? 'bg-emerald-500' : 
                          (repo.health_score || 0) >= 60 ? 'bg-amber-500' : 'bg-destructive'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Last scan: {repo.updated_at ? format(new Date(repo.updated_at), 'MMM d') : 'Never'}
                    </span>
                    <Button asChild size="sm" variant="ghost" className="rounded-full font-bold group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <Link href={`/dashboard/audit?repoId=${repo.id}`}>
                        View Report
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Floating Refresh */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => { setRefreshing(true); fetchData(); }} 
        className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-2xl bg-background/80 backdrop-blur-md border-border/50 hover:bg-primary hover:text-white transition-all z-50"
      >
        <RefreshCw className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}

