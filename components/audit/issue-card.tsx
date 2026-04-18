import { AuditIssue } from '@/types'
import { Button } from '@/components/ui/button'

interface IssueCardProps {
  issue: AuditIssue
}

export function IssueCard({ issue }: IssueCardProps) {
  const isCritical = issue.severity === 'critical'

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 mb-3 flex items-start gap-4 hover:border-[#d1d5db] transition-colors group">
      {/* Severity dot */}
      <div className="mt-1.5 shrink-0">
        <div
          className={`w-2.5 h-2.5 rounded-full ring-4 ${
            isCritical ? 'bg-[#ef4444] ring-[#fee2e2]' : 'bg-[#f59e0b] ring-[#fef3c7]'
          }`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <h4 className="font-semibold text-sm text-[#0a0a0a] leading-tight">{issue.title}</h4>
        <p className="text-xs text-[#6b7280] mt-1 line-clamp-2">{issue.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {issue.fixable && (
          <Button className="h-8 px-4 text-xs shadow-sm">
            Fix issue
          </Button>
        )}
        <Button variant="ghost" className="h-8 px-3 text-xs">
          Docs
        </Button>
      </div>
    </div>
  )
}
