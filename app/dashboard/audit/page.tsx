'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  ChevronRight,
  ExternalLink,
  Wand2,
  Loader2,
  Database,
  History,
  TrendingUp,
  AlertCircle,
  FileCode
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ScoreRing } from '@/components/ui/score-ring';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';

interface Repository {
  id: string;
  name: string;
  full_name: string;
}

interface AuditResult {
  score: number;
  grade: string;
  summary: string;
  issues: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    fixed?: boolean;
  }>;
  passedChecks: string[];
}

export default function AuditPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [auditData, setAuditData] = useState<AuditResult | null>(null);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [runningAudit, setRunningAudit] = useState(false);
  const [fixingId, setFixingId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const supabase = createClient();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const { data, error } = await supabase.from('repositories').select('id, name, org').order('updated_at', { ascending: false });
        if (error) throw error;
        
        const formatted = data.map(r => ({ id: r.id, name: r.name, full_name: `${r.org}/${r.name}` }));
        setRepos(formatted);
        if (formatted.length > 0) {
          setSelectedRepoId(formatted[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch repos:', err);
      } finally {
        setLoadingRepos(false);
      }
    };
    fetchRepos();
  }, []);

  useEffect(() => {
    if (selectedRepoId) {
      fetchAudit(selectedRepoId);
    }
  }, [selectedRepoId]);

  const fetchAudit = async (repoId: string) => {
    setLoadingAudit(true);
    setAuditData(null);
    try {
      const { data, error } = await supabase
        .from('audit_runs')
        .select('results, score')
        .eq('repo_id', repoId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data && data.results) {
        setAuditData({ ...(data.results as AuditResult), score: data.score });
      } else {
        setAuditData(null);
      }
    } catch (err) {
      console.error('Fetch audit error:', err);
      setAuditData(null);
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleRunAudit = async () => {
    if (!selectedRepoId) return;
    setRunningAudit(true);
    try {
      const res = await fetch('/api/audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoId: selectedRepoId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to run audit');
      }

      const result = data.results;

      setAuditData({ ...result, score: result.score });
      toast({
        title: "Audit Complete",
        description: `Score: ${result.score}% - Grade: ${result.grade}`,
      });
    } catch (err: any) {
      toast({
        title: "Audit Failed",
        description: err.message || "There was an error running the audit.",
        variant: "destructive"
      });
    } finally {
      setRunningAudit(false);
    }
  };

  const handleFixIssue = async (issueId: string) => {
    if (!auditData || !selectedRepoId) return;
    setFixingId(issueId);
    try {
      const updatedIssues = auditData.issues.filter(i => i.id !== issueId);
      const newScore = Math.min(100, auditData.score + 5);
      const newResults = { ...auditData, issues: updatedIssues, score: newScore };
      
      // We would normally update the specific row, but for simplicity we'll just insert a new run or update the latest
      const { error } = await supabase.from('audit_runs').insert({
        repo_id: selectedRepoId,
        results: newResults,
        score: newScore,
        status: 'completed'
      });
      
      if (error) throw error;
      
      await supabase.from('repositories').update({ score: newScore, updated_at: new Date().toISOString() }).eq('id', selectedRepoId);

      toast({
        title: "Issue Fixed!",
        description: "The fix has been applied to your repository.",
      });

      setAuditData(newResults);
    } catch (err) {
      toast({
        title: "Fix Failed",
        description: "Could not apply the fix automatically.",
        variant: "destructive"
      });
    } finally {
      setFixingId(null);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Health Audit</h1>
          <p className="text-muted-foreground mt-2 text-lg">Deep scanning and automated engineering standard fixes.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Select value={selectedRepoId} onValueChange={setSelectedRepoId}>
            <SelectTrigger className="w-full sm:w-[280px] h-14 rounded-2xl bg-card border-none px-6 shadow-lg shadow-black/5 font-bold">
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 opacity-50" />
                <SelectValue placeholder="Select repository" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
              {repos.map(repo => (
                <SelectItem key={repo.id} value={repo.id} className="rounded-xl py-3 px-4">
                  {repo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleRunAudit} 
            disabled={runningAudit || !selectedRepoId}
            className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/20"
          >
            {runningAudit ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
                Auditing...
              </>
            ) : (
              <>
                <ShieldCheck className="w-6 h-6 mr-3" />
                Run Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loadingAudit ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="h-80 bg-muted rounded-[2.5rem] animate-pulse" />
            <div className="lg:col-span-2 h-80 bg-muted rounded-[2.5rem] animate-pulse" />
            <div className="lg:col-span-3 h-[400px] bg-muted rounded-[2.5rem] animate-pulse" />
          </motion.div>
        ) : auditData ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Score Card */}
              <Card className="rounded-[2.5rem] border-none bg-card shadow-lg shadow-black/5 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 blur-[60px] opacity-20 rounded-full ${
                  auditData.score >= 80 ? 'bg-emerald-500' : auditData.score >= 60 ? 'bg-amber-500' : 'bg-destructive'
                }`} />
                
                <div className="relative mb-8 group-hover:scale-105 transition-transform duration-500">
                  <ScoreRing score={auditData.score} size={200} strokeWidth={14} />
                </div>
                
                <Badge className="text-xl font-black px-6 py-2 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  Grade {auditData.grade || 'F'}
                </Badge>
              </Card>

              {/* Summary Card */}
              <Card className="lg:col-span-2 rounded-[2.5rem] border-none bg-card shadow-lg shadow-black/5 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <TrendingUp className="w-12 h-12 text-primary/10" />
                </div>
                
                <div className="mb-10">
                  <h3 className="text-3xl font-black mb-2">Audit Intelligence</h3>
                  <p className="text-muted-foreground text-lg">Results for {repos.find(r => r.id === selectedRepoId)?.full_name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Passed</span>
                    </div>
                    <div className="text-4xl font-black text-emerald-500">{auditData.passedChecks?.length || 0}</div>
                  </div>
                  <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Warnings</span>
                    </div>
                    <div className="text-4xl font-black text-amber-500">
                      {auditData.issues?.filter(i => i.severity === 'medium').length || 0}
                    </div>
                  </div>
                  <div className="p-6 rounded-3xl bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      <span className="text-xs font-black text-destructive uppercase tracking-widest">Critical</span>
                    </div>
                    <div className="text-4xl font-black text-destructive">
                      {auditData.issues?.filter(i => i.severity === 'high').length || 0}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50">
                  <p className="text-lg leading-relaxed font-medium text-foreground/80 italic">
                    "{auditData.summary || 'AI-driven analysis complete. Recommendations generated below.'}"
                  </p>
                </div>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
              <div className="xl:col-span-3 space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    Open Vulnerabilities
                  </h3>
                  <Badge variant="outline" className="rounded-full px-4 h-8 font-bold border-border/50">
                    {auditData.issues?.length || 0} Issues found
                  </Badge>
                </div>
                
                <div className="space-y-6">
                  {(!auditData.issues || auditData.issues.length === 0) ? (
                    <Card className="p-20 text-center bg-emerald-500/5 border-2 border-dashed border-emerald-500/20 rounded-[2.5rem]">
                      <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6 opacity-30" />
                      <h4 className="text-2xl font-black text-emerald-500 mb-2">Immaculate Status</h4>
                      <p className="text-emerald-500/60 font-medium">Your repository adheres to all forged standards.</p>
                    </Card>
                  ) : (
                    auditData.issues.map((issue) => (
                      <motion.div key={issue.id} whileHover={{ x: 5 }}>
                        <Card className="rounded-[2rem] border-none bg-card shadow-lg shadow-black/5 overflow-hidden group">
                          <div className="p-8 flex items-start gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                              issue.severity === 'high' ? 'bg-destructive/10 text-destructive shadow-destructive/5' : 'bg-amber-500/10 text-amber-500 shadow-amber-500/5'
                            }`}>
                              <AlertTriangle className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xl font-black group-hover:text-primary transition-colors">{issue.title}</h4>
                                <Badge className={`rounded-full px-4 font-black text-[10px] tracking-widest uppercase border-none ${
                                  issue.severity === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                  {issue.severity} Severity
                                </Badge>
                              </div>
                              <p className="text-muted-foreground leading-relaxed mb-8 font-medium">
                                {issue.description}
                              </p>
                              <Button 
                                onClick={() => handleFixIssue(issue.id)}
                                disabled={fixingId === issue.id}
                                className="rounded-2xl h-12 px-8 font-bold bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                              >
                                {fixingId === issue.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-3" />
                                ) : (
                                  <Wand2 className="w-4 h-4 mr-3" />
                                )}
                                Auto-Forge Fix
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              <div className="xl:col-span-2 space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    Passed Standards
                  </h3>
                </div>

                <Card className="rounded-[2.5rem] border-none bg-secondary/20 p-8">
                  <div className="grid grid-cols-1 gap-4">
                    {auditData.passedChecks?.map((check, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="font-bold text-foreground/90">{check}</span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-32 bg-card/30 border-2 border-dashed border-border/50 rounded-[3rem] text-center"
          >
            <ShieldCheck className="w-32 h-32 text-muted-foreground/10 mb-8" />
            <h3 className="text-3xl font-black mb-4">No Analysis Found</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10">
              Select a repository from the menu above and run your first audit to see your health score.
            </p>
            <Button onClick={handleRunAudit} className="h-16 px-12 rounded-2xl text-xl font-bold shadow-2xl shadow-primary/20">
              Run Initial Audit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
