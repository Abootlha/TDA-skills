export function CscsHowItWorksSection() {
    const steps = [
        { num: "01", title: "Choose & Book\nOnline", desc: "Pick your package and\ncomplete your booking\nin minutes.", isFullPackage: false },
        { num: "02", title: "Attend or Study", desc: "Join live Zoom session\nor study at your own\npace.", isFullPackage: false },
        { num: "03", title: "Pass Assessment", desc: "Complete the\nassessment to achieve\nyour Level 1 Award.", isFullPackage: false },
        { num: "04", title: "CITB Test Booked", desc: "We schedule your\nHS&E test on your\nbehalf.", isFullPackage: true },
        { num: "05", title: "Certificate Issued", desc: "Your certificate is\nissued within 5–7\nworking days.", isFullPackage: false },
        { num: "06", title: "CSCS Card\nApplied", desc: "Our team submits your\napplication to CSCS for\nyou.", isFullPackage: true },
    ];

    return (
        <section className="py-20 flex justify-center w-full bg-white">
            <div className="max-w-[1280px] w-full px-8 flex flex-col gap-16">
                <div>
                    <h2 className="font-sans font-bold text-[36px] text-[#001430] leading-[40px]">
                        How It Works
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                    {steps.map((step, i) => (
                        <div key={i} className="bg-white rounded-[24px] shadow-sm p-6 flex flex-col items-start border border-transparent hover:border-[#c4c6d0] transition-colors h-[244px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
                            <span className="font-sans font-extrabold text-[36px] leading-[40px] text-[rgba(196,198,208,0.3)] mb-2">
                                {step.num}
                            </span>
                            <h4 className="font-sans font-bold text-[16px] leading-[24px] text-[#001430] whitespace-pre-line mb-1">
                                {step.title}
                            </h4>
                            {step.isFullPackage && (
                                <span className="font-sans font-semibold text-[12px] leading-[19.5px] text-[#7c5800] mb-1">
                                    Full Package Only
                                </span>
                            )}
                            <p className="font-sans font-normal text-[12px] leading-[19.5px] text-[#43474f] whitespace-pre-line mt-1">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
