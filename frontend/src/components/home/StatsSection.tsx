const stats = [
  { value: '15,000+', label: 'Students Trained' },
  { value: '500+', label: 'Courses Delivered' },
  { value: '98%', label: 'Success Rate' },
  { value: '25+', label: 'Years Experience' },
];

export default function StatsSection() {
  return (
    <section className="bg-white py-20 border-b border-gray-400/20">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center gap-3 text-center">
              <div className="text-5xl font-black text-primary">{stat.value}</div>
              <div className="text-sm font-semibold text-primary/60 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
