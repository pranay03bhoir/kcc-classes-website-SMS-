import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const HomePageCourseCard = ({ data }) => {
  return (
    <div className={`flex flex-col w-full justify-center`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        className="bg-white shadow-lg rounded-xl overflow-hidden w-[100%] "
      >
        {/* Card Header */}
        <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-bold">{data.title}</h2>
          <p className="text-sm">{data.description}</p>
        </div>

        {/* List of Features */}
        <ul className="py-4 px-5 space-y-3 text-gray-700">
          {data.features && data.features.length > 0 ? (
            data.features.map((item, index) => (
              <li key={index} className="flex items-center">
                <Check className="text-indigo-600" />
                <span className="ml-2">{item}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No features available</p>
          )}
        </ul>

        {/* Centered Button */}
        <div className="flex justify-center pt-5">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#2563EB" }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold mb-5"
          >
            Learn More
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePageCourseCard;
