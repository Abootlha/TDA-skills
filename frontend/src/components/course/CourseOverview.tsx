import { Users, Award } from "lucide-react";

interface OverviewProps {
    whatIsIt: string[];
    whoShouldAttend: string;
    certification: string;
}

export function CourseOverview({ overview }: { overview: OverviewProps }) {
    return (
        <div className="flex flex-col gap-12">
            <div>
                <h2 className="font-sans font-bold text-[32px] text-[#001430] mb-6">What is the course?</h2>
                <div className="flex flex-col gap-4 text-lg text-gray-600 leading-relaxed">
                    {overview.whatIsIt.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-[#fff9e6] flex items-center justify-center mb-6">
                        <Users className="w-6 h-6 text-[#ffbb16]" />
                    </div>
                    <h3 className="font-bold text-[20px] text-[#001430] mb-4">Who should attend?</h3>
                    <p className="text-gray-600 leading-relaxed">{overview.whoShouldAttend}</p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-[#e5f0ff] flex items-center justify-center mb-6">
                        <Award className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="font-bold text-[20px] text-[#001430] mb-4">Certification</h3>
                    <p className="text-gray-600 leading-relaxed">{overview.certification}</p>
                </div>
            </div>
        </div>
    );
}
