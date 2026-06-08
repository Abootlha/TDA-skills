import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <select
          className={cn(
            "flex h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] ring-offset-white placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error && "border-[var(--error)] focus-visible:ring-[var(--error)]",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-[var(--error)] font-medium">{error}</span>}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
