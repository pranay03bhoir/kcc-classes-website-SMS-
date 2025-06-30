"use client";

import CustomHeading from "@/components/Heading/CustomHeading";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const courseCategories = [
  {
    id: "middle-school",
    title: "Middle School",
    classes: "Classes 5 to 8",
    description:
      "Building a strong foundation in core subjects with engaging, interactive learning methods.",
    topics: [
      "Mathematics & Science",
      "English & Social Studies",
      "Critical Thinking Skills",
    ],
    color: "blue",
    icon: "📚",
    features: [
      "Interactive Learning",
      "Regular Assessments",
      "Parent-Teacher Meetings",
      "Extracurricular Activities",
    ],
  },
  {
    id: "high-school",
    title: "High School",
    classes: "Classes 9 & 10",
    description:
      "Comprehensive preparation for board exams with focus on conceptual understanding.",
    topics: [
      "Advanced Mathematics",
      "Physics, Chemistry & Biology",
      "Board Exam Preparation",
    ],
    color: "purple",
    icon: "🎯",
    features: [
      "Board Exam Focus",
      "Mock Tests",
      "Study Material",
      "Doubt Clearing Sessions",
    ],
  },
  {
    id: "higher-secondary",
    title: "Higher Secondary",
    classes: "Classes 11 & 12",
    description:
      "Specialized coaching for Science and Commerce streams to excel in board exams and competitive tests.",
    topics: [
      "Science Stream (PCM/PCB)",
      "Commerce Stream",
      "Entrance Exam Coaching",
    ],
    color: "pink",
    icon: "🎓",
    features: [
      "Stream Specialization",
      "Competitive Exam Prep",
      "Career Counseling",
      "Advanced Study Material",
    ],
  },
];

const colorVariants = {
  blue: {
    gradient: "from-blue-500 to-blue-600",
    hover: "hover:from-blue-600 hover:to-blue-700",
    light: "bg-blue-50",
    text: "text-blue-700",
  },
  purple: {
    gradient: "from-purple-500 to-purple-600",
    hover: "hover:from-purple-600 hover:to-purple-700",
    light: "bg-purple-50",
    text: "text-purple-700",
  },
  pink: {
    gradient: "from-pink-500 to-pink-600",
    hover: "hover:from-pink-600 hover:to-pink-700",
    light: "bg-pink-50",
    text: "text-pink-700",
  },
};

const CourseCard = ({ course, index, onLearnMore }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colorVariant = colorVariants[course.color];

  return (
    <motion.div
      key={course.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      {/* Card Header with Gradient */}
      <div
        className={`p-8 text-white text-center bg-gradient-to-r ${colorVariant.gradient} ${colorVariant.hover} transition-all duration-300`}
      >
        <div className="text-4xl mb-2">{course.icon}</div>
        <h3 className="text-2xl font-semibold">{course.title}</h3>
        <p className="text-sm opacity-90 mt-1">{course.classes}</p>
      </div>

      {/* Card Content */}
      <div className="p-6 text-left">
        <p className="text-gray-600">{course.description}</p>

        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 mb-2">Key Topics:</h4>
          <ul className="space-y-2 text-gray-700">
            {course.topics.map((topic, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className={`${colorVariant.text} font-bold`}>✔</span>
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 mb-2">Features:</h4>
          <ul className="grid grid-cols-2 gap-2">
            {course.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-1 text-sm">
                <span className={`${colorVariant.text}`}>•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onLearnMore(course.id)}
          className={`mt-6 w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r ${colorVariant.gradient} ${colorVariant.hover} transition-all duration-300 shadow-md`}
          aria-label={`Learn more about ${course.title} program`}
        >
          Learn More
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function CourseCategories() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleLearnMore = (categoryId) => {
    setSelectedCategory(categoryId);
    // Scroll to the corresponding section or navigate to a detailed page
    router.push(`/courses/${categoryId}`);
  };

  return (
    <section
      className="py-16 bg-gradient-to-b from-gray-50 to-white pt-32 md:pt-0"
      aria-labelledby="course-categories-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-row justify-center mb-28">
          <CustomHeading
            id="course-categories-heading"
            title="Our Course Categories"
            borderColour="border-white rounded-full"
            padding="py-14"
          />
          <p className="text-gray-600 text-center max-w-2xl mx-auto md:pt-8 pt-4">
            Discover our specialized educational programs designed to help
            students excel in their academic journey with personalized attention
            and expert guidance.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {courseCategories.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                onLearnMore={handleLearnMore}
              />
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <motion.a
            href="/courses"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-blue-600 text-lg font-semibold hover:text-blue-700 transition-colors"
            aria-label="View all course details"
          >
            View All Course Details
            <span aria-hidden="true">→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
