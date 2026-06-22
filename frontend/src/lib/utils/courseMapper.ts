import { CourseDetail } from "../data/courseDetails";

/**
 * Maps a backend Course JSON object to the CourseDetail interface used by frontend components.
 */
export function mapBackendCourseToFrontend(course: Record<string, any>): CourseDetail {
    const getStr = (val: any) => (val && typeof val === 'object' ? val.String : val) || "";

    return {
        id: course.id,
        title: getStr(course.name),
        slug: getStr(course.slug),
        price: course.price,
        originalPrice: course.sale_price, // Or vice-versa, depending on your logic
        deposit: course.deposit,
        description: getStr(course.description) || getStr(course.short_description) || "",
        category: getStr(course.category),
        reviewsCount: course.reviews_count || 0,
        rating: course.rating || 0,
        badges: Array.isArray(course.badges) ? course.badges : [],
        quickStats: {
            duration: course.quick_stats?.duration || getStr(course.duration) || "",
            delivery: course.quick_stats?.delivery || "",
            nextDate: course.quick_stats?.nextDate || "",
            grant: course.quick_stats?.grant || ""
        },
        included: Array.isArray(course.included) ? course.included : [],
        overview: {
            whatIsIt: Array.isArray(course.overview?.whatIsIt) ? course.overview.whatIsIt : [course.overview?.whatIsIt || ""].filter(Boolean),
            whoShouldAttend: course.overview?.whoShouldAttend || "",
            certification: course.overview?.certification || ""
        },
        syllabus: Array.isArray(course.syllabus) ? course.syllabus : [],
        upcomingDates: Array.isArray(course.available_dates) ? course.available_dates : [],
        faqs: Array.isArray(course.faq) ? course.faq : [],
        relatedCourses: [] // We can handle this separately or if the backend returns fully populated related courses
    };
}
