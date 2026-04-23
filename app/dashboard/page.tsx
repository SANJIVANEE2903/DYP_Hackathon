'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { getRepos, getDashboardStats } from '@/lib/supabase/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Repository } from '@/types';
import { toast } from 'sonner';

export default function DashboardOverview() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [stats, setStats] = useState({ totalRepos: 0, criticalIssues: 0, healthyRepos: 0, scannedToday: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [reposData, statsData] = await Promise.all([
          getRepos(),
          getDashboardStats().catch(() => null)
        ]);
        
        setRepos(reposData as unknown as Repository[]);
        if (statsData) {
          setStats(statsData);
        } else {
          setStats({
            totalRepos: reposData.length,
            criticalIssues: 0,
            healthyRepos: 0,
            scannedToday: 0,
          });
        }
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const avgScore = repos.length > 0 
    ? Math.round(repos.reduce((sum, r) => sum + r.score, 0) / repos.length)
    : 0;

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-[#10b981]';
    if (score >= 60) return 'bg-[#f59e0b]';
    return 'bg-[#ef4444]';
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-[#e5e7eb] px-4 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#0a0a0a]">Overview</h1>
            <p className="text-sm text-[#6b7280] mt-0.5">Manage your engineering standards across repositories.</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm font-medium text-[#0a0a0a]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
            <p className="text-xs text-[#6b7280]">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total repos', value: stats.totalRepos, variant: 'default' },
              { label: 'Avg health score', value: `${avgScore}/100`, variant: avgScore > 80 ? 'success' : 'default' },
              { label: 'Active CI runs', value: 0, variant: 'default' },
              { label: 'Presets applied', value: 0, variant: 'default' },
            ].map((stat) => (
              <Card key={stat.label} className="p-5">
                <p className="text-2xl font-semibold text-[#0a0a0a] mb-1">{isLoading ? '...' : stat.value}</p>
                <p className="text-sm text-[#6b7280] mb-1">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Recent repos section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#0a0a0a]">Recent repositories</h2>
              {repos.length > 0 && (
                <Link href="/dashboard/repos" className="text-sm text-[#0070f3] hover:text-[#0060df] font-medium">
                  View all repos →
                </Link>
              )}
            </div>

            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-12 text-center text-[#6b7280] animate-pulse">
                    Loading repositories...
                  </div>
                ) : repos.length > 0 ? (
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] bg-[#fafafa]">
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">Repository</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">Stack</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">Health Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">Last Updated</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-[#6b7280] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6]">
                      {repos.slice(0, 5).map((repo) => (
                        <tr key={repo.id} className="hover:bg-[#fafafa] transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-[#f3f4f6] flex items-center justify-center text-[#6b7280]">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#0a0a0a]">{repo.name}</p>
                                <p className="text-xs text-[#9ca3af]">{repo.org}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="info" className="font-normal border-none">
                              {repo.stack}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-[#f3f4f6] rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${getProgressColor(repo.score)}`}
                                  style={{ width: `${repo.score}%` }}
                                />
                              </div>
                              <span className={`text-xs font-semibold ${
                                repo.score >= 80 ? 'text-[#10b981]' :
                                repo.score >= 60 ? 'text-[#f59e0b]' :
                                'text-[#ef4444]'
                              }`}>
                                {repo.score}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-[#6b7280]">
                            {new Date(repo.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button variant="ghost" className="h-8 px-2 text-xs" asChild>
                              <Link href={`/dashboard/audit/${repo.id}`}>
                                View audit
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-16 text-center">
                    <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 3h18v18H3zM3 9h18M9 21V9" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-[#0a0a0a] mb-1">No repositories found</h3>
                    <p className="text-sm text-[#6b7280] mb-6">Initialize a repository to start tracking health scores.</p>
                    <Button asChild>
                      <Link href="/onboarding">
                        Create first repo
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-[#bfdbfe] bg-[#eff6ff]">
              <h3 className="font-semibold text-[#0a0a0a] mb-2 flex items-center gap-2">
                <svg width="18" height="18" fill="none" stroke="#0070f3" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Initialize new repo
              </h3>
              <p className="text-sm text-[#4b5563] mb-5">Set up a new repository with RepoForge presets, CI/CD, and protection rules.</p>
              <Button className="w-full shadow-sm" asChild>
                <Link href="/onboarding">
                  Create repo
                </Link>
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-[#0a0a0a] mb-2 flex items-center gap-2">
                <svg width="18" height="18" fill="none" stroke="#0070f3" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Audit existing repo
              </h3>
              <p className="text-sm text-[#6b7280] mb-5">Run a health check on any GitHub repository to identify missing configurations.</p>
              <div className="flex gap-2">
                <Input
                  placeholder="owner/repo"
                  className="flex-1"
                />
                <Button variant="secondary" asChild>
                  <Link href="/dashboard/audit">
                    Audit
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
