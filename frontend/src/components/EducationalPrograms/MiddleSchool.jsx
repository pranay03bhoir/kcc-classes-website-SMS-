"use client";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  FaCalculator,
  FaFlask,
  FaBook,
  FaLandmark,
  FaPencilRuler,
  FaMicroscope,
  FaScroll,
  FaClock,
  FaBolt,
} from "react-icons/fa";

const programs = [
  {
    grade: "5-6",
    title: "Foundation Program (Classes 5-6)",
    description:
      "Our foundation program focuses on building core concepts and developing fundamental skills that prepare students for higher classes. We make learning enjoyable through interactive activities and hands-on experiments.",
    subjects: [
      {
        icon: <FaCalculator />,
        title: "Basic Mathematics",
        desc: "Arithmetic operations, fractions, decimals, and basic geometry",
      },
      {
        icon: <FaFlask />,
        title: "Elementary Science",
        desc: "Basic concepts in physics, chemistry, and biology",
      },
      {
        icon: <FaBook />,
        title: "Language Arts",
        desc: "Reading comprehension, grammar, and creative writing",
      },
      {
        icon: <FaLandmark />,
        title: "Social Studies",
        desc: "Geography, history, and civic education",
      },
    ],
    note: "Our foundation program emphasizes concept clarity through practical examples and interactive learning.",
    noteBgColor: "bg-blue-200",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    grade: "7-8",
    title: "Intermediate Program (Classes 7-8)",
    description:
      "Our intermediate program strengthens academic skills and introduces more advanced concepts. Students develop critical thinking and problem-solving abilities to prepare for high school.",
    subjects: [
      {
        icon: <FaPencilRuler />,
        title: "Advanced Mathematics",
        desc: "Algebra, geometry, data handling, and mensuration",
      },
      {
        icon: <FaMicroscope />,
        title: "Comprehensive Science",
        desc: "Deeper dive into physics, chemistry, and biology with experiments",
      },
      {
        icon: <FaScroll />,
        title: "Advanced Language Skills",
        desc: "Literature, advanced grammar, and essay writing",
      },
      {
        icon: <FaClock />,
        title: "Study Skills",
        desc: "Time management, note-taking, and exam preparation",
      },
    ],
    note: "Our intermediate program prepares students for a smooth transition to high school academics.",
    noteBgColor: "bg-purple-200",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
];
const MiddleSchool = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {programs.map((program, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-lg shadow-lg ${program.bgColor} flex-1`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <span
              className={`px-4 py-2 rounded-full bg-indigo-600 font-bold text-white ${program.textColor} bg-opacity-80 inline-block mb-4`}
            >
              {program.grade}
            </span>
            <h2 className="text-xl font-bold mb-2">{program.title}</h2>
            <p className="text-gray-700 mb-4">{program.description}</p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {program.subjects.map((subject, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-4 flex items-center gap-4 text-center border-none">
                    <div className="md:text-xl text-lg text-gray-700">
                      {subject.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {subject.title}
                      </h3>
                      <p className="text-sm text-gray-600">{subject.desc}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div
              className={`p-4 rounded-lg flex gap-3 items-center ${program.textColor} ${program.noteBgColor}`}
            >
              <FaBolt className={`text-xl`} />
              {program.note}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MiddleSchool;
