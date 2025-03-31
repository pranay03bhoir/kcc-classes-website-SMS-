"use client";
import { motion } from "framer-motion";
import { FaChalkboardTeacher } from "react-icons/fa";
import CustomHeading from "@/components/Heading/CustomHeading";
import { Button } from "@/components/ui/button";

const facultyMembers = [
  {
    name: "Dr. A. Sharma",
    subject: "Physics",
    description: "Ph.D. in Physics with 10+ years of teaching experience",
    image: "https://randomuser.me/api/portraits/men/81.jpg",
  },
  {
    name: "Ms. P. Mehta",
    subject: "Mathematics",
    description: "M.Sc. in Mathematics with expertise in all grades",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "Mr. R. Iyer",
    subject: "Chemistry",
    description: "M.Sc. in Chemistry with expertise in all grades",
    image: "https://randomuser.me/api/portraits/men/80.jpg",
  },
  {
    name: "Ms. S. Kapoor",
    subject: "Accountancy",
    description: "MBA with extensive experience in commerce subjects",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
  },
];

const OurFaculty = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-6 bg-gradient-to-b from-blue-50 to-white">
      {/* Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="flex items-center justify-center w-full"
      >
        <CustomHeading
          title="Meet Our Faculty"
          padding="py-16"
          borderColour="border-white rounded-full"
        />
      </motion.div>

      {/* Faculty Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:pt-40 pt-16"
      >
        {facultyMembers.map((faculty, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl flex flex-col items-center p-6"
          >
            {/* Profile Image */}
            <img
              src={faculty.image}
              alt={faculty.name}
              className="w-36 h-36 object-cover rounded-full border-4 border-indigo-500 shadow-md"
            />

            {/* Details */}
            <div className="text-center mt-4">
              <FaChalkboardTeacher className="text-5xl text-indigo-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                {faculty.name}
              </h3>
              <p className="text-gray-500">{faculty.description}</p>
            </div>

            {/* Subject Tag */}
            <div className="mt-3 px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium shadow-sm">
              {faculty.subject}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        viewport={{ once: true, amount: 0.2 }}
        className={` pt-16 w-full flex justify-center items-center text-center`}
      >
        <Button
          className={`rounded-full h-12 bg-indigo-600 hover:bg-indigo-800 cursor-pointer`}
        >
          Meet our full faculty
        </Button>
      </motion.div>
    </div>
  );
};

export default OurFaculty;
