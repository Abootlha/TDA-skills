import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error && "border-[var(--error)] focus-visible:ring-[var(--error)]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-[var(--error)] font-medium">{error}</span>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
