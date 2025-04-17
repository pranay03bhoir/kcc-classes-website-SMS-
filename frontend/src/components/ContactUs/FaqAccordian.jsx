"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import CustomHeading from "@/components/Heading/CustomHeading";

const faqData = [
  {
    question: "What grade levels do you provide tutoring for?",
    answer:
      "We offer tutoring for students from Grade 5 to Grade 12 across science and commerce streams.",
  },
  {
    question: "How are your tutoring sessions structured?",
    answer:
      "Sessions are structured with a balance of concept teaching, practice problems, and individual attention.",
  },
  {
    question: "What qualifications do your tutors have?",
    answer:
      "Our tutors hold degrees in their subject areas and have experience in teaching academic curricula effectively.",
  },
  {
    question: "Do you offer online tutoring options?",
    answer:
      "Yes, we provide both in-person and online tutoring sessions through our secure digital platform.",
  },
  {
    question: "How much do your tutoring programs cost?",
    answer:
      "Pricing varies depending on the course and duration. Please contact us for detailed fee structure.",
  },
  {
    question: "How do you monitor student progress?",
    answer:
      "We track progress using regular tests, assignments, and tutor feedback, and share updates with parents monthly.",
  },
  {
    question: "Do you provide study materials and resources?",
    answer:
      "Yes, we provide study notes, practice sheets, and test papers curated by subject experts.",
  },
];

export default function FaqAccordion() {
  const [openItem, setOpenItem] = useState(null);

  return (
    <div>
      <div className="flex items-center justify-center pt-16">
        <CustomHeading
          title="Frequently Asked Questions"
          padding="py-14"
          borderColour="border-white"
        />
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 md:px-20 lg:px-36 xl:px-56 space-y-5 pt-16">
        {faqData.map((item, index) => {
          const isOpen = openItem === index;

          const ref = useRef(null);
          const inView = useInView(ref, { once: true, margin: "-100px" });

          return (
            <motion.div
              key={index}
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              className="border rounded-md shadow-md"
            >
              <Accordion type="single" collapsible>
                <AccordionItem value="item">
                  <AccordionTrigger
                    onClick={() => setOpenItem(isOpen ? null : index)}
                    className="w-full text-left px-4 py-5 text-lg sm:text-xl"
                  >
                    {item.question}
                  </AccordionTrigger>
                </AccordionItem>
              </Accordion>

              <AnimatePresence initial={false} mode="wait">
                {isOpen && (
                  <motion.div
                    key={index}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-4"
                  >
                    <div className="py-2 text-base sm:text-lg">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
