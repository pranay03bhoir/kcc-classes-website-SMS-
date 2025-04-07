"use client";

import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaUsers,
  FaClipboardList,
  FaFlask,
} from "react-icons/fa";

const features = [
  {
    title: "Structured Learning Path",
    description:
      "Curriculum designed with progressive complexity, building strong foundations before advancing to higher concepts",
    icon: <FaGraduationCap className="text-blue-600 text-4xl" />,
    color: "border-blue-500 bg-blue-50",
    list: [
      "Sequential topic progression",
      "Concept mapping and integration",
      "Foundation before application",
    ],
  },
  {
    title: "Active Learning Strategies",
    description:
      "Engaging methods that turn students from passive listeners into active participants in the learning process",
    icon: <FaUsers className="text-purple-600 text-4xl" />,
    color: "border-purple-500 bg-purple-50",
    list: [
      "Collaborative problem-solving",
      "Peer teaching opportunities",
      "Hands-on experiments and activities",
    ],
  },
  {
    title: "Continuous Assessment",
    description:
      "Regular performance evaluation through various assessment methods to track progress and identify improvement areas",
    icon: <FaClipboardList className="text-green-600 text-4xl" />,
    color: "border-green-500 bg-green-50",
    list: [
      "Weekly quizzes and assignments",
      "Monthly progress reports",
      "Periodic mock exams",
    ],
  },
  {
    title: "Technology Integration",
    description:
      "Leveraging digital tools and resources to enhance learning experiences and provide visualization of complex concepts",
    icon: <FaFlask className="text-red-600 text-4xl" />,
    color: "border-red-500 bg-red-50",
    list: [
      "Interactive digital content",
      "Virtual simulations and models",
      "Online practice and assessment tools",
    ],
  },
];

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const PillarsOfTeaching = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={fadeInVariant}
          className={`p-6 rounded-lg border shadow-md ${feature.color}`}
        >
          <div className="flex justify-center mb-3">{feature.icon}</div>
          <h3 className="text-lg font-bold text-center">{feature.title}</h3>
          <p className="text-gray-700 text-center mt-2">
            {feature.description}
          </p>
          <ul className="mt-4 space-y-2">
            {feature.list.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-lg text-green-600">✔</span> {item}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PillarsOfTeaching;
