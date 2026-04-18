import Link from 'next/link';
import { Repository } from '@/types';
import { StackBadge } from './stack-badge';

interface RepoCardProps {
  repo: Repository;
}

export function RepoCard({ repo }: RepoCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#10b981]';
    if (score >= 60) return 'text-[#f59e0b]';
    return 'text-[#ef4444]';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-[#10b981]';
    if (score >= 60) return 'bg-[#f59e0b]';
    return 'bg-[#ef4444]';
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 hover:border-[#d1d5db] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-[#0a0a0a]">{repo.name}</p>
          <p className="text-sm text-[#9ca3af]">{repo.org}</p>
        </div>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#f3f4f6] text-[#6b7280]">
          {repo.isPrivate ? 'Private' : 'Public'}
        </span>
      </div>

      <div className="mb-3">
        <StackBadge stack={repo.stack} />
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-[#6b7280]">Health Score</span>
          <span className={`text-sm font-semibold ${getScoreColor(repo.score)}`}>{repo.score}/100</span>
        </div>
        <div className="w-full bg-[#e5e7eb] rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressColor(repo.score)}`}
            style={{ width: `${repo.score}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-[#9ca3af] mb-4">Updated {repo.updatedAt}</p>

      <div className="flex gap-2">
        <Link
          href={`/dashboard/audit`}
          className="flex-1 text-center px-3 py-2 text-sm font-medium text-[#0070f3] hover:bg-[#f0f9ff] rounded-lg transition-colors"
        >
          View audit
        </Link>
        <a
          href={`https://github.com/${repo.org}/${repo.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-3 py-2 text-sm font-medium text-[#6b7280] hover:bg-[#f3f4f6] rounded-lg transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
