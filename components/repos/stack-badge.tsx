export interface StackBadgeProps {
  stack: string
  size?: 'sm' | 'md'
}

const stackColors: Record<string, string> = {
  'Node.js':       'bg-[#dcfce7] text-[#166534]',
  'Python':        'bg-[#fef9c3] text-[#854d0e]',
  'Go':            'bg-[#ccfbf1] text-[#115e59]',
  'Java':          'bg-[#fee2e2] text-[#991b1b]',
  'React Native':  'bg-[#dbeafe] text-[#1e40af]',
  'Rust':          'bg-[#ffedd5] text-[#9a3412]',
}

export function StackBadge({ stack, size = 'sm' }: StackBadgeProps) {
  const colorClass = stackColors[stack] ?? 'bg-[#f3f4f6] text-[#374151]'
  const sizeClass = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}>
      {stack}
    </span>
  )
}
