"use client";
import CustomHeading from "@/components/Heading/CustomHeading";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const facultyMembers = [
  {
    name: "Dr. A. Sharma",
    subject: "Physics",
    description: "Ph.D. in Physics with 10+ years of teaching experience",
    image: "https://randomuser.me/api/portraits/men/81.jpg",
    social: {
      linkedin: "https://linkedin.com/in/dr-sharma",
      twitter: "https://twitter.com/dr-sharma",
      email: "dr.sharma@school.edu",
    },
    achievements: [
      "Published 15+ research papers",
      "National Teaching Award 2022",
      "Expert in Quantum Physics",
    ],
  },
  {
    name: "Ms. P. Mehta",
    subject: "Mathematics",
    description: "M.Sc. in Mathematics with expertise in all grades",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    social: {
      linkedin: "https://linkedin.com/in/ms-mehta",
      twitter: "https://twitter.com/ms-mehta",
      email: "ms.mehta@school.edu",
    },
    achievements: [
      "Mathematics Olympiad Mentor",
      "Author of 3 textbooks",
      "Best Teacher Award 2023",
    ],
  },
  {
    name: "Mr. R. Iyer",
    subject: "Chemistry",
    description: "M.Sc. in Chemistry with expertise in all grades",
    image: "https://randomuser.me/api/portraits/men/80.jpg",
    social: {
      linkedin: "https://linkedin.com/in/mr-iyer",
      twitter: "https://twitter.com/mr-iyer",
      email: "mr.iyer@school.edu",
    },
    achievements: [
      "Research Grant Recipient",
      "Science Fair Coordinator",
      "Innovative Teaching Award",
    ],
  },
  {
    name: "Ms. S. Kapoor",
    subject: "Accountancy",
    description: "MBA with extensive experience in commerce subjects",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
    social: {
      linkedin: "https://linkedin.com/in/ms-kapoor",
      twitter: "https://twitter.com/ms-kapoor",
      email: "ms.kapoor@school.edu",
    },
    achievements: [
      "Chartered Accountant",
      "Business Case Study Expert",
      "Industry-Academia Bridge Program Lead",
    ],
  },
];

const OurFaculty = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4 bg-white">
      {/* Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex items-center justify-center w-full mb-10"
      >
        <CustomHeading
          title="Meet Our Faculty"
          padding="py-8"
          borderColour="border-red-600 rounded-full"
        />
      </motion.div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:pt-12">
        {facultyMembers.map((faculty, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg flex flex-col items-center p-6 min-h-[370px]"
          >
            {/* Profile Image */}
            <img
              src={faculty.image}
              alt={`${faculty.name} - ${faculty.subject} teacher`}
              className="w-24 h-24 object-cover rounded-full mb-4 border border-gray-200"
            />

            {/* Details */}
            <div className="text-center w-full">
              <FaChalkboardTeacher className="text-xl text-red-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {faculty.name}
              </h3>
              <p className="text-gray-500 text-xs mb-2">
                {faculty.description}
              </p>

              {/* Achievements */}
              <ul className="text-xs text-gray-400 mb-2 space-y-1">
                {faculty.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-center justify-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2" />
                    {achievement}
                  </li>
                ))}
              </ul>

              {/* Social Links */}
              <div className="flex justify-center space-x-3 mt-2">
                <a
                  href={faculty.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-600"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
                <a
                  href={faculty.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-600"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${faculty.social.email}`}
                  className="text-gray-400 hover:text-red-600"
                >
                  <FaEnvelope className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Subject Tag */}
            <div className="mt-4 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">
              {faculty.subject}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="pt-12 w-full flex justify-center items-center text-center">
        <Button
          variant="outline"
          className="rounded-full h-11 px-6 border-red-600 text-red-700 font-medium text-base shadow-none hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
          onClick={() => (window.location.href = "/faculty")}
        >
          Meet our full faculty
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
};

export default OurFaculty;
