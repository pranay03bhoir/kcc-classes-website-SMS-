"use client";
import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const AboutOurInstitution = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid md:grid-cols-2 gap-10 items-center px-6 md:px-16 py-10 bg-gray-50"
    >
      {/* Left Side - Image */}
      <motion.div variants={fadeInUp} className="relative">
        <img
          src="/images/teacher-teaching.jpg"
          alt="Teaching"
          className="w-full rounded-lg shadow-lg md:h-[500px] object-cover"
          style={{
            borderBottomRightRadius: "50px",
            borderTopLeftRadius: "50px",
          }}
        />
      </motion.div>

      {/* Right Side - Text Content */}
      <motion.div
        variants={fadeInUp}
        className="md:px-10 flex flex-col justify-center w-full text-center md:text-left"
      >
        <h1 className="text-4xl font-bold pb-5 text-red-700">
          About Our Institution
        </h1>
        <p className="text-lg text-gray-700 pb-4 leading-relaxed">
          <span className="font-semibold text-black">KCC Classes</span> –
          Excellence in Education, Success for Every Student. We offer
          high-quality tutoring for students from Grade 5 to 10, and specialized
          coaching for Grade 11 & 12 in Science and Commerce. Our expert
          educators ensure concept clarity, personalized learning, and exam
          success.
        </p>

        {/* Why Choose Us */}
        <div className="bg-white p-5 rounded-lg shadow-md mt-4">
          <h2 className="text-xl font-bold text-red-700 pb-3">
            Why Choose Us?
          </h2>
          <motion.ul variants={fadeInUp} className="space-y-3 text-gray-800">
            <li>
              ✅ <strong>Experienced & Qualified Teachers</strong> – Experts
              with strong academic backgrounds.
            </li>
            <li>
              ✅ <strong>Comprehensive Curriculum Support</strong> – Aligned
              with school syllabi.
            </li>
            <li>
              ✅ <strong>Concept-Based Learning</strong> – Focus on
              understanding, not just memorization.
            </li>
            <li>
              ✅ <strong>Regular Assessments & Progress Tracking</strong> –
              Helping students improve consistently.
            </li>
          </motion.ul>
        </div>

        {/* Call to Action Button */}
        <motion.button
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          className="bg-red-600 text-white px-6 py-3 rounded-lg mt-7 transition-all duration-300 hover:bg-red-700 shadow-lg"
        >
          Learn More
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default AboutOurInstitution;
