import NvqHeroSection from "@/components/nvq/NvqHeroSection";
import NvqSearchFilters from "@/components/nvq/NvqSearchFilters";
import NvqCategoryGrid from "@/components/nvq/NvqCategoryGrid";
import NvqExpertiseSection from "@/components/nvq/NvqExpertiseSection";

export default function Nvq() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <NvqHeroSection />
      <NvqSearchFilters />
      <NvqCategoryGrid />
      <NvqExpertiseSection />
    </div>
  );
}
