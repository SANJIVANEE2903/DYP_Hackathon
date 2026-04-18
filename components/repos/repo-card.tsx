'use client'

import Link from 'next/link'
import { Repository } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface RepoCardProps {
  repo: Repository
}

function getScoreVariant(score: number): 'success' | 'warning' | 'error' {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'error'
}

function getProgressColor(score: number) {
  if (score >= 80) return 'bg-[#10b981]'
  if (score >= 60) return 'bg-[#f59e0b]'
  return 'bg-[#ef4444]'
}

export function RepoCard({ repo }: RepoCardProps) {
  const scoreVariant = getScoreVariant(repo.score)

  return (
    <Card className="p-5 hover:border-[#d1d5db] transition-colors group">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[#0a0a0a] text-sm truncate">{repo.name}</h3>
            <Badge variant={repo.isPrivate ? 'default' : 'success'} className="text-[10px] h-4.5 px-1.5 font-normal">
              {repo.isPrivate ? 'Private' : 'Public'}
            </Badge>
          </div>
          <p className="text-xs text-[#9ca3af]">{repo.org}</p>
        </div>
        <Badge variant="info" className="text-[10px] h-5 px-2 font-medium">
          {repo.stack}
        </Badge>
      </div>

      {/* Score bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#6b7280]">Health score</span>
          <span className={`text-sm font-bold ${
            scoreVariant === 'success' ? 'text-[#10b981]' :
            scoreVariant === 'warning' ? 'text-[#f59e0b]' :
            'text-[#ef4444]'
          }`}>
            {repo.score}/100
          </span>
        </div>
        <div className="w-full h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${getProgressColor(repo.score)}`}
            style={{ width: `${repo.score}%` }}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[10px] text-[#9ca3af]">Updated {repo.updatedAt}</span>
        <div className="flex items-center gap-2">
          <a
            href={`https://github.com/${repo.org}/${repo.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9ca3af] hover:text-[#0a0a0a] transition-colors"
            title="Open in GitHub"
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02-.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
          <Button variant="secondary" className="h-8 px-3 text-xs" asChild>
            <Link href={`/dashboard/audit/${repo.id}`}>
              View details
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
