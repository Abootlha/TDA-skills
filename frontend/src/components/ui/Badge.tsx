import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[var(--secondary)] text-white",
    success: "bg-[#D1FAE5] text-[var(--success)]", // emerald-100 and emerald-500
    warning: "bg-[#FEF3C7] text-[var(--accent)]", // amber-100 and amber-500
    error: "bg-[#FEE2E2] text-[var(--error)]", // red-100 and red-500
    outline: "text-[var(--text-primary)] border border-[var(--border)]",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
