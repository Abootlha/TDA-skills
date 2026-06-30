import { CscsHeroSection } from "@/components/cscs/CscsHeroSection";
import { CpcsPackagesSection } from "@/components/cscs/CpcsPackagesSection";
import { CscsWhyChooseUsSection } from "@/components/cscs/CscsWhyChooseUsSection";
import { CscsHowItWorksSection } from "@/components/cscs/CscsHowitWorksSection";
import { CscsFaqSection } from "@/components/cscs/CscsFaqSection";
import { CscsCtaSection } from "@/components/cscs/CscsCtaSection";

const CPCS_FAQS = [
    { 
        q: "What does CPCS stand for?", 
        a: "CPCS stands for Construction Plant Competence Scheme. It is the most widely recognised card scheme for plant operators in the UK construction industry." 
    },
    { 
        q: "What's the difference between the Red and Blue CPCS card?", 
        a: "The Red Trained Operator card is for operators who have passed their theory and practical tests but do not yet hold an NVQ. The Blue Competent Operator card requires you to have achieved a relevant NVQ Level 2 in plant operations." 
    },
    { 
        q: "Where can I take my CPCS tests?", 
        a: "CPCS tests are conducted at accredited test centres. Our team will book you into the nearest accredited testing centre relative to your postcode." 
    },
    { 
        q: "How long does a CPCS card remain valid?", 
        a: "A Red Trained Operator card is valid for 2 years and is non-renewable. A Blue Competent Operator card is valid for 5 years and can be renewed upon meeting the scheme requirements." 
    }
];

export default function CpcsPage() {
    return (
        <main className="flex flex-col w-full min-h-screen bg-white animate-in fade-in duration-300">
            <CscsHeroSection 
                badgeText="CPCS Training & Certification"
                title={
                    <>
                        Get Your CPCS<br />
                        Card - <span className="text-[#ffbb16]">Fast & Easy</span>
                    </>
                }
                subtitle={
                    <>
                        CPCS plant operator training and card services. Choose TDA Skills<br className="hidden sm:inline" />
                        for end-to-end support including technical training, testing, and card application management.
                    </>
                }
                primaryButtonText="Book CPCS Card"
                secondaryButtonText="View CPCS Training"
            />
            <CpcsPackagesSection />
            <CscsWhyChooseUsSection />
            <CscsHowItWorksSection />
            <CscsFaqSection 
                title="CPCS FAQ" 
                description="Find answers to common questions about the Construction Plant Competence Scheme (CPCS) qualifications." 
                faqs={CPCS_FAQS}
            />
            <CscsCtaSection />
        </main>
    );
}
