'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Search, 
  Plus, 
  Github, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Trash2,
  RefreshCw,
  Filter,
  SortAsc,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Calendar,
  Code2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import Link from 'next/link';

interface Repository {
  id: string;
  name: string;
  full_name: string;
  stack: string;
  health_score: number | null;
  updated_at: string;
  is_private: boolean;
}

const ITEMS_PER_PAGE = 6;

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'date'>('date');
  const [filterStack, setFilterStack] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [repoFullName, setRepoFullName] = useState('');
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();
  
  const supabase = createClient();

  const fetchRepos = async () => {
    try {
      const { data, error } = await supabase.from('repositories').select('*').order('updated_at', { ascending: false });
      if (error) throw error;
      
      const formatted = (data || []).map(r => ({
        id: r.id,
        name: r.name,
        full_name: `${r.org}/${r.name}`,
        stack: r.stack,
        health_score: r.score,
        updated_at: r.updated_at,
        is_private: r.is_private || false
      }));
      setRepos(formatted);
    } catch (err) {
      console.error('Failed to fetch repos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    let cleanRepoName = repoFullName.trim();
    if (cleanRepoName.includes('github.com/')) {
      const parts = cleanRepoName.split('github.com/')[1].split('/');
      if (parts.length >= 2) cleanRepoName = `${parts[0]}/${parts[1]}`;
    }

    if (!cleanRepoName.includes('/')) {
      toast({ title: "Invalid Format", description: "Use 'owner/repo' or GitHub URL.", variant: "destructive" });
      return;
    }

    setConnecting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) throw new Error("Not authenticated");

      const parts = cleanRepoName.split('/');
      const { error } = await supabase.from('repositories').insert({
        name: parts[1],
        org: parts[0],
        stack: 'TypeScript',
        score: null,
        user_id: userId
      });
      if (error) throw error;

      toast({ title: "Connected!", description: `Successfully connected ${cleanRepoName}.` });
      setRepoFullName('');
      setIsConnectOpen(false);
      fetchRepos();
    } catch (err: any) {
      toast({ title: "Connection Failed", description: err.message || "Failed to connect.", variant: "destructive" });
    } finally {
      setConnecting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('repositories').delete().eq('id', id);
      if (error) throw error;
      setRepos(repos.filter(r => r.id !== id));
      toast({ title: "Disconnected", description: "Repository removed." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to disconnect.", variant: "destructive" });
    }
  };

  const stacks = useMemo(() => {
    const s = new Set(repos.map(r => r.stack).filter(Boolean));
    return ['all', ...Array.from(s)];
  }, [repos]);

  const filteredAndSortedRepos = useMemo(() => {
    return repos
      .filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             repo.full_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStack = filterStack === 'all' || repo.stack === filterStack;
        return matchesSearch && matchesStack;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'score') return (b.health_score || 0) - (a.health_score || 0);
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }, [repos, searchQuery, sortBy, filterStack]);

  const paginatedRepos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedRepos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedRepos, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedRepos.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Repositories</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage and monitor your engineering standards.</p>
        </div>
        
        <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-14 px-8 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-lg font-bold">
              <Plus className="w-6 h-6 mr-2" />
              Connect New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8 border-none bg-card shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Connect Repository</DialogTitle>
              <DialogDescription>
                Paste the GitHub URL or "owner/repo" path.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleConnect} className="space-y-6 py-4">
              <Input 
                placeholder="e.g. facebook/react" 
                value={repoFullName}
                onChange={(e) => setRepoFullName(e.target.value)}
                className="rounded-2xl h-14 bg-secondary/50 border-none px-6 text-lg"
              />
              <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold" disabled={connecting || !repoFullName}>
                {connecting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Link Repository'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Bar */}
      <Card className="rounded-[2.5rem] border-none bg-card shadow-lg shadow-black/5 p-4">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search repositories..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-12 h-14 rounded-2xl border-none bg-secondary/50 shadow-inner text-lg w-full"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Select value={filterStack} onValueChange={(v) => { setFilterStack(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full lg:w-[180px] h-14 rounded-2xl bg-secondary/50 border-none px-6 font-bold">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="All Stacks" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                {stacks.map(s => (
                  <SelectItem key={s} value={s} className="rounded-xl uppercase text-[10px] font-black tracking-widest">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-full lg:w-[180px] h-14 rounded-2xl bg-secondary/50 border-none px-6 font-bold">
                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4" />
                  <SelectValue placeholder="Sort By" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="date" className="rounded-xl">Recently Added</SelectItem>
                <SelectItem value="score" className="rounded-xl">Health Score</SelectItem>
                <SelectItem value="name" className="rounded-xl">Repo Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 rounded-[2.5rem] bg-muted animate-pulse" />
            ))
          ) : paginatedRepos.length === 0 ? (
            <div className="col-span-full py-32 text-center flex flex-col items-center justify-center bg-card/50 rounded-[3rem] border-2 border-dashed border-border/50">
              <Database className="w-20 h-20 text-muted-foreground/20 mb-6" />
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          ) : (
            paginatedRepos.map((repo) => (
              <motion.div
                key={repo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="h-full rounded-[2.5rem] border-none bg-card shadow-lg shadow-black/5 p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden relative">
                  {/* Status Indicator */}
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 blur-[60px] opacity-20 rounded-full ${
                    (repo.health_score || 0) >= 80 ? 'bg-emerald-500' : (repo.health_score || 0) >= 60 ? 'bg-amber-500' : 'bg-destructive'
                  }`} />
                  
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-secondary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <Github className="w-8 h-8" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-secondary">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]">
                        <DropdownMenuItem className="rounded-xl flex items-center gap-2 py-3" asChild>
                          <Link href={`https://github.com/${repo.full_name}`} target="_blank">
                            <ExternalLink className="w-4 h-4" />
                            Open on GitHub
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem 
                          className="rounded-xl flex items-center gap-2 py-3 text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => handleDelete(repo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Repo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mb-8 relative z-10">
                    <h4 className="text-2xl font-black mb-1 truncate group-hover:text-primary transition-colors">{repo.name}</h4>
                    <p className="text-sm text-muted-foreground truncate mb-4 font-medium opacity-70">{repo.full_name}</p>
                    <div className="flex items-center gap-3">
                      <Badge className="rounded-full bg-secondary text-foreground border-none font-black text-[10px] tracking-widest px-3 py-1">
                        <Code2 className="w-3 h-3 mr-2" />
                        {repo.stack || 'NODE'}
                      </Badge>
                      {repo.is_private && (
                        <Badge className="rounded-full bg-amber-500/10 text-amber-500 border-none font-black text-[10px] tracking-widest px-3 py-1">
                          PRIVATE
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-black text-muted-foreground uppercase tracking-[0.2em]">Health Integrity</span>
                      <span className={`font-black text-lg ${
                        repo.health_score === null ? 'text-muted-foreground' : repo.health_score >= 80 ? 'text-emerald-500' : repo.health_score >= 60 ? 'text-amber-500' : 'text-destructive'
                      }`}>
                        {repo.health_score === null ? 'Pending' : `${repo.health_score}%`}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${repo.health_score || 0}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full shadow-lg ${
                          repo.health_score === null ? 'bg-muted-foreground/30' : 
                          repo.health_score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 
                          repo.health_score >= 60 ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 
                          'bg-gradient-to-r from-destructive to-red-600'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-border/50 flex items-center justify-between relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Last Update</span>
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Calendar className="w-3 h-3 opacity-50" />
                        {repo.updated_at ? format(new Date(repo.updated_at), 'MMM d, yyyy') : 'Never'}
                      </div>
                    </div>
                    <Button asChild size="lg" className="rounded-2xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                      <Link href={`/dashboard/audit?repoId=${repo.id}`}>
                        View Audit
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-2xl w-12 h-12 bg-card shadow-lg"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? 'default' : 'ghost'}
                className={`w-12 h-12 rounded-2xl font-bold text-lg ${currentPage === i + 1 ? 'shadow-lg shadow-primary/20' : 'bg-card shadow-sm'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-2xl w-12 h-12 bg-card shadow-lg"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
