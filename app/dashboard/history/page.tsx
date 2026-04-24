'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2,
  History as HistoryIcon, 
  Search, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Database,
  Filter,
  ShieldCheck,
  Calendar,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { format } from 'date-fns';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  repo_name: string;
  action_type: string;
  status: 'completed' | 'failed' | 'pending';
  details: string;
  created_at: string;
  score?: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetching real history from the new history endpoint
        const res = await api.get('/history');
        const runs = res.data || [];
        
        const transformedHistory: HistoryItem[] = runs.map((run: any) => ({
          id: run.id,
          repo_name: run.repo?.name || 'Unknown Repository',
          action_type: 'Security Audit',
          status: 'completed',
          details: run.summary || `Health analysis completed with score of ${run.score || 0}%`,
          created_at: run.created_at,
          score: run.score || 0
        }));

        setHistory(transformedHistory);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusBadge = (status: string, score?: number) => {
    if (score !== undefined) {
      if (score >= 80) return <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] tracking-widest px-3">HEALTHY</Badge>;
      if (score >= 60) return <Badge className="bg-amber-500/10 text-amber-500 border-none font-black text-[10px] tracking-widest px-3">WARNING</Badge>;
      return <Badge className="bg-destructive/10 text-destructive border-none font-black text-[10px] tracking-widest px-3">CRITICAL</Badge>;
    }
    switch (status) {
      case 'completed': return <Badge className="bg-emerald-500/10 text-emerald-500 border-none">COMPLETED</Badge>;
      case 'failed': return <Badge className="bg-destructive/10 text-destructive border-none">FAILED</Badge>;
      default: return <Badge variant="outline">PENDING</Badge>;
    }
  };

  const filteredHistory = history.filter(item => 
    item.repo_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.action_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Audit History</h1>
          <p className="text-muted-foreground mt-2 text-lg">Timeline of all repository scans and security audits.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-border/50 bg-card shadow-lg shadow-black/5">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
            Export Report
          </Button>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none bg-card shadow-lg shadow-black/5 overflow-hidden">
        <div className="p-8 border-b border-border/50 bg-secondary/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by repo or audit type..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-2xl border-none bg-background shadow-inner text-lg"
            />
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
            <Clock className="w-5 h-5 text-primary" />
            <span>Last 90 days of history</span>
          </div>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="p-32 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
              <p className="text-muted-foreground font-medium">Retrieving audit logs...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-32 text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-8">
                <HistoryIcon className="w-12 h-12 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black mb-2">No History Found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mb-10">
                You haven't performed any audits yet. Connect a repository and run a scan to see it here.
              </p>
              <Button asChild className="rounded-2xl h-14 px-10 text-lg font-bold">
                <Link href="/dashboard">Run First Audit</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              <AnimatePresence>
                {filteredHistory.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group p-8 hover:bg-secondary/10 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-lg ${
                        item.score && item.score >= 80 ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/5' : 
                        item.score && item.score >= 60 ? 'bg-amber-500/10 text-amber-500 shadow-amber-500/5' : 
                        'bg-destructive/10 text-destructive shadow-destructive/5'
                      }`}>
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-black group-hover:text-primary transition-colors">{item.action_type}</h4>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm">
                            <Github className="w-4 h-4" />
                            {item.repo_name}
                          </div>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 opacity-50" />
                          {item.details}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-10 w-full lg:w-auto justify-between lg:justify-end">
                      <div className="flex flex-col items-end">
                        <div className="mb-2">{getStatusBadge(item.status, item.score)}</div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(item.created_at), 'MMM d, yyyy • h:mm a')}
                        </div>
                      </div>
                      <Button asChild variant="secondary" size="icon" className="rounded-2xl w-12 h-12 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <Link href={`/dashboard/audit?repoId=${item.id}`}>
                          <ChevronRight className="w-6 h-6" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
