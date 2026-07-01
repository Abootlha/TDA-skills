import { CoursesHero } from "@/components/courses/CoursesHero";
import { CoursesSidebar } from "@/components/courses/CoursesSidebar";
import { CoursesList } from "@/components/courses/CoursesList";
import { CoursesFeatures } from "@/components/courses/CoursesFeatures";
import { api } from "@/lib/api";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string, category?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page || "1";
  const category = resolvedSearchParams.category || "";
  
  // Fetch courses and categories in parallel
  const [coursesRes, categoriesRes] = await Promise.all([
    api.get<any>(`/courses?page=${page}&limit=10${category ? `&category=${category}` : ''}`),
    api.get<any>('/courses/categories').catch(() => ({ data: [] }))
  ]);
  
  const data = coursesRes.data;
  const categories = categoriesRes.data?.categories || [];
  
  const courses = data?.courses || [];
  const pagination = {
    total: data?.total || courses.length,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.total_pages || 1,
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <CoursesHero />
      
      <div className="max-w-[1280px] w-full mx-auto px-4 lg:px-[32px] py-10 lg:py-[80px] flex flex-col lg:flex-row gap-8 lg:gap-[48px] items-start relative">
        <CoursesSidebar courses={courses} categories={categories} currentCategory={category} />
        <CoursesList courses={courses} pagination={pagination} />
      </div>

      <CoursesFeatures />
    </div>
  );
}
