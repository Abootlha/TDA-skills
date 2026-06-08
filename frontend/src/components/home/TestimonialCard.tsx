import * as React from "react"
import { Quote } from "lucide-react"
import { RatingStars } from "../ui/RatingStars"

export interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  rating: number;
  avatar?: string;
}

export function TestimonialCard({ quote, name, role, rating, avatar }: TestimonialCardProps) {
  return (
    <div className="flex flex-col p-8 bg-white rounded-2xl shadow-sm border border-[var(--border)] relative h-full">
      <Quote className="absolute top-8 right-8 text-[var(--surface)] w-12 h-12 opacity-50" />
      
      <RatingStars rating={rating} className="mb-6" />
      
      <p className="text-[var(--text-primary)] italic text-lg leading-relaxed flex-grow z-10 relative">
        "{quote}"
      </p>
      
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[var(--border)]">
        {avatar ? (
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover bg-[var(--surface)]" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-lg">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="font-bold text-[var(--text-primary)]">{name}</h4>
          <p className="text-sm text-[var(--text-secondary)]">{role}</p>
        </div>
      </div>
    </div>
  )
}
