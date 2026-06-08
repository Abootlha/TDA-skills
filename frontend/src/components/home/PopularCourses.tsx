import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { courses } from '@/lib/data/courses';
import { Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function PopularCourses() {
  const popularCourses = courses.slice(0, 3);

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex items-end justify-between mb-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-5xl font-black text-primary">Popular Courses</h2>
            <p className="text-lg text-primary/60">
              Explore our most sought-after training programmes
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline">View All Courses</Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {popularCourses.map((course: any) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-gradient-to-br from-primary to-primary-dark">
                {course.badge && (
                  <div className="absolute top-4 left-4">
                    <Badge variant={course.badgeColor as any}>{course.badge}</Badge>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-primary">{course.title}</h3>
                <p className="text-sm text-primary/60 line-clamp-2">{course.description}</p>

                <div className="flex flex-col gap-2 text-sm text-primary/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{course.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-400/20 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-primary/40 uppercase tracking-wide">From</span>
                    <span className="text-2xl font-black text-primary">£{course.price}</span>
                  </div>
                  <Button variant="primary">View Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
