"use client";

import { motion } from "framer-motion";
import { FaGraduationCap, FaBookOpen, FaUniversity } from "react-icons/fa";

const levels = [
  {
    title: "Middle School (Classes 5-8)",
    description: [
      "Activity-Based Learning: Hands-on activities and experiments to make learning engaging and memorable",
      "Visual Learning: Using diagrams, charts, and models to explain concepts visually",
      "Skill Development: Focus on developing critical thinking, problem-solving, and study habits",
      "Positive Reinforcement: Building confidence through recognition and encouragement",
    ],
    icon: <FaGraduationCap className="text-blue-600 text-4xl" />,
    color: "bg-blue-50 border-blue-500",
  },
  {
    title: "High School (Classes 9-10)",
    description: [
      "Conceptual Depth: In-depth exploration of concepts with real-world applications",
      "Problem-Solving: Extensive practice with a variety of problems at different difficulty levels",
      "Exam Preparation: Strategic approach to board exam preparation with focus on important topics",
      "Time Management: Training in effective time utilization during exams and studies",
    ],
    icon: <FaBookOpen className="text-purple-600 text-4xl" />,
    color: "bg-purple-50 border-purple-500",
  },
  {
    title: "Higher Secondary (Classes 11-12)",
    description: [
      "Specialized Focus: Stream-specific teaching (Science/Commerce) with advanced content coverage",
      "Competitive Edge: Preparation for both board exams and entrance tests (JEE, NEET, CA, etc.)",
      "Advanced Problem-Solving: Complex problem-solving and analytical thinking development",
      "Intensive Testing: Regular mock tests simulating actual exam conditions",
    ],
    icon: <FaUniversity className="text-pink-600 text-4xl" />,
    color: "bg-pink-50 border-pink-500",
  },
];

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const TeachingApproach = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
    >
      {levels.map((level, index) => (
        <motion.div
          key={index}
          variants={fadeInVariant}
          className={`p-6 rounded-lg border shadow-md ${level.color}`}
        >
          <div className="flex justify-center mb-3">{level.icon}</div>
          <h3 className="text-lg font-bold text-center">{level.title}</h3>
          <ul className="mt-4 space-y-2">
            {level.description.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-lg text-blue-600">✔</span>{" "}
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TeachingApproach;
