import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/Card"

export interface QualificationCardProps {
  category: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  courseCount: number;
}

export function QualificationCard({
  category, title, description, icon, courseCount
}: QualificationCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-all group border-[var(--border)] hover:border-[var(--primary)]">
      <CardHeader className="pb-2">
        <div className="w-12 h-12 rounded-lg bg-[#FFF0F0] text-[var(--primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
          {icon}
        </div>
        <h3 className="font-bold text-xl text-[var(--text-primary)]">{title}</h3>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-[var(--text-secondary)] text-sm mb-4">
          {description}
        </p>
        <div className="text-sm font-medium text-[var(--text-primary)] bg-[var(--surface)] inline-block px-3 py-1 rounded-md">
          {courseCount} Qualifications
        </div>
      </CardContent>
      
      <CardFooter>
        <Link 
          href={`/nvqs/${category}`}
          className="flex items-center text-[var(--primary)] font-semibold text-sm hover:underline"
        >
          View Qualifications
          <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  )
}
