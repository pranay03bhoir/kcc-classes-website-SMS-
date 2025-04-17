"use client";
import React from "react";
import { motion } from "framer-motion";
import CustomHeading from "@/components/Heading/CustomHeading";
import Departments from "@/components/Faculty/Departments";

const BrowseOurDepartment = () => {
  const departmentsData = [
    {
      id: 1,
      title: "Primary Classes",
      grades: "Grades 5 to 10",
      subjects: ["Mathematics", "Science", "English"],
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      title: "Science Stream",
      grades: "Grades 11 and 12",
      subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
    {
      id: 3,
      title: "Commerce Stream",
      grades: "Grades 11 and 12",
      subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics"],
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div>
      <div className="flex justify-center">
        <CustomHeading
          title="Browse by Department"
          padding="py-14"
          borderColour="border-white"
        />
      </div>
      <motion.div
        className="grid md:grid-cols-3 justify-center gap-12 px-10 md:pt-44"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {departmentsData.map((data, index) => (
          <motion.div
            key={data.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <Departments
              subjects={data.subjects}
              title={data.title}
              grades={data.grades}
              textColor={data.textColor}
              bgColor={data.bgColor}
              id={data.id}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BrowseOurDepartment;
