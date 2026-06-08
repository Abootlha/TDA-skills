import * as React from "react"

export interface StatBadgeProps {
  icon: React.ReactNode;
  number: string;
  label: string;
}

export function StatBadge({ icon, number, label }: StatBadgeProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-[var(--border)] text-center">
      <div className="w-14 h-14 bg-[#FFF0F0] text-[var(--primary)] rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-1">{number}</h3>
      <p className="text-[var(--text-secondary)] font-medium">{label}</p>
    </div>
  )
}
