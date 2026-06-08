export interface CourseDetail {
    id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice?: number;
    deposit?: number;
    description: string;
    category: string;
    reviewsCount: number;
    rating: number;
    badges: { text: string; color: string }[];
    quickStats: {
        duration: string;
        delivery: string;
        nextDate: string;
        grant: string;
    };
    included: string[];
    overview: {
        whatIsIt: string[];
        whoShouldAttend: string;
        certification: string;
    };
    syllabus: { title: string; content: string }[];
    upcomingDates: {
        id: string;
        date: string;
        durationText: string;
        location: string;
        venue: string;
        seatsStatus: "Available" | "Limited" | "Sold Out";
        seatsText: string;
        seatsColor: string;
    }[];
    faqs: { question: string; answer: string }[];
    relatedCourses: {
        id: string;
        title: string;
        slug: string;
        description: string;
        price: number;
        image: string;
        badge?: string;
    }[];
}

export const courseDetailsMock: Record<string, CourseDetail> = {
    "smsts-course": {
        id: "1",
        title: "SMSTS - Site Management Safety Training Scheme",
        slug: "smsts-course",
        price: 495,
        originalPrice: 595,
        deposit: 100,
        description: "Gain the essential knowledge required to manage a construction site safely, efficiently, and in full compliance with current UK health and safety legislation.",
        category: "Management (SMSTS)",
        reviewsCount: 1240,
        rating: 5,
        badges: [
            { text: "CITB ACCREDITED", color: "bg-[#FFF9E6] text-[#FFB800]" }
        ],
        quickStats: {
            duration: "5 Days",
            delivery: "Classroom",
            nextDate: "Oct 12",
            grant: "Available"
        },
        included: [
            "CITB Publication GE700 Included",
            "5-Year Nationally Recognized Certificate",
            "Full Lunch & Refreshments Provided"
        ],
        overview: {
            whatIsIt: [
                "The Site Management Safety Training Scheme (SMSTS) is a five-day training program designed by CITB for project managers, site managers, and supervisors, as well as proprietors of small-to-medium-sized companies.",
                "It is widely considered one of the most essential qualifications for anybody looking to work in site management. The course covers all relevant legislation affecting safe working in the building, construction, and civil engineering industries."
            ],
            whoShouldAttend: "Ideally suited for Project Managers, Site Managers, and Site Supervisors who have responsibilities for planning, organizing, and controlling construction work.",
            certification: "Upon successful completion, you will receive the CITB SMSTS Certificate, which is valid for 5 years and recognized nationwide by major contractors."
        },
        syllabus: [
            {
                title: "The Health and Safety at Work Act",
                content: "Deep dive into the 1974 Act, responsibilities of employers and employees, and the powers of the Health and Safety Executive (HSE)."
            },
            {
                title: "Risk Assessment & Method Statements (RAMS)",
                content: "Learn how to conduct effective risk assessments and develop robust method statements for high-risk activities."
            },
            {
                title: "Excavations, Scaffolding and Working at Height",
                content: "Understand the regulations and safe practices required for working at height, erecting scaffolding, and conducting excavation work."
            },
            {
                title: "Demolition, Confined Spaces and Site Setup",
                content: "Covering the critical safety requirements for demolition projects, confined space entry, and general site setup logistics."
            }
        ],
        upcomingDates: [
            {
                id: "d1",
                date: "Oct 12 - Oct 16, 2025",
                durationText: "5 DAY COURSE",
                location: "London Stratford",
                venue: "TDA Training Centre E15",
                seatsStatus: "Limited",
                seatsText: "4 Seats Left",
                seatsColor: "text-green-600"
            },
            {
                id: "d2",
                date: "Oct 26 - Oct 30, 2025",
                durationText: "5 DAY COURSE",
                location: "Birmingham Central",
                venue: "Apex Plaza B1",
                seatsStatus: "Available",
                seatsText: "12 SEATS REMAINING",
                seatsColor: "text-gray-600"
            },
            {
                id: "d3",
                date: "Nov 02 - Nov 06, 2025",
                durationText: "ONLINE / ZOOM",
                location: "Virtual Classroom",
                venue: "Nationwide access",
                seatsStatus: "Available",
                seatsText: "HIGH DEMAND",
                seatsColor: "text-gray-600"
            }
        ],
        faqs: [
            {
                question: "What happens if I fail the exam?",
                answer: "Candidates who fail the exam but pass the core course elements can attend a re-sit on another course within 90 days. We provide additional support for any re-sits to ensure you pass the second time."
            },
            {
                question: "Is the CITB grant automated?",
                answer: "Yes, as an ATO (Approved Training Organisation), TDA Skills will upload your results directly to the CITB system. If you've provided your levy number, the grant payment is triggered automatically to your account."
            },
            {
                question: "Can I take this course online?",
                answer: "Yes, CITB currently permits the SMSTS course to be delivered via 'Remote Training'. This is done via Zoom in a live, tutor-led environment that mirrors the classroom experience."
            }
        ],
        relatedCourses: [
            {
                id: "r1",
                title: "SSSTS Site Supervisor",
                slug: "sssts-course",
                description: "The 2-day essential course for working supervisors and team leaders.",
                price: 245,
                image: "/images/sssts-course.png",
                badge: "TOP SELLER"
            },
            {
                id: "r2",
                title: "SMSTS Refresher",
                slug: "smsts-refresher",
                description: "Maintain your qualification with this intensive 2-day update course.",
                price: 295,
                image: "/images/smsts-course.png" // using existing mock image
            },
            {
                id: "r3",
                title: "First Aid at Work",
                slug: "first-aid",
                description: "Comprehensive 3-day medical training specifically for construction.",
                price: 185,
                image: "/images/health-safety.png" // using existing mock image
            }
        ]
    },
    "online-tutor-led": {
        id: "cscs-1",
        title: "Online Tutor-Led CSCS Training",
        slug: "online-tutor-led",
        price: 99,
        description: "Get your CSCS training completed online with a live tutor via Teams/Zoom.",
        category: "CSCS Cards",
        reviewsCount: 412,
        rating: 4.8,
        badges: [
            { text: "LIVE SESSION", color: "bg-[#FFF9E6] text-[#FFB800]" }
        ],
        quickStats: {
            duration: "1 Day (9 AM - 2 PM)",
            delivery: "Online (Teams/Zoom)",
            nextDate: "Every Monday & Wednesday",
            grant: "N/A"
        },
        included: [
            "Live tutor via Teams/Zoom",
            "Assessment at the end of the session",
            "Certificate in 5–7 working days",
            "Lifetime valid qualification"
        ],
        overview: {
            whatIsIt: [
                "This online tutor-led course provides everything you need to earn your qualification in a single day.",
                "Join a live virtual classroom, engage with expert instructors, and take your assessment immediately following the session."
            ],
            whoShouldAttend: "Individuals looking to obtain their required qualification quickly with the guidance of a professional tutor.",
            certification: "You will receive a digital certificate within 5-7 working days after successfully passing the assessment."
        },
        syllabus: [
            { title: "Health and Safety Principles", content: "Understanding basic health and safety principles on a construction site." },
            { title: "Hazard Identification", content: "How to identify and avoid common hazards and risks." }
        ],
        upcomingDates: [
            {
                id: "d1", date: "Next Available Session", durationText: "1 DAY", location: "Online / Zoom", venue: "Virtual Classroom", seatsStatus: "Available", seatsText: "Open Booking", seatsColor: "text-green-600"
            }
        ],
        faqs: [
            { question: "Do I need a webcam?", answer: "Yes, you must have a working webcam and microphone to participate and take the assessment." }
        ],
        relatedCourses: []
    },
    "green-cscs-card-package": {
        id: "cscs-2",
        title: "Green CSCS Card Package (End-to-End)",
        slug: "green-cscs-card-package",
        price: 199,
        description: "Our most popular done-for-you service. We handle your training, book your CITB test, and apply for your CSCS card.",
        category: "CSCS Cards",
        reviewsCount: 2540,
        rating: 5.0,
        badges: [
            { text: "MOST POPULAR", color: "bg-[#FFF9E6] text-[#FFB800]" },
            { text: "DONE FOR YOU", color: "bg-[#E6F0FF] text-[#0066FF]" }
        ],
        quickStats: {
            duration: "Self-Paced / Flexible",
            delivery: "Hybrid",
            nextDate: "Start Immediately",
            grant: "N/A"
        },
        included: [
            "Level 1 Award (Tutor or Self-Paced)",
            "CITB HS&E Test booked by our team",
            "CSCS card application managed",
            "Dedicated personal support team"
        ],
        overview: {
            whatIsIt: [
                "The ultimate hassle-free route to getting your Green Labourer CSCS Card. This package includes everything from the mandatory Level 1 course to the final card application.",
                "Once you enroll, our dedicated support team takes over the admin work, booking your CITB test at a local center and applying for your card as soon as you pass."
            ],
            whoShouldAttend: "Anyone who needs a Green CSCS card to get on site but wants to avoid the hassle of booking tests and managing applications themselves.",
            certification: "You will receive your Level 1 Certificate, and your physical Green CSCS Card will be mailed to your address."
        },
        syllabus: [
            { title: "Level 1 Health & Safety", content: "Complete your Level 1 Award via self-paced e-learning or a tutor-led session." },
            { title: "CITB HS&E Test Prep", content: "Access revision materials to prepare for your touch-screen test." }
        ],
        upcomingDates: [
            {
                id: "d1", date: "Start Today", durationText: "FLEXIBLE", location: "Online & Local Test Centre", venue: "Nationwide", seatsStatus: "Available", seatsText: "Immediate Access", seatsColor: "text-green-600"
            }
        ],
        faqs: [
            { question: "How long does the whole process take?", answer: "Usually 2-3 weeks depending on test center availability." },
            { question: "Where do I take the CITB test?", answer: "We will book it at the closest Pearson VUE test center to your home postcode." }
        ],
        relatedCourses: []
    },
    "online-self-paced": {
        id: "cscs-3",
        title: "Online Self-Paced Course",
        slug: "online-self-paced",
        price: 99,
        description: "Study anytime, anywhere with our flexible online e-learning portal.",
        category: "CSCS Cards",
        reviewsCount: 890,
        rating: 4.6,
        badges: [
            { text: "FLEXIBLE START", color: "bg-[#FFF9E6] text-[#FFB800]" }
        ],
        quickStats: {
            duration: "Self-Paced (approx. 4-6 hours)",
            delivery: "E-Learning",
            nextDate: "Start Immediately",
            grant: "N/A"
        },
        included: [
            "Study anytime, anywhere",
            "Online assessment when ready",
            "Certificate in 5–7 working days",
            "Great for busy schedules"
        ],
        overview: {
            whatIsIt: [
                "Our self-paced e-learning platform allows you to study the required material at your own convenience.",
                "Take the assessment online whenever you feel ready, 24/7."
            ],
            whoShouldAttend: "Individuals with busy schedules who prefer to study in their own time rather than attending a scheduled class.",
            certification: "You will receive a digital certificate within 5-7 working days after successfully passing the online assessment."
        },
        syllabus: [
            { title: "Self-Paced Modules", content: "Access to interactive slides, videos, and quizzes covering all required health and safety topics." }
        ],
        upcomingDates: [
            {
                id: "d1", date: "Start Today", durationText: "SELF-PACED", location: "Online Portal", venue: "Access 24/7", seatsStatus: "Available", seatsText: "Immediate Access", seatsColor: "text-green-600"
            }
        ],
        faqs: [
            { question: "How long do I have to complete the course?", answer: "You have 12 months of access to the portal to complete your training." }
        ],
        relatedCourses: []
    }
};
