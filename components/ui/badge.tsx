import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]",
    success: "bg-[#d1fae5] text-[#10b981] border-[#bbf7d0]",
    warning: "bg-[#fef3c7] text-[#f59e0b] border-[#fde68a]",
    error: "bg-[#fee2e2] text-[#ef4444] border-[#fecaca]",
    info: "bg-[#dbeafe] text-[#0070f3] border-[#bfdbfe]"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
