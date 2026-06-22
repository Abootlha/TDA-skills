import { CoursesHero } from "@/components/courses/CoursesHero";
import { CoursesSidebar } from "@/components/courses/CoursesSidebar";
import { CoursesList } from "@/components/courses/CoursesList";
import { CoursesFeatures } from "@/components/courses/CoursesFeatures";
import { api } from "@/lib/api";

export default async function CoursesPage() {
  const { data } = await api.get<any>('/courses');
  const courses = data?.courses || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <CoursesHero />
      
      <div className="max-w-[1280px] w-full mx-auto px-[32px] py-[80px] flex gap-[48px] items-start relative">
        <CoursesSidebar />
        <CoursesList courses={courses} />
      </div>

      <CoursesFeatures />
    </div>
  );
}
