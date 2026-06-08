import { CscsHeroSection } from "@/components/cscs/CscsHeroSection";
import { CscsPackagesSection } from "@/components/cscs/CscsPackagesSection";
import { CscsWhyChooseUsSection } from "@/components/cscs/CscsWhyChooseUsSection";
import { CscsHowItWorksSection } from "@/components/cscs/CscsHowitWorksSection";
import { CscsFaqSection } from "@/components/cscs/CscsFaqSection";
import { CscsCtaSection } from "@/components/cscs/CscsCtaSection";

export default function CscsPage() {
    return (
        <main className="flex flex-col w-full min-h-screen bg-white">
            <CscsHeroSection />
            <CscsPackagesSection />
            <CscsWhyChooseUsSection />
            <CscsHowItWorksSection />
            <CscsFaqSection />
            <CscsCtaSection />
        </main>
    );
}
