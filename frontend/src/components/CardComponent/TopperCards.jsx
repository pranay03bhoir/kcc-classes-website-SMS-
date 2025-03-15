import React from "react";
import { motion } from "framer-motion";

const TopperCards = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        className="flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-4"
      >
        {/* Profile Image */}
        <div className="w-40 h-40 border-2 border-dashed border-blue-500 rounded-full overflow-hidden">
          <img
            src="https://randomuser.me/api/portraits/men/34.jpg" // Replace with your actual image path
            alt="Student"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Student Name */}
        <h2 className="text-lg font-bold mt-4 text-gray-900">HARDIK JAIN</h2>

        {/* Percentage and Exam */}
        <p className="text-blue-600 font-semibold text-sm">99.40% – JEE Main</p>
      </motion.div>
    </div>
  );
};

export default TopperCards;
