"use client";
import React from "react";
import HomePageCourseCard from "@/components/CardComponent/HomePageCourseCard";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";

const HomePageSectionThree = () => {
  const courseData = [
    {
      id: 1,
      title: "Grade 5-7",
      description: "Building a strong foundation",
      features: [
        "Mathematics fundamentals",
        "Science exploration",
        "English and language skills",
        "Social studies",
        "Homework assistance",
      ],
    },
    {
      id: 2,
      title: "Grade 8-10",
      description: "Preparing for board exams",
      features: [
        "Advanced mathematics",
        "Science and technology",
        "Language and literature",
        "History and geography",
        "Board exam preparation",
      ],
    },
    {
      id: 3,
      title: "Grade 11-12",
      description: "Specialized coaching for senior grades",
      features: [
        "Science and commerce streams",
        "Advanced mathematics",
        "Physics, chemistry, and biology",
        "Accountancy and economics",
        "College entrance exam prep",
      ],
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="bg-[#F4F5F4] pt-20"
    >
      <motion.div variants={fadeInUp} className="text-center">
        <h1 className="text-4xl font-bold">Our Academic Programs.</h1>
        <p className="text-lg pt-5 text-gray-700">
          Comprehensive courses tailored for different academic levels
        </p>
      </motion.div>
      <motion.div
        variants={fadeInUp}
        className="flex flex-col md:flex-row gap-5 pt-10 px-8 justify-center w-full"
      >
        {courseData.map((course) => (
          <HomePageCourseCard key={course.id} data={course} />
        ))}
      </motion.div>
      <motion.div
        variants={fadeInUp}
        className="flex md:flex-row gap-5 md:pt-10 pt-16 px-8 justify-center w-full"
      >
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#2563EB" }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white rounded-lg text-md font-semibold mb-5 w-48 h-14 flex items-center justify-center gap-5"
        >
          Enroll Now
          <MoveRight size={22} className="mt-1" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HomePageSectionThree;
