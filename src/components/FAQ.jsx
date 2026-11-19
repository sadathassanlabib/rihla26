
"use client";

import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";

const faqCategories = [
  {
    title: "Registration",
    questions: [
      {
        question: "How can I register?",
        answer:
          "Create an account and complete the registration form.",
      },
      {
        question: "Is registration confirmation automatic?",
        answer:
          "No. Our team will review your registration and contact you by phone.",
      },
      {
        question: "How can I check my registration status?",
        answer:
          "Log in to your account and visit the Status page.",
      },
    ],
  },
  {
    title: "Trip Fee",
    questions: [
      {
        question: "What is the registration fee?",
        answer:
          "The fixed trip fee is ৳3,500 per participant. The same fee applies to everyone.",
      },
      {
        question: "Can I pay partially?",
        answer:
          "Yes. You can secure your registration with a minimum initial payment of ৳1,000.",
      },
    ],
  },
  {
    title: "Payment",
    questions: [
      {
        question: "When is the remaining payment due?",
        answer:
          "The remaining payment must be completed within 3 days of the initial payment.",
      },
      {
        question: "Which payment methods are available?",
        answer:
          "bKash, Nagad, Rocket and Hand Cash.",
      },
      {
        question: "What payment information is required?",
        answer:
          "Online payments require a Transaction ID. Hand Cash requires the receiver's name and receipt number.",
      },
    ],
  },
  {
    title: "Confirmation",
    questions: [
      {
        question: "How will I receive confirmation?",
        answer:
          "Our team will contact you by phone after reviewing your registration and payment.",
      },
    ],
  },
  {
    title: "Cancellation & Refund",
    questions: [
      {
        question: "Is the payment refundable?",
        answer:
          "Yes. A full refund is available in case of cancellation.",
      },
    ],
  },
];

export default function FAQ() {
  const [activeItem, setActiveItem] = useState(null);

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setActiveItem((current) => current === key ? null : key);
  };

  return (
    <section
      id="faq"
      className="bg-[#F7F4ED] px-5 py-16 text-[#1D423A] sm:px-8 sm:py-20"
    >
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#6BA39E]">
            <HelpCircle size={15} />
            Need to know
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked <span className="text-[#E07A3E]">Questions</span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71817A]">
            Find answers to common questions about registration,
            payments and Rihla&apos;26.
          </p>
        </div>

        {/* Fixed Trip Fee */}
        <div className="mb-10 flex flex-col items-center justify-between gap-3 rounded-xl border border-[#DCE7DF] bg-white px-5 py-5 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6BA39E]">
              Fixed Trip Fee
            </p>
            <h3 className="mt-1 text-lg font-bold text-[#1D423A]">
              One journey. One fixed fee.
            </h3>
            <p className="mt-1 text-xs text-[#82928A]">
              Applicable to every participant.
            </p>
          </div>

          <div className="text-3xl font-black text-[#E07A3E]">
            ৳3,500
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={category.title}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#246A73]">
                {category.title}
              </h3>

              <div className="divide-y divide-[#E9EDE7] overflow-hidden rounded-xl border border-[#E7E9E2] bg-white">
                {category.questions.map((item, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isOpen = activeItem === key;
                  const answerId = `faq-answer-${key}`;

                  return (
                    <div key={item.question}>
                      <button
                        type="button"
                        onClick={() =>
                          toggleQuestion(categoryIndex, questionIndex)
                        }
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#F7F9F5] sm:px-6"
                      >
                        <span className="text-sm font-semibold leading-6 text-[#1D423A]">
                          {item.question}
                        </span>

                        <span
                          className={`flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                            isOpen
                              ? "rotate-180 bg-[#246A73] text-white"
                              : "bg-[#F1F5F0] text-[#6BA39E]"
                          }`}
                        >
                          <ChevronDown size={16} />
                        </span>
                      </button>

                      <div
                        id={answerId}
                        aria-hidden={!isOpen}
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 pb-5 text-sm leading-7 text-[#71817A] sm:px-6">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 rounded-xl bg-[#1D423A] px-6 py-8 text-center sm:py-10">
          <h3 className="text-xl font-bold text-[#F7F4ED]">
            Still have questions?
          </h3>

          <p className="mt-2 text-sm text-[#B7CEC4]">
            Our team is here to help you.
          </p>

          <a
            href="#contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#DFC5A6] px-6 py-3 text-sm font-bold text-[#1D423A] transition hover:bg-[#E07A3E] hover:text-white"
          >
            Contact Us
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[10px] font-semibold tracking-[0.2em] text-[#82928A]">
          SOROB PRESENTS · RIHLA&apos;26
        </p>

      </div>
    </section>
  );
}
