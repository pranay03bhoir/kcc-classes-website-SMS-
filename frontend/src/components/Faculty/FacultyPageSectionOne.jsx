"use client";
import React from "react";
import { motion } from "framer-motion";

const FacultyPageSectionOne = () => {
  return (
    <div>
      <section className="relative w-full py-52 bg-gradient-to-b from-gray-900 to-gray-800 text-white text-center">
        {/* Subtle Background Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          {/* Heading Animation */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Meet Our Expert Faculty
          </motion.h2>

          {/* Paragraph Animation */}
          <motion.p
            className="mt-4 text-lg text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            Dedicated educators shaping futures from grade 5 to 12th,
            specializing in Science and Commerce streams
          </motion.p>

          {/* Buttons Animation */}
          <motion.div
            className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Meet Our Teachers
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FacultyPageSectionOne;
