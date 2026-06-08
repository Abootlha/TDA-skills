import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface StepIndicatorProps {
  steps: string[];
  currentStep: number; // 0-indexed
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--border)] -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--primary)] -z-10 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300",
                  isCompleted ? "bg-[var(--primary)] text-white" : 
                  isCurrent ? "bg-white border-2 border-[var(--primary)] text-[var(--primary)]" : 
                  "bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--text-secondary)]"
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span 
                className={cn(
                  "text-xs md:text-sm font-medium absolute top-10 whitespace-nowrap",
                  isCurrent ? "text-[var(--primary)]" : "text-[var(--text-secondary)]"
                )}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
