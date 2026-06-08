import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] ring-offset-white placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-y",
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
Textarea.displayName = "Textarea"

export { Textarea }
