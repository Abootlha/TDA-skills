import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface ProgressRingProps extends React.SVGProps<SVGSVGElement> {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  ...props
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        {...props}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-[var(--surface)]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-[var(--primary)] transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-[var(--text-primary)]">{value}%</span>
      </div>
    </div>
  )
}
