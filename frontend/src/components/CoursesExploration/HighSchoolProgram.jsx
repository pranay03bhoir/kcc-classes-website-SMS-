import React from "react";
import CustomHeading from "@/components/Heading/CustomHeading";
import HighSchool from "@/components/EducationalPrograms/HighSchool";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const HighSchoolProgram = () => {
  return (
    <div>
      <div className={`flex justify-center pt-10`}>
        <CustomHeading
          title={`High School programs`}
          padding={`py-14`}
          borderColour={`border-white`}
        />
      </div>
      <div className={`md:pt-36`}>
        <HighSchool />
      </div>
      <div className={`flex justify-center`}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="mt-6 w-fit bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors flex items-center justify-center gap-2 md:hidden"
        >
          Enroll in High School Program <FaArrowRight />
        </motion.button>
      </div>
    </div>
  );
};

export default HighSchoolProgram;
