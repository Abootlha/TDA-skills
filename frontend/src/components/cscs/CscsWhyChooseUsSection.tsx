import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
const imgTeamOfConstructionProfessionals = "/Team of construction professionals.png";
import { CheckCircle2, Clock, CreditCard, HeadphonesIcon } from "lucide-react";

export function CscsWhyChooseUsSection() {
    const features = [
        {
            icon: <CheckCircle2 className="w-[18px] h-[18px] text-[#001430]" />,
            title: "Lifetime Qualification",
            desc: "Your Level 1 Award never expires. Earn it once, use it for life."
        },
        {
            icon: <CreditCard className="w-[22px] h-[16px] text-[#001430]" />,
            title: "Instalments Available",
            desc: "Spread the cost at checkout via Klarna or PayPal."
        },
        {
            icon: <Clock className="w-[20px] h-[16px] text-[#001430]" />,
            title: "Fast Certification",
            desc: "Get your digital certificate in as little as 5 working days."
        },
        {
            icon: <HeadphonesIcon className="w-[16px] h-[20px] text-[#001430]" />,
            title: "Expert Support",
            desc: "Our team is here to help you every step of the way."
        }
    ];

    return (
        <section className="py-20 flex justify-center w-full bg-white relative overflow-hidden">
            {/* Slanted Background */}
            <div className="absolute top-0 bottom-0 left-[45%] lg:left-[63%] w-[100%] bg-[#FFBB16]/5 -skew-x-[15deg] origin-bottom-left z-0"></div>

            <div className="max-w-[1280px] w-full px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="rounded-[24px] overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] aspect-video relative">
                    <ImageWithFallback
                        src={imgTeamOfConstructionProfessionals}
                        alt="Team of construction professionals"
                        className="w-[100.7%] h-full absolute top-0 -left-[0.35%] object-cover max-w-none"
                    />
                </div>

                <div className="flex flex-col gap-10">
                    <h2 className="font-sans font-bold text-[36px] leading-[40px] text-[#001430]">
                        Why Choose TDA Skills?
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-12">
                        {features.map((feat, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="bg-[rgba(0,20,48,0.05)] w-12 h-12 rounded-[4px] flex items-center justify-center shrink-0">
                                    {feat.icon}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-sans font-bold text-[16px] leading-[24px] text-[#001430]">
                                        {feat.title}
                                    </h4>
                                    <p className="font-sans font-normal text-[14px] leading-[20px] text-[#43474f] max-w-[200px]">
                                        {feat.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
