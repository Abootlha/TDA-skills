import { Award, Users, BookOpen, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Industry Accredited',
    description: 'All our courses are fully accredited by leading construction industry bodies including CITB and CSCS.',
  },
  {
    icon: Users,
    title: 'Expert Instructors',
    description: 'Learn from experienced professionals with decades of hands-on industry experience.',
  },
  {
    icon: BookOpen,
    title: 'Flexible Learning',
    description: 'Choose from classroom, online, or blended learning options to suit your schedule.',
  },
  {
    icon: CheckCircle,
    title: 'High Pass Rates',
    description: 'Our proven teaching methods ensure a 98% success rate across all qualifications.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-primary mb-4">Why Choose TDA Skills?</h2>
          <p className="text-lg text-primary/60 max-w-2xl mx-auto">
            We're committed to delivering exceptional training that advances your career
          </p>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-primary">{feature.title}</h3>
                <p className="text-sm text-primary/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
