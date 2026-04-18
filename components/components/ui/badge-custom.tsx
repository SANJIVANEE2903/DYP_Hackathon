interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'blue';
  children: React.ReactNode;
}

const variants = {
  default: 'bg-[#f3f4f6] text-[#6b7280]',
  success: 'bg-[#d1fae5] text-[#059669]',
  warning: 'bg-[#fef3c7] text-[#b45309]',
  error: 'bg-[#fee2e2] text-[#991b1b]',
  info: 'bg-[#dbeafe] text-[#1e40af]',
  blue: 'bg-[#dbeafe] text-[#0070f3]',
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
