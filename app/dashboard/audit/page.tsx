'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { AuditScore } from '@/components/audit/audit-score';
import { IssueCard } from '@/components/audit/issue-card';
import { MOCK_AUDIT_RESULT } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function AuditPage() {
  const [githubUrl, setGithubUrl] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAudit = () => {
    if (!githubUrl.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 1500);
  };

  const issueCount = MOCK_AUDIT_RESULT.criticalIssues.length + MOCK_AUDIT_RESULT.warnings.length;

  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-[#e5e7eb] px-8 py-6">
          <h1 className="text-2xl font-semibold text-[#0a0a0a]">Health Auditor</h1>
          <p className="text-sm text-[#6b7280] mt-1">Scan any GitHub repository to identify misconfigurations and security gaps.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* URL input card */}
          <Card className="p-8 shadow-sm">
            <div className="max-w-xl">
              <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">
                GitHub Repository URL
              </label>
              <p className="text-sm text-[#6b7280] mb-6">
                Enter a repository path (e.g., <span className="font-mono text-[#0070f3]">vercel/next.js</span>) to start a comprehensive configuration audit.
              </p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </div>
                  <Input
                    placeholder="owner/repo"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAudit()}
                    className="pl-10 h-11"
                  />
                </div>
                <Button
                  onClick={handleAudit}
                  disabled={!githubUrl.trim() || isLoading}
                  className="px-8 h-11"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Auditing...
                    </span>
                  ) : 'Run audit'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Results section */}
          {showResults && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AuditScore result={MOCK_AUDIT_RESULT} />

              {/* Issues to fix */}
              <div>
                <div className="flex items-center gap-3 mb-5 px-1">
                  <h2 className="text-xl font-semibold text-[#0a0a0a]">Issues to fix</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-[#fee2e2] text-[#ef4444] text-[10px] font-bold flex items-center justify-center border border-[#fecaca]">
                      {issueCount}
                    </span>
                    <span className="text-xs font-medium text-[#6b7280]">Potential risks found</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {MOCK_AUDIT_RESULT.criticalIssues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                  {MOCK_AUDIT_RESULT.warnings.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </div>

              {/* Passed checks */}
              <details className="group border border-[#e5e7eb] rounded-2xl bg-white overflow-hidden transition-all duration-300 open:shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-[#fafafa] transition-colors list-none">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#dcfce7] rounded-xl flex items-center justify-center border border-[#bbf7d0] text-[#166534]">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0a0a0a]">Passed checks</h3>
                      <p className="text-xs text-[#6b7280] mt-0.5">These configurations meet our excellence standards.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#10b981]">{MOCK_AUDIT_RESULT.passed.length} passed</span>
                    <svg className="w-5 h-5 text-[#9ca3af] group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </summary>
                <div className="p-6 pt-0 border-t border-[#f3f4f6]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                    {MOCK_AUDIT_RESULT.passed.map(check => (
                      <div key={check.id} className="flex items-start gap-3 p-4 bg-[#f9fafb] rounded-xl border border-[#f3f4f6]">
                        <div className="mt-0.5 h-4 w-4 bg-[#dcfce7] text-[#10b981] rounded-full flex items-center justify-center shrink-0">
                          <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0a0a0a] leading-tight">{check.title}</p>
                          <p className="text-xs text-[#6b7280] mt-1 line-clamp-1">{check.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
