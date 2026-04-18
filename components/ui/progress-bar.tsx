interface ProgressBarProps {
  value: number
  max?: number
  className?: string
}

function getColor(value: number, max: number) {
  const pct = (value / max) * 100
  if (pct >= 80) return 'bg-[#10b981]'
  if (pct >= 60) return 'bg-[#f59e0b]'
  return 'bg-[#ef4444]'
}

export function ProgressBar({ value, max = 100, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const colorClass = getColor(value, max)

  return (
    <div className={`w-full h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
