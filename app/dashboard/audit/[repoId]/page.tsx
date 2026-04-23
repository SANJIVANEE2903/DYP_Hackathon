'use client';

import { useEffect, useState, use } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { AuditScore } from '@/components/audit/audit-score';
import { IssueCard } from '@/components/audit/issue-card';
import { getAuditResult } from '@/lib/supabase/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Repository, AuditResult } from '@/types';
import { toast } from 'sonner';

interface Props {
  params: Promise<{ repoId: string }>;
}

export default function AuditDetailPage(props: Props) {
  const params = use(props.params);
  const [repo, setRepo] = useState<Repository | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const auditData = await getAuditResult(params.repoId);
        
        // The backend might return { repo, result } or just result depending on implementation
        // Assuming result for now, but I'll add safeties
        if (auditData) {
          setResult(auditData as unknown as AuditResult);
          // If the backend doesn't provide the repo object, we'll extract it or fetch separately
          // For now, let's assume the backend provides what's needed.
        }
      } catch (error: any) {
        if (error.message && error.message.includes('No audit found')) {
          // This is a normal state if the repository hasn't been audited yet.
          setResult(null);
        } else {
          console.error('Failed to fetch audit data:', error);
          toast.error('Failed to load audit results');
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [params.repoId]);

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
          <div className="text-[#6b7280] animate-pulse">Loading audit details...</div>
        </div>
      </DashboardShell>
    );
  }

  if (!repo) {
    return (
      <DashboardShell>
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
          <Card className="text-center p-8 max-w-sm">
            <div className="w-12 h-12 bg-[#fee2e2] text-[#ef4444] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">Repository not found</h3>
            <p className="text-sm text-[#6b7280] mb-6">The repository you are looking for does not exist or you do not have permission to view it.</p>
            <Button asChild className="w-full">
              <Link href="/dashboard/repos">
                Back to repositories
              </Link>
            </Button>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  const issueCount = result ? (result.criticalIssues.length + result.warnings.length) : 0;

  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-[#e5e7eb] px-8 py-6">
          <div className="flex items-center gap-2 text-xs font-medium text-[#6b7280] mb-3 uppercase tracking-wider">
            <Link href="/dashboard/audit" className="hover:text-[#0070f3] transition-colors">
              Health Auditor
            </Link>
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
            <span className="text-[#0a0a0a]">{repo.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0a0a0a]">Audit: {repo.name}</h1>
              <p className="text-sm text-[#6b7280] mt-1">
                {result 
                  ? `Completed ${result.totalChecks} configuration checks.`
                  : 'No audit history found for this repository.'}
              </p>
            </div>
            <Button variant="secondary" className="gap-2" disabled={!result}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Export report
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {!result ? (
            <Card className="p-16 text-center bg-white border-dashed border-2">
              <div className="w-16 h-16 bg-[#eff6ff] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" fill="none" stroke="#0070f3" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">No audit run yet</h3>
              <p className="text-[#6b7280] mb-8 leading-relaxed max-w-md mx-auto">
                This repository hasn't been audited yet. Run a configuration scan to identify security gaps and best practices.
              </p>
              <Button className="px-8 h-11" asChild>
                <Link href="/dashboard/audit">Run first audit</Link>
              </Button>
            </Card>
          ) : (
            <>
              {/* Score card */}
              <AuditScore result={result} />

              {/* Issues to fix */}
              {issueCount > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6 px-1">
                    <h2 className="text-xl font-bold text-[#0a0a0a]">Action Required</h2>
                    <Badge variant="error" className="h-6 px-2.5 font-bold border-none shadow-sm">
                      {issueCount} issues
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {result.criticalIssues.map(issue => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                    {result.warnings.map(issue => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                </div>
              )}

              {/* Passed checks */}
              <details className="group border border-[#e5e7eb] rounded-2xl bg-white overflow-hidden transition-all duration-300 open:shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-[#fafafa] transition-colors list-none">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#eff6ff] rounded-xl flex items-center justify-center border border-[#dbeafe] text-[#0070f3]">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0a0a0a]">Compliant configurations</h3>
                      <p className="text-xs text-[#6b7280] mt-0.5">Configurations that pass all health metrics.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#10b981]">{result.passed.length} passed</span>
                    <svg className="w-5 h-5 text-[#9ca3af] group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </summary>
                <div className="p-6 pt-0 border-t border-[#f3f4f6]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
                    {result.passed.map(check => (
                      <div key={check.id} className="flex items-center gap-3 p-4 bg-[#fafafa] rounded-xl border border-[#e5e7eb] hover:bg-white transition-colors">
                        <svg className="w-5 h-5 text-[#10b981] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-xs font-bold text-[#0a0a0a] leading-tight uppercase tracking-tight">{check.title}</p>
                          <p className="text-[10px] text-[#6b7280] mt-0.5 line-clamp-1">{check.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
