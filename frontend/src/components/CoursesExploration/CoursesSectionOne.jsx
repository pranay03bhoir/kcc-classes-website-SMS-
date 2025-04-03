"use client";
import React from "react";
import { motion } from "framer-motion";
const CoursesSectionOne = () => {
  return (
    <div>
      <section
        className="relative w-full h-screen flex items-center justify-center bg-cover bg-center pt-48 md:pt-0"
        style={{ backgroundImage: "url('/your-image.jpg')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <img
            src={`/images/teacher-teaching.jpg`}
            alt={`Students`}
            className={`object-cover h-screen w-screen `}
          />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-white max-w-5xl mx-auto px-6 lg:px-12 md:grid md:grid-cols-2"
        >
          {/* Title */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-4xl lg:text-5xl font-bold"
            >
              <span className="text-red-400">KCC</span> Classes
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl lg:text-2xl font-semibold mt-4"
            >
              Guiding Students Towards Academic Excellence
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="text-lg mt-4 text-white"
            >
              Comprehensive tutoring programs for students from classes 5-12 in
              Science & Commerce streams. Build strong foundations with our
              expert faculty.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-6 flex gap-4"
            >
              <button className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-transform transform hover:scale-105">
                Enroll Now
              </button>
              <button className="border border-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-black transition-transform transform hover:scale-105">
                Explore Courses
              </button>
            </motion.div>
          </div>
          <div>
            {/* Why Choose Us Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-10 bg-white bg-opacity-10 p-6 rounded-lg w-full max-w-lg backdrop-blur-md shadow-lg"
            >
              <h3 className="text-xl font-bold text-black">Why Choose Us?</h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  ✔️ Expert faculty with proven track record
                </li>
                <li className="flex items-center gap-2">
                  ✔️ Personalized learning approach
                </li>
                <li className="flex items-center gap-2">
                  ✔️ Comprehensive study materials
                </li>
                <li className="flex items-center gap-2">
                  ✔️ Regular assessments & feedback
                </li>
              </ul>

              {/* Success rate */}
              <div className="mt-4 flex items-center gap-3">
                <span className="bg-blue-500 px-3 py-1 rounded-full text-white text-sm shadow-md">
                  98%
                </span>
                <span className="bg-green-500 px-3 py-1 rounded-full text-white text-sm shadow-md">
                  A+
                </span>
                <span className="bg-purple-500 px-3 py-1 rounded-full text-white text-sm shadow-md">
                  100+
                </span>
                <p className="text-sm text-gray-600">
                  Success rate with top-performing students
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default CoursesSectionOne;
