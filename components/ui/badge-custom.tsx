interface BadgeCustomProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  children: React.ReactNode
}

const variantStyles = {
  default: 'bg-blue-100 text-blue-800 border border-blue-200',
  success: 'bg-green-100 text-green-800 border border-green-200',
  warning: 'bg-amber-100 text-amber-800 border border-amber-200',
  error: 'bg-red-100 text-red-800 border border-red-200',
  info: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
}

export function BadgeCustom({
  variant = 'default',
  children,
}: BadgeCustomProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}
