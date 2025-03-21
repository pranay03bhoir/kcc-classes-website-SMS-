"use client";
import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HomeIntroScreen = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-black text-center"
    >
      <motion.div
        variants={fadeInUp}
        className="text-4xl font-extrabold md:text-6xl lg:text-7xl px-5 md:px-0"
      >
        <h1>
          Excel in Your Studies with
          <br />
        </h1>
        <h1 className="text-blue-600">Expert Tutoring</h1>
      </motion.div>
      <motion.p
        variants={fadeInUp}
        className="md:text-xl mt-5 text-lg text-center px-5 leading-7"
      >
        Comprehensive tutoring for grades 5-12 in Science and Commerce streams.
        <br />
        Personalized attention, expert faculty, and proven results.
      </motion.p>
      <motion.div
        variants={fadeInUp}
        className="text-xl mt-6 md:flex md:flex-row md:justify-center gap-5 flex flex-col items-center px-4"
      >
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#1447e6" }}
          whileTap={{ scale: 0.95 }}
          className="md:px-4 md:py-2 bg-blue-600 text-white rounded-lg h-16 md:w-40 w-full cursor-pointer"
        >
          Get Started
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#f9fafb" }}
          whileTap={{ scale: 0.95 }}
          className="md:px-4 md:py-2 text-blue-600 border border-blue-600 rounded-lg h-16 md:w-40 w-full cursor-pointer"
        >
          Learn More
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HomeIntroScreen;
