'use client'

import { AuditResult } from '@/types'
import { ScoreRing } from '@/components/ui/score-ring'
import { AuditSummaryBar } from './audit-summary-bar'

interface AuditScoreProps {
  result: AuditResult
}

function getScoreLabel(score: number) {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Good'
  if (score >= 60) return 'Fair'
  return 'Poor'
}

export function AuditScore({ result }: AuditScoreProps) {
  const issueCount = result.criticalIssues.length + result.warnings.length
  const label = getScoreLabel(result.score)

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-8">
      {/* Repo header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-[#0a0a0a]">{result.repoName}</h2>
          <a
            href={`https://github.com/${result.repoName}`}
            className="text-sm text-[#0070f3] hover:text-[#0060df] mt-0.5 inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          result.score >= 80 ? 'bg-[#dcfce7] text-[#166534]' :
          result.score >= 60 ? 'bg-[#fef9c3] text-[#854d0e]' :
          'bg-[#fee2e2] text-[#991b1b]'
        }`}>
          {label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Score ring */}
        <div className="flex flex-col items-center gap-3">
          <ScoreRing score={result.score} size={140} strokeWidth={10} />
          <p className="text-sm text-[#6b7280] text-center">
            {label} — {issueCount} issue{issueCount !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Summary bar */}
        <div className="md:col-span-2">
          <AuditSummaryBar
            critical={result.criticalIssues.length}
            warnings={result.warnings.length}
            passed={result.passed.length}
          />
        </div>
      </div>
    </div>
  )
}
