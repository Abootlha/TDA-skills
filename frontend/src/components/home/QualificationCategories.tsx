import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { nvqCategories } from '../../lib/data/nvqCategories';
import { ArrowRight } from 'lucide-react';

export default function QualificationCategories() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-primary mb-4">NVQ Qualifications</h2>
          <p className="text-lg text-primary/60 max-w-2xl mx-auto">
            Gain nationally recognized qualifications that demonstrate your competence
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {nvqCategories.map((category) => (
            <Card key={category.id} hover className="overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-primary to-primary-dark">
                <div className="absolute top-6 left-6">
                  <Badge variant="secondary">{category.tag}</Badge>
                </div>
              </div>
              <div className="p-8 flex flex-col gap-4">
                <h3 className="text-3xl font-black text-primary">{category.title}</h3>
                <p className="text-base text-primary/60 leading-relaxed">
                  {category.description}
                </p>
                <a href={`/nvq/${category.slug}`} className="mt-2">
                  <Button variant="outline" className="w-full group">
                    <span>Explore Qualifications</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
