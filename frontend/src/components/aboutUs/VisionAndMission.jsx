"use client";
import React from "react";
import CustomHeading from "../Heading/CustomHeading";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const VisionAndMission = () => {
  return (
    <div className="w-full max-w-screen-xl mx-auto flex flex-col items-center md:pt-16">
      <CustomHeading
        title={"Our Vision & Mission"}
        padding={`py-16`}
        animate={{ opacity: 1, y: 0 }}
        borderColour={"border-white"}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full bg-black p-8 rounded-lg shadow-lg md:pt-48"
      >
        {/* Mission Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-blue-900 text-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <div className="bg-blue-500 p-4 rounded-full mb-4">⚡</div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="mb-4">
            To empower students with quality education through personalized
            attention and innovative teaching methods, enabling them to achieve
            academic excellence and personal growth.
          </p>
          <ul className="space-y-2 text-left">
            <li className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" /> Provide
              comprehensive educational support
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" /> Foster critical
              thinking abilities
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" /> Build strong
              academic foundations
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" /> Encourage a
              growth mindset and lifelong learning
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" /> Leverage
              technology to enhance learning experiences
            </li>
          </ul>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-purple-900 text-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <div className="bg-purple-500 p-4 rounded-full mb-4">👁️</div>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="mb-4">
            To be recognized as a leading educational institution that nurtures
            talent, fosters innovation, and shapes future leaders through
            excellence in education.
          </p>
          <ul className="space-y-2 text-left">
            <li className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" /> Create
              future-ready students
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" /> Implement
              innovative teaching methods
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" /> Maintain
              excellence in education
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" /> Encourage
              holistic development beyond academics
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" /> Build a
              community of passionate and driven learners
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VisionAndMission;
