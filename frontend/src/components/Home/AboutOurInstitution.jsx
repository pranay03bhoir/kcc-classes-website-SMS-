"use client";
import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 2 } },
};

const AboutOurInstitution = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid md:grid-cols-2 gap-10"
    >
      <motion.div variants={fadeInUp}>
        <img
          src="/images/teacher-teaching.jpg"
          alt="Teaching"
          className="img-fluid rounded-sm h-screen"
          style={{ borderBottomRightRadius: "100px" }}
        />
      </motion.div>
      <motion.div
        variants={fadeInUp}
        className="md:px-10 px-5 flex flex-col justify-center items-center md:items-start w-full"
      >
        <h1 className="text-3xl font-bold pb-4 text-red-700">
          About Our Institution
        </h1>
        <p className="text-xl pb-4">
          KCC classes – Excellence in Education, Success for Every Student. At
          KCC classes, we are committed to providing high-quality tutoring
          services for students from Grade 5 to 10, as well as specialized
          coaching for Grade 11 and 12 students in the Science and Commerce
          streams. Our expert educators focus on concept clarity, personalized
          learning, and exam preparation, ensuring that each student achieves
          their full potential.
        </p>
        <p className="text-lg font-bold pb-2">Why Choose Us?</p>
        <motion.ol variants={fadeInUp} className="flex flex-col gap-5">
          <li>
            ✅ Experienced & Qualified Teachers – Dedicated instructors with a
            strong academic background.
          </li>
          <li>
            ✅ Comprehensive Curriculum Support – Aligned with school syllabi
            for better performance.
          </li>
          <li>
            ✅ Concept-Based Learning – Emphasis on understanding, not just
            memorization.
          </li>
          <li>✅ Regular Assessments & Progress - Helping students.</li>
        </motion.ol>
        <motion.button
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          className="bg-red-600 text-white px-4 py-2 rounded-md mt-7 transition-transform duration-300 transform h-14 w-38"
        >
          Know More
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default AboutOurInstitution;
