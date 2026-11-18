
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
    title: "Packages",
    questions: [
      {
        question: "What are the available packages?",
        answer: (
          <ul className="space-y-2">
            <li className="flex justify-between gap-4">
              <span>Dhaka Round Trip</span>
              <strong>৳3,500</strong>
            </li>
            <li className="flex justify-between gap-4">
              <span>Dhaka One-Way</span>
              <strong>৳3,000</strong>
            </li>
            <li className="flex justify-between gap-4">
              <span>Join at Destination</span>
              <strong>৳2,500</strong>
            </li>
          </ul>
        ),
      },
      {
        question: "What does Join at Destination include?",
        answer:
          "It excludes transportation to and from Dhaka.",
      },
    ],
  },
  {
    title: "Payment",
    questions: [
      {
        question: "Can I pay partially?",
        answer: "Yes. The minimum initial payment is ৳1,000.",
      },
      {
        question: "When is the remaining payment due?",
        answer: "Within 3 days of the initial payment.",
      },
      {
        question: "Which payment methods are available?",
        answer: "bKash, Nagad, Rocket and Hand Cash.",
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
        answer: "Yes. A full refund is available.",
      },
    ],
  },
];

export default function FAQ() {
  const [activeItem, setActiveItem] = useState(null);

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;

    setActiveItem((current) => (current === key ? null : key));
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#F3FAFF] px-5 py-20 sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#159BC1]/20 bg-white px-4 py-2 text-sm font-semibold text-[#159BC1]">
            <HelpCircle size={16} />
            FAQs
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[#073D5B] sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#123B56]/70 sm:text-base">
            Everything you need to know about Rihla&apos;26.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={category.title}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#159BC1]">
                {category.title}
              </h3>

              <div className="space-y-3">
                {category.questions.map((item, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isOpen = activeItem === key;
                  const answerId = `faq-answer-${key}`;

                  return (
                    <div
                      key={item.question}
                      className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                        isOpen
                          ? "border-[#159BC1]/40 shadow-md shadow-[#073D5B]/5"
                          : "border-[#073D5B]/10 hover:border-[#159BC1]/30"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleQuestion(categoryIndex, questionIndex)
                        }
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                      >
                        <span className="text-sm font-semibold leading-6 text-[#073D5B] sm:text-base">
                          {item.question}
                        </span>

                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                            isOpen
                              ? "rotate-180 bg-[#073D5B] text-white"
                              : "bg-[#F3FAFF] text-[#159BC1]"
                          }`}
                        >
                          <ChevronDown size={18} />
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
                          <div className="border-t border-[#073D5B]/10 px-5 py-5 text-sm leading-7 text-[#123B56]/75 sm:px-6">
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

        {/* Contact CTA */}
        <div className="mt-14 rounded-3xl bg-[#073D5B] px-6 py-8 text-center sm:px-10">
          <h3 className="text-xl font-bold text-white">
            Still have questions?
          </h3>

          <p className="mt-2 text-sm text-white/70">
            Contact the SOROB team for assistance.
          </p>

          <a
            href="#contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#073D5B] transition hover:bg-[#159BC1] hover:text-white"
          >
            Contact Us
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-xs font-semibold tracking-[0.2em] text-[#073D5B]/40">
          SOROB PRESENTS · RIHLA&apos;26
        </p>
      </div>
    </section>
  );
}
