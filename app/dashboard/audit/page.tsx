'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Check {
  name: string;
  category: string;
  icon: string;
  passed: boolean;
  points_earned: number;
  points_possible: number;
  status: 'passed' | 'failed' | 'warning';
  insight: string;
  fix: string | null;
}

interface Priority {
  rank: number;
  action: string;
  impact: string;
  effort: 'Low' | 'Medium' | 'High';
}

interface AuditReport {
  repo: string;
  score: number;
  grade: string;
  grade_label: string;
  hero_line: string;
  score_context: string;
  badge_text: string;
  badge_color: string;
  summary: string;
  quick_win: string;
  biggest_risk: string;
  checks: Check[];
  top_priorities: Priority[];
  category_scores: Record<string, number>;
  stars: number;
  forks: number;
  open_issues: number;
  last_pushed: string;
  visibility: string;
}

const gradeColors: Record<string, string> = {
  A: 'text-emerald-500', B: 'text-blue-500',
  C: 'text-yellow-500',  D: 'text-orange-500', F: 'text-red-500'
};
const gradeBg: Record<string, string> = {
  A: 'bg-emerald-50 border-emerald-200', B: 'bg-blue-50 border-blue-200',
  C: 'bg-yellow-50 border-yellow-200',   D: 'bg-orange-50 border-orange-200',
  F: 'bg-red-50 border-red-200'
};
const badgeColors: Record<string, string> = {
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  red: 'bg-red-100 text-red-700 border-red-200',
};
const effortColors: Record<string, string> = {
  Low: 'text-emerald-600 bg-emerald-50', Medium: 'text-yellow-600 bg-yellow-50', High: 'text-red-600 bg-red-50'
};

