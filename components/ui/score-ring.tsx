interface ScoreRingProps {
  score: number
  max?: number
  size?: number
  strokeWidth?: number
}

export function ScoreRing({
  score,
  max = 100,
  size = 120,
  strokeWidth = 8,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / max) * circumference

  let color = '#10b981'
  if (score < 50) color = '#ef4444'
  else if (score < 80) color = '#f59e0b'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold text-[#0a0a0a] leading-none">{score}</span>
        <span className="text-xs text-[#9ca3af] mt-0.5">/100</span>
      </div>
    </div>
  )
}
