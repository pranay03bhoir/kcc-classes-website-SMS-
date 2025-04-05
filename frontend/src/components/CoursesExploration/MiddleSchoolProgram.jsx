import React from "react";
import MiddleSchool from "@/components/EducationalPrograms/MiddleSchool";
import CustomHeading from "@/components/Heading/CustomHeading";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
const MiddleSchoolProgram = () => {
  return (
    <div>
      <div className=" flex justify-center">
        <CustomHeading
          title={`Middle School programs`}
          padding={`py-14`}
          borderColour={`border-white`}
        />
      </div>
      <div className="pt-36">
        <MiddleSchool />
      </div>
      <motion.div
        whileTap={{ scale: 0.9 }}
        className={`flex justify-center pt-10`}
      >
        <Button
          className={`bg-indigo-600 hover:bg-indigo-800 h-12 w-72 text-md flex items-center gap-2`}
        >
          Enroll for Middle School program <FaArrowRight />
        </Button>
      </motion.div>
    </div>
  );
};

export default MiddleSchoolProgram;