export default function AuditPage() {
  const [githubUrl, setGithubUrl] = useState('');
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async () => {
    if (!githubUrl.trim()) return;
    setIsLoading(true);
    setReport(null);
    setError(null);

    try {
      let fullName = githubUrl.trim();
      if (fullName.startsWith('http')) {
        const url = new URL(fullName);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) fullName = `${parts[0]}/${parts[1]}`;
      }

      toast.info('Connecting to repository...');
      const { connectRepo, runAudit } = await import('@/lib/supabase/api');

      const connectResponse = await connectRepo(fullName);
      if (!connectResponse?.repo?.id) throw new Error('Failed to connect repository');

      toast.info(`Auditing ${fullName}...`);
      const auditResponse = await runAudit(connectResponse.repo.id);

      setReport(auditResponse as AuditReport);
      toast.success(`Audit complete — Score: ${auditResponse.score}/100`);
    } catch (error: any) {
      console.error('Audit failed:', error);
      const msg = error.message || 'Failed to perform audit';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-[#e5e7eb] px-8 py-6">
          <h1 className="text-2xl font-bold text-[#0a0a0a]">Health Auditor</h1>
          <p className="text-sm text-[#6b7280] mt-1">Scan any GitHub repository against 10 engineering standards.</p>
        </div>

        <div className="p-8 space-y-8 max-w-5xl mx-auto">
          {/* Input card */}
          <Card className="p-8 shadow-sm">
            <div className="max-w-2xl">
              <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">GitHub Repository</label>
              <p className="text-sm text-[#6b7280] mb-4">
                Enter a repo path like <span className="font-mono text-[#0070f3]">vercel/next.js</span> or a full GitHub URL.
              </p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </div>
                  <Input
                    placeholder="owner/repo or https://github.com/owner/repo"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAudit()}
                    className="pl-10 h-11"
                  />
                </div>
                <Button onClick={handleAudit} disabled={!githubUrl.trim() || isLoading} className="px-8 h-11">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Auditing...
                    </span>
                  ) : 'Run Audit'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Results */}
          {report && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Score hero card */}
              <Card className={`p-8 border-2 ${gradeBg[report.grade] || 'bg-white border-gray-200'}`}>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className={`text-7xl font-black ${gradeColors[report.grade]}`}>{report.grade}</div>
                      <div className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mt-1">{report.grade_label}</div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-[#0a0a0a]">{report.score}<span className="text-xl font-normal text-[#9ca3af]">/100</span></div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border mt-2 ${badgeColors[report.badge_color] || badgeColors.orange}`}>
                        {report.badge_text}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 md:pl-6 md:border-l border-current/10">
                    <p className="text-lg font-semibold text-[#0a0a0a] leading-snug">{report.hero_line}</p>
                    <p className="text-sm text-[#6b7280] mt-2">{report.score_context}</p>
                    <div className="flex gap-4 mt-3 text-xs text-[#9ca3af]">
                      <span>⭐ {report.stars?.toLocaleString()} stars</span>
                      <span>🍴 {report.forks?.toLocaleString()} forks</span>
                      <span>🔓 {report.visibility}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick win + Biggest risk */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-5 border-l-4 border-emerald-400 bg-emerald-50/40">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">⚡</span>
                    <div>
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Quick Win</p>
                      <p className="text-sm text-[#0a0a0a]">{report.quick_win}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-5 border-l-4 border-red-400 bg-red-50/40">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">🚨</span>
                    <div>
                      <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Biggest Risk</p>
                      <p className="text-sm text-[#0a0a0a]">{report.biggest_risk}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Top Priorities */}
              {report.top_priorities?.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-base font-bold text-[#0a0a0a] mb-4">Top Priorities</h2>
                  <div className="space-y-3">
                    {report.top_priorities.map(p => (
                      <div key={p.rank} className="flex items-start gap-4 p-4 bg-[#fafafa] rounded-xl border border-[#f3f4f6]">
                        <div className="w-7 h-7 rounded-full bg-[#0070f3] text-white text-xs font-black flex items-center justify-center shrink-0">{p.rank}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#0a0a0a]">{p.action}</p>
                          <div className="flex gap-3 mt-1.5">
                            <span className="text-xs font-bold text-[#0070f3]">{p.impact}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${effortColors[p.effort]}`}>{p.effort} effort</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* All Checks */}
              <Card className="p-6">
                <h2 className="text-base font-bold text-[#0a0a0a] mb-4">All Checks</h2>
                <div className="space-y-2">
                  {report.checks?.map(check => (
                    <div
                      key={check.name}
                      className={`p-4 rounded-xl border ${
                        check.passed ? 'bg-white border-[#e5e7eb]' :
                        check.status === 'warning' ? 'bg-yellow-50/60 border-yellow-200' : 'bg-red-50/60 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5 shrink-0">{check.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-[#0a0a0a]">{check.name}</span>
                            <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">{check.category}</span>
                            {check.passed ? (
                              <span className="ml-auto text-xs font-bold text-emerald-600">+{check.points_earned} pts ✓</span>
                            ) : (
                              <span className="ml-auto text-xs font-bold text-red-500">+0/{check.points_possible} pts</span>
                            )}
                          </div>
                          <p className="text-sm text-[#6b7280] mt-1">{check.insight}</p>
                          {check.fix && (
                            <p className="text-xs text-[#0070f3] mt-2 font-medium">💡 {check.fix}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Category scores */}
              {report.category_scores && (
                <Card className="p-6">
                  <h2 className="text-base font-bold text-[#0a0a0a] mb-5">Category Breakdown</h2>
                  <div className="space-y-4">
                    {Object.entries(report.category_scores).map(([cat, earned]) => {
                      const possible = report.checks
                        ?.filter(c => c.category === cat)
                        .reduce((s, c) => s + c.points_possible, 0) || 1;
                      const pct = Math.round((earned / possible) * 100);
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium text-[#0a0a0a]">{cat}</span>
                            <span className="text-[#6b7280] font-mono">{earned}/{possible}</span>
                          </div>
                          <div className="h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                pct === 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-[#0070f3]' : pct >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Error state */}
          {!report && !isLoading && error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
                <svg width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#0a0a0a] mb-2">Audit failed</h3>
              <p className="text-sm text-[#6b7280] max-w-sm mx-auto">{error}</p>
              {error.includes('not found') && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl max-w-md mx-auto text-left">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Private repository?</p>
                  <p className="text-sm text-amber-800">
                    Private repos require a GitHub access token. Sign out and sign back in with GitHub to re-authorize, then try again.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!report && !isLoading && !error && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[#f3f4f6] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#e5e7eb]">
                <svg width="32" height="32" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0a0a0a]">Ready to audit</h3>
              <p className="text-sm text-[#6b7280] mt-2">Enter any GitHub repository above to run a 10-point health check.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {['vercel/next.js', 'facebook/react', 'torvalds/linux'].map(r => (
                  <button
                    key={r}
                    onClick={() => { setGithubUrl(r); }}
                    className="text-xs font-mono px-3 py-1.5 bg-white border border-[#e5e7eb] rounded-full hover:border-[#0070f3] hover:text-[#0070f3] transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
