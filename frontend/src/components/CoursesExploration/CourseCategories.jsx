"use client";

import { motion } from "framer-motion";
import CustomHeading from "@/components/Heading/CustomHeading";

const courseCategories = [
  {
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
  },
  {
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
  },
  {
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
  },
];

export default function CourseCategories() {
  return (
    <section className="py-16 bg-gray-50 pt-32 md:pt-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex justify-center `}>
          <CustomHeading
            title={`Our Course Categories`}
            borderColour={`border-white rounded-full`}
            padding={`py-14`}
          />
        </div>
        <p className="text-gray-500 text-center md:pt-48 pt-10">
          Discover our specialized educational programs designed to help
          students excel in their academic journey.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseCategories.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300"
            >
              {/* Card Header with Gradient */}
              <div
                className={`p-6 text-white bg-gradient-to-r ${
                  course.color === "blue"
                    ? "from-blue-500 to-blue-600"
                    : course.color === "purple"
                      ? "from-purple-500 to-purple-600"
                      : "from-pink-500 to-pink-600"
                }`}
              >
                <h3 className="text-2xl font-semibold">{course.title}</h3>
              </div>

              {/* Card Content */}
              <div className="p-6 text-left">
                <h4 className="text-xl font-semibold text-gray-700">
                  {course.classes}
                </h4>
                <p className="text-gray-600 mt-2">{course.description}</p>

                <ul className="mt-4 space-y-2 text-gray-700">
                  {course.topics.map((topic, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✔</span>{" "}
                      {topic}
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-6 w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r ${
                    course.color === "blue"
                      ? "from-blue-500 to-blue-600"
                      : course.color === "purple"
                        ? "from-purple-500 to-purple-600"
                        : "from-pink-500 to-pink-600"
                  } hover:opacity-90 transition-opacity`}
                >
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <a
            href="#"
            className="text-blue-500 text-lg font-semibold hover:underline"
          >
            View All Course Details →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
