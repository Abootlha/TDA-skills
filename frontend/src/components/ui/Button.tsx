import * as React from "react"
import { cn } from "@/lib/utils/cn"
import { Loader2 } from "lucide-react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg" | "icon"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none"
    
    const variants = {
      primary: "bg-[var(--primary)] text-white hover:bg-[#CC3529]",
      secondary: "bg-[var(--secondary)] text-white hover:bg-[#333333]",
      outline: "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[#FFF0F0]",
      ghost: "hover:bg-[var(--surface)] text-[var(--text-primary)]",
      danger: "bg-[var(--error)] text-white hover:bg-[#DC2626]",
    }

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg font-bold",
      icon: "h-10 w-10",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
