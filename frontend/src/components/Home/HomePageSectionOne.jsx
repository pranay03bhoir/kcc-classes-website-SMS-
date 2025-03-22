"use client";

import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const HomePageSectionOne = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="bg-[#272726] pt-20 flex flex-col gap-10 md:grid md:grid-cols-2 py-20"
    >
      {/* Left Section */}
      <motion.div variants={fadeInUp} className="text-white px-8">
        <h1 className="md:text-5xl text-4xl font-extrabold text-red-700">
          Transform Your Academic Journey with Expert Tutoring
        </h1>
        <p className="pt-10 text-lg md:text-xl">
          Specialized coaching for grades 5-12 in Science and Commerce streams.
          Join us to excel in your academics with personalized attention and
          proven teaching methods.
        </p>
        <ol className="pt-3">
          {[
            "Comprehensive tutoring for all subjects.",
            "Personalized attention from expert faculty.",
            "Proven results with our teaching methods.",
          ].map((text, index) => (
            <motion.li variants={fadeInUp} key={index} className="flex pt-5">
              <Check size={24} className="text-red-600" />
              <span className="pl-3">{text}</span>
            </motion.li>
          ))}
        </ol>
        <motion.div variants={fadeInUp} className="md:flex md:gap-5 ">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#9f0712" }}
            whileTap={{ scale: 0.95 }}
            className="px-4 text-md items-center bg-red-600 text-white rounded-sm h-12 md:w-48 w-full cursor-pointer mt-7 flex gap-4 justify-center"
          >
            Explore Courses <ChevronRight size={24} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#404040" }}
            whileTap={{ scale: 0.95 }}
            className="px-4 text-md items-center bg-transparent border-1 text-white rounded-sm h-12 md:w-40 w-full cursor-pointer mt-7 flex gap-4 justify-center"
          >
            Book Free Demo
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right Section (Form) */}
      <motion.div
        variants={fadeInUp}
        className="flex justify-center items-center px-4"
      >
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-white text-center text-2xl font-bold mb-6">
            Get Started Today
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.input
              variants={fadeInUp}
              type="text"
              placeholder="Student Name"
              {...register("studentName", { required: true })}
              className="w-full px-4 py-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <motion.input
              variants={fadeInUp}
              type="email"
              placeholder="Parent's Email"
              {...register("parentEmail", { required: true })}
              className="w-full px-4 py-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <motion.input
              variants={fadeInUp}
              type="tel"
              placeholder="Phone Number"
              {...register("phone", { required: true })}
              className="w-full px-4 py-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <motion.select
              variants={fadeInUp}
              {...register("grade", { required: true })}
              className="w-full px-4 py-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Std.</option>
              {[...Array(6).keys()].map((i) => (
                <option key={i} value={i + 5}>
                  Grades {i + 5}
                </option>
              ))}
              {["11 science", "12 science", "11 commerce", "12 commerce"].map(
                (val, index) => (
                  <option key={index} value={val}>
                    Grades {val.replace(" ", " ( ")} )
                  </option>
                ),
              )}
            </motion.select>
            <motion.button
              variants={fadeInUp}
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition"
            >
              Schedule Free Consultation
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePageSectionOne;
