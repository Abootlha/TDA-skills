"use client";

import { useState, useRef, useEffect } from "react";
import { Search, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { courses } from "@/lib/data/courses";
import { Course } from "@/lib/types/index";

export default function CourseSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Course[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = courses.filter((course) =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 relative" ref={searchRef}>
      <div className="relative flex items-center w-full h-16 rounded-full bg-white border border-gray-200 shadow-sm focus-within:shadow-md focus-within:border-[#001430]/20 transition-all px-4 overflow-visible z-30">
        <Search className="w-6 h-6 text-gray-400 ml-2" />
        <input
          type="text"
          placeholder="Search courses, certifications, or skills..."
          className="flex-1 h-full bg-transparent border-none outline-none px-4 text-gray-800 placeholder:text-gray-400 text-[16px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
        />
        <button className="h-10 px-8 rounded-full bg-[#001430] hover:bg-[#001f4d] text-white font-bold text-[15px] transition-colors">
          Search
        </button>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-40 max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="flex flex-col py-2">
              {results.map((course) => (
                <Link
                  href={`/courses/${course.slug}`}
                  key={course.id}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E5EEFF] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-6 h-6 text-[#2B6CB0]" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#001430] mb-1 group-hover:text-[#2B6CB0] transition-colors">
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium uppercase tracking-wider">
                        <span>{course.category}</span>
                        {course.level && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{course.level}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-[15px] font-bold text-[#001430]">
                      £{course.price.toFixed(2)}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#2B6CB0] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No courses found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
