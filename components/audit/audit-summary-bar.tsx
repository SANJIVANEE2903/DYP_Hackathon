interface AuditSummaryBarProps {
  critical: number
  warnings: number
  passed: number
}

export function AuditSummaryBar({ critical, warnings, passed }: AuditSummaryBarProps) {
  const total = critical + warnings + passed
  if (total === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
          <span className="text-sm text-[#374151]">Critical</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
            <div className="h-full bg-[#ef4444] rounded-full" style={{ width: `${(critical / total) * 100}%` }} />
          </div>
          <span className="text-sm font-semibold text-[#ef4444] w-5 text-right">{critical}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
          <span className="text-sm text-[#374151]">Warnings</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
            <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: `${(warnings / total) * 100}%` }} />
          </div>
          <span className="text-sm font-semibold text-[#f59e0b] w-5 text-right">{warnings}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
          <span className="text-sm text-[#374151]">Passed</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
            <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${(passed / total) * 100}%` }} />
          </div>
          <span className="text-sm font-semibold text-[#10b981] w-5 text-right">{passed}</span>
        </div>
      </div>
    </div>
  )
}
