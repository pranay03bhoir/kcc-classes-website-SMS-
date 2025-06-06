"use client";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { FaBookOpen, FaCalculator } from "react-icons/fa";
import { SlChemistry } from "react-icons/sl";

const ContactPageSectionOne = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });

  const middleRef = useRef(null);
  const middleInView = useInView(middleRef, { once: true, margin: "-100px" });

  const scienceRef = useRef(null);
  const scienceInView = useInView(scienceRef, { once: true, margin: "-100px" });

  const commerceRef = useRef(null);
  const commerceInView = useInView(commerceRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <div className="mx-auto py-36 bg-linear-to-r from-[#451C67] to-[#222C68] shadow-md">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-bold mb-4 text-white">
          Excel in Your Studies with Expert Tutoring
        </h1>
        <p className="text-2xl text-gray-300 mb-6">
          Comprehensive tutoring for students from 5th to 12th grade,
          specializing in Science and Commerce streams.
        </p>
        <div className="flex justify-center gap-4 h-12">
          <button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors">
            Enroll Now
          </button>
          <Link href={`/aboutus`} className={`h-12`}>
            <button className="px-6 py-2 border border-white-600 text-white-600 text-white font-medium rounded-md hover:bg-red-50 hover:text-black transition-colors h-12">
              Learn More
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Services Section */}
      <div className="grid md:grid-cols-3 gap-6 px-5 h-full">
        {/* Middle School Card */}
        <motion.div
          ref={middleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={middleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-48 p-6 rounded-lg hover:shadow-md transition-shadow bg-[#2C253B]"
        >
          <h2 className="text-xl font-semibold text-white mb-3">
            <FaBookOpen className="text-2xl mb-2 text-purple-600" /> Middle
            School
          </h2>
          <p className="text-gray-300">
            Specialized tutoring for students from 5th to 10th grade covering
            all core subjects.
          </p>
        </motion.div>

        {/* Science Stream Card */}
        <motion.div
          ref={scienceRef}
          initial={{ opacity: 0, y: 30 }}
          animate={scienceInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="h-48 p-6 rounded-lg hover:shadow-md transition-shadow bg-[#2C253B]"
        >
          <h2 className="text-xl font-semibold text-white mb-3">
            <SlChemistry className="text-2xl mb-2 text-blue-600" /> Science
            Stream
          </h2>
          <p className="text-gray-300">
            Expert guidance for 11th and 12th grade students in Physics,
            Chemistry, Biology and Mathematics.
          </p>
        </motion.div>

        {/* Commerce Stream Card */}
        <motion.div
          ref={commerceRef}
          initial={{ opacity: 0, y: 30 }}
          animate={commerceInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="h-48 p-6 rounded-lg hover:shadow-md transition-shadow bg-[#2C253B]"
        >
          <h2 className="text-xl font-semibold text-white mb-3">
            <FaCalculator className="text-2xl mb-2 text-green-600" /> Commerce
            Stream
          </h2>
          <p className="text-gray-300">
            Comprehensive support for 11th and 12th grade students in
            Accounting, Economics, Business Studies and Mathematics.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPageSectionOne;
