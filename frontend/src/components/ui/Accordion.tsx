"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils/cn"

export interface AccordionProps {
  items: { title: string; content: React.ReactNode }[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border border-[var(--border)] rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between p-4 text-left font-medium text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {item.title}
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-[var(--text-secondary)] transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="p-4 pt-0 text-[var(--text-secondary)] text-sm leading-relaxed border-t border-[var(--border)] mt-2">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
