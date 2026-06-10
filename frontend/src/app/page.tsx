import HeroSection from "@/components/home/HeroSection";
import FeatureCards from "@/components/home/FeatureCards";
import PopularCategories from "@/components/home/PopularCategories";
import QualificationsSection from "@/components/home/QualificationsSection";
import StatsRow from "@/components/home/StatsRow";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <PopularCategories />
      <QualificationsSection />
      <StatsRow />
    </>
  );
}
