interface FAQ {
    question: string;
    answer: string;
}

export function CourseFAQs({ faqs }: { faqs: FAQ[] }) {
    return (
        <div className="flex flex-col items-center">
            <h2 className="font-sans font-bold text-[36px] text-[#001430] mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="flex flex-col gap-10 w-full">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                        <h3 className="font-bold text-[18px] text-[#002855]">{faq.question}</h3>
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
