import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils/cn"

export interface RatingStarsProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxStars?: number;
  size?: number;
}

export function RatingStars({ rating, maxStars = 5, size = 16, className, ...props }: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)} {...props}>
      {[...Array(maxStars)].map((_, i) => {
        const isFilled = i < Math.floor(rating);
        const isHalf = !isFilled && i < Math.ceil(rating);
        
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-gray-300 absolute inset-0"
              strokeWidth={2}
            />
            {(isFilled || isHalf) && (
              <Star
                size={size}
                className={cn(
                  "text-[var(--accent)] absolute inset-0",
                  isFilled ? "fill-[var(--accent)]" : "fill-[var(--accent)] clip-half"
                )}
                strokeWidth={2}
                style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
