"use client";
import React from "react";
import { motion } from "framer-motion";
import CustomHeading from "@/components/Heading/CustomHeading";
import CourseCard from "@/components/CardComponent/CourseCard";
import { Button } from "@/components/ui/button";

const EnrollInCourses = () => {
  const buttonData = [
    { id: 1, title: "ALL Subjects" },
    { id: 2, title: "Middle School" },
    { id: 3, title: "High School" },
    { id: 4, title: "Science" },
    { id: 5, title: "Commerce" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="flex justify-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <CustomHeading
          title="Our Primary Course Subjects"
          borderColour="border-white rounded-full"
          padding="py-14"
        />
      </motion.div>

      <motion.p
        className="text-gray-500 text-center md:pt-48 pt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Discover our carefully designed curriculum that helps students excel in
        academics and build a strong foundation for future success.
      </motion.p>

      <motion.div
        className="  grid grid-cols-3 md:flex md:flex-row justify-center items-center gap-2 pt-10 py-12 md:px-0 px-10 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {buttonData.map((course, index) => (
          <motion.div
            key={index}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.08 }}
              className=" rounded-full p-3 text-md md:text-lg bg-red-50 transition-colors hover:bg-red-100 md:h-12 md:w-36 text-black"
            >
              {course.title}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-5 md:px-10 px-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <CourseCard
              title="Mathematics Foundation"
              description="Build a strong mathematical foundation with our comprehensive course covering arithmetic, algebra, geometry, and more."
              duration="3 months"
              classesPerWeek="2 per week"
              gradeLevel="Class 5-8"
              rating={5}
              buttonText="Enroll Now"
              isPopular={true}
              iconUrl="/images/KCC-CLASSES.png"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default EnrollInCourses;
