import React from "react";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { mapBackendCourseToFrontend } from "@/lib/utils/courseMapper";
import { CourseHero } from "@/components/course/CourseHero";
import { CourseOverview } from "@/components/course/CourseOverview";
import { CourseSyllabus } from "@/components/course/CourseSyllabus";
import { CourseDates } from "@/components/course/CourseDates";
import { CourseSidebar } from "@/components/course/CourseSidebar";
import { CourseFAQs } from "@/components/course/CourseFAQs";
import { RelatedCourses } from "@/components/course/RelatedCourses";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Fetch course from backend
  const { data, error } = await api.get<any>(`/courses/${slug}`);
  
  if (error || !data) {
    console.error("Course fetch error:", error);
    notFound();
  }

  const course = mapBackendCourseToFrontend(data);

  return (
    <main className="min-h-screen bg-[#faf9fd]">
      {/* Hero Section */}
      <CourseHero course={course} />

      {/* Sticky Navigation */}
      <div className="sticky top-[80px] z-30 bg-[#001430] text-white shadow-md">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 overflow-x-auto whitespace-nowrap hide-scrollbar text-sm font-bold tracking-wider">
            <li>
              <a href="#overview" className="block py-4 border-b-4 border-[#ffbb16] text-white transition-colors uppercase">
                Course Overview
              </a>
            </li>
            <li>
              <a href="#syllabus" className="block py-4 border-b-4 border-transparent text-gray-400 hover:text-white transition-colors uppercase">
                Syllabus
              </a>
            </li>
            <li>
              <a href="#locations" className="block py-4 border-b-4 border-transparent text-gray-400 hover:text-white transition-colors uppercase">
                Locations & Dates
              </a>
            </li>
            <li>
              <a href="#faqs" className="block py-4 border-b-4 border-transparent text-gray-400 hover:text-white transition-colors uppercase">
                FAQs
              </a>
            </li>
            <li>
              <a href="#related" className="block py-4 border-b-4 border-transparent text-gray-400 hover:text-white transition-colors uppercase">
                Related Courses
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column - Main Details */}
          <div className="flex-1 min-w-0 flex flex-col gap-16">
            <div id="overview" className="scroll-mt-36">
              <CourseOverview overview={course.overview} />
            </div>

            <div id="syllabus" className="scroll-mt-36">
              <CourseSyllabus syllabus={course.syllabus} />
            </div>

            <div id="locations" className="scroll-mt-36">
              <CourseDates course={course} />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-[160px] flex flex-col gap-6">
              <CourseSidebar />
            </div>
          </div>
          
        </div>
      </div>

      {/* Related Courses Section */}
      <div id="related" className="bg-[#faf9fd] py-16 scroll-mt-32">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <RelatedCourses courses={course.relatedCourses} />
        </div>
      </div>

      {/* FAQs Section */}
      <div id="faqs" className="bg-white py-16 scroll-mt-32 border-t border-gray-100">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <CourseFAQs faqs={course.faqs} />
        </div>
      </div>

    </main>
  );
}
