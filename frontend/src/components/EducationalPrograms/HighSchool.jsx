"use client";
import { FaCheckCircle, FaCheck, FaArrowRight } from "react-icons/fa";
import { MdScience } from "react-icons/md";
import { GiOpenBook } from "react-icons/gi";
import { motion } from "framer-motion";
import { GithubIcon } from "lucide-react";

const fadeInVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const containerVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const highSchoolProgramData = {
  description:
    "Our High School Program is specially crafted for students in Classes 9 and 10, focusing on comprehensive board exam preparation alongside building a strong conceptual foundation. We emphasize problem-solving, critical thinking, and analytical skills that will serve students well in their academic journey.",
  curriculum:
    "The curriculum is aligned with various education boards including CBSE, ICSE, and State Boards. Our experienced faculty uses innovative teaching methods to explain complex concepts and ensures thorough preparation for board examinations.",
  keyFeatures: [
    "Board exam-oriented preparation with regular mock tests",
    "Comprehensive study materials and question banks",
    "Special attention to previous years' board questions",
    "Doubt clearing sessions and personalized guidance",
  ],
  whyChoose: [
    {
      title: "Expert Faculty",
      desc: "Teachers with extensive experience in board exam preparation",
    },
    {
      title: "Proven Results",
      desc: "Track record of students scoring 90%+ in board exams",
    },
    {
      title: "Regular Testing",
      desc: "Weekly tests and monthly mock exams for continuous assessment",
    },
    {
      title: "Performance Tracking",
      desc: "Detailed analysis of student performance with improvement plans",
    },
  ],
  subjectOfferings: {
    iconScience: <MdScience />,
    iconLanguage: <GiOpenBook />,
    science: [
      {
        subject: "Physics",
        topics: [
          "Motion, Force, and Energy",
          "Electricity and Magnetism",
          "Light, Sound, and Wave Phenomena",
        ],
      },
      {
        subject: "Chemistry",
        topics: [
          "Atomic Structure and Chemical Bonding",
          "Acids, Bases, and Salts",
          "Organic Chemistry Fundamentals",
        ],
      },
      {
        subject: "Biology",
        topics: [
          "Life Processes and Control",
          "Reproduction and Heredity",
          "Human Physiology and Health",
        ],
      },
      {
        subject: "Mathematics",
        topics: [
          "Algebra and Quadratic Equations",
          "Coordinate Geometry",
          "Trigonometry and Statistics",
        ],
      },
    ],
    languageSocial: [
      {
        subject: "English",
        topics: [
          "Literature and Prose",
          "Grammar and Composition",
          "Reading Comprehension",
        ],
      },
      {
        subject: "Social Studies",
        topics: [
          "History and Civics",
          "Geography and Economics",
          "Contemporary India",
        ],
      },
    ],
  },
  classSchedule: {
    weekday: "Mon-Fri: 4:30 PM - 7:30 PM",
    weekend: "Sat-Sun: 9:00 AM - 2:00 PM",
  },
};

const HighSchool = () => {
  const {
    description,
    curriculum,
    keyFeatures,
    whyChoose,
    subjectOfferings,
    classSchedule,
  } = highSchoolProgramData;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariant}
      className="p-6 grid md:grid-cols-2 md:gap-14"
    >
      {/* Left Section */}
      <motion.div variants={fadeInVariant}>
        <p className="text-gray-700 mb-4">{description}</p>
        <p className="text-gray-700 mb-6">{curriculum}</p>

        {/* Key Features */}
        <motion.div
          variants={fadeInVariant}
          className="bg-purple-100 p-4 rounded-lg border-l-4 border-purple-600 mb-6"
        >
          <h3 className="text-purple-700 font-bold mb-3">
            Key Program Features
          </h3>
          <ul className="space-y-2">
            {keyFeatures.map((feature, index) => (
              <motion.li
                key={index}
                variants={fadeInVariant}
                className="flex items-center gap-2"
              >
                <FaCheckCircle className="text-purple-600" /> {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Why Choose Section */}
        <motion.h3 variants={fadeInVariant} className="text-xl font-bold mb-4">
          Why Choose Our High School Program?
        </motion.h3>
        <motion.div
          variants={fadeInVariant}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          {whyChoose.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInVariant}
              className="p-4 bg-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-gray-700 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Enroll Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="mt-6 col-span-2 w-fit bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors md:flex items-center gap-2 hidden"
        >
          Enroll in High School Program <FaArrowRight />
        </motion.button>
      </motion.div>

      {/* Right Section */}
      <motion.div variants={fadeInVariant}>
        {/* Subject Offerings */}
        <motion.div
          variants={fadeInVariant}
          className="bg-purple-700 text-white p-4 rounded-t-lg"
        >
          <h3 className="font-bold">Subject Offerings</h3>
        </motion.div>
        <motion.div
          variants={fadeInVariant}
          className="bg-white shadow-lg p-6 rounded-b-lg space-y-2"
        >
          {/* Science Subjects */}
          <motion.h4
            variants={fadeInVariant}
            className="text-purple-700 font-bold  flex items-center gap-2"
          >
            <MdScience
              className={`text-lg bg-purple-100 rounded-full w-12 h-7`}
            />{" "}
            Science Subjects
          </motion.h4>
          <motion.div
            variants={fadeInVariant}
            className="grid md:grid-cols-2 gap-4"
          >
            {subjectOfferings.science.map((subject, index) => (
              <motion.div
                key={index}
                variants={fadeInVariant}
                className="p-3 border rounded-lg space-y-2 hover:bg-purple-100 duration-300"
              >
                <h5 className="font-semibold">{subject.subject}</h5>
                <ul className="list-inside text-gray-600 text-sm flex flex-col gap-2">
                  {subject.topics.map((topic, i) => (
                    <motion.li
                      key={i}
                      variants={fadeInVariant}
                      className="flex items-center gap-2"
                    >
                      <FaCheck className="text-purple-600" /> {topic}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Language & Social Studies */}
          <motion.h4
            variants={fadeInVariant}
            className="text-purple-700 font-bold mt-4 mb-2 flex items-center gap-2"
          >
            <GiOpenBook
              className={`text-lg bg-purple-100 rounded-full w-12 h-7`}
            />{" "}
            Language and Social Sciences
          </motion.h4>
          <motion.div
            variants={fadeInVariant}
            className="grid md:grid-cols-2 gap-4"
          >
            {subjectOfferings.languageSocial.map((subject, index) => (
              <motion.div
                key={index}
                variants={fadeInVariant}
                className="p-3 border rounded-lg space-y-2 hover:bg-purple-100 duration-300"
              >
                <h5 className="font-semibold">{subject.subject}</h5>
                <ul className="list-inside text-gray-600 text-sm flex flex-col gap-2">
                  {subject.topics.map((topic, i) => (
                    <motion.li
                      key={i}
                      variants={fadeInVariant}
                      className="flex items-center gap-2"
                    >
                      <FaCheck className="text-purple-600" /> {topic}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Class Schedule */}
        <motion.h3
          variants={fadeInVariant}
          className="text-xl font-bold mt-6 mb-4"
        >
          Class Schedule
        </motion.h3>
        <motion.div
          variants={fadeInVariant}
          className="grid md:grid-cols-2 gap-4"
        >
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="font-bold text-blue-700">Weekday Batches:</p>
            <p className="text-gray-700">{classSchedule.weekday}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="font-bold text-blue-700">Weekend Batches:</p>
            <p className="text-gray-700">{classSchedule.weekend}</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HighSchool;
