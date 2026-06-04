import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I book a home service with your company?",
    answer: "You can easily book a service by filling out our online booking form or contacting our customer support. We'll assist you in selecting the right professional for your needs."
  },
  {
    question: "What types of services do you offer?",
    answer: "We offer a wide range of services including assembly, mounting, moving, cleaning, and general home repairs."
  },
  {
    question: "How can I track my booking?",
    answer: "Once booked, you can track your service status directly from your dashboard where you will see real-time updates."
  },
  {
    question: "What are your payment and billing options?",
    answer: "We accept all major credit cards and secure online payments. You are only charged once the service is successfully completed."
  }
];

const QuestionSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16 items-start font-sans">
      {/* Left Column */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <h3 className="font-bold tracking-widest uppercase mb-4 text-[13px]" style={{ color: "var(--red)" }}>
          SOME IMPORTANT FAQ'S
        </h3>
        <h2 className="text-3xl md:text-[42px] leading-[1.1] font-black mb-6" style={{ color: "var(--text)" }}>
          Frequently Asked Questions About Our Services
        </h2>
        <p className="text-[14.5px] leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
          Find answers to the most common questions our clients have about bookings, 
          pricing, provider verification, and more. We're here to ensure your 
          experience is smooth and stress-free.
        </p>
        <div>
          <button 
            className="text-white text-[14px] font-bold py-3.5 px-8 rounded transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md cursor-pointer"
            style={{ background: "var(--red)" }}
          >
            Have Any Questions
          </button>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="flex flex-col rounded-sm overflow-hidden border shadow-sm transition-all"
              style={{ borderColor: "var(--border)" }}
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 cursor-pointer transition-colors"
                style={{ 
                  background: isOpen ? "var(--red)" : "var(--surface)",
                  color: isOpen ? "white" : "var(--text)"
                }}
              >
                <span className="text-[15.5px] font-bold text-left">{`Q: ${faq.question}`}</span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] border-t" : "max-h-0"}`}
                style={{ 
                  background: "var(--surface)", 
                  borderColor: isOpen ? "rgba(0,0,0,0.05)" : "transparent"
                }}
              >
                <div className="p-6 text-[14.5px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {`A: ${faq.answer}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QuestionSection;
