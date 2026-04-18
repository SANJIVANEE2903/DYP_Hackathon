import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button"
    
    const variants = {
      primary: "bg-[#0070f3] text-white hover:bg-[#0060df] rounded-lg px-4 py-2 text-sm font-medium transition-colors inline-flex items-center justify-center",
      secondary: "bg-white border border-[#e5e7eb] text-[#374151] hover:bg-[#fafafa] rounded-lg px-4 py-2 text-sm font-medium transition-colors inline-flex items-center justify-center",
      ghost: "text-[#6b7280] hover:text-[#0a0a0a] hover:bg-[#f3f4f6] rounded-md px-3 py-1.5 text-sm transition-colors inline-flex items-center justify-center",
      danger: "bg-[#ef4444] text-white hover:bg-[#dc2626] rounded-lg px-4 py-2 text-sm font-medium transition-colors inline-flex items-center justify-center"
    }

    return (
      <Component
        className={cn(variants[variant], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
