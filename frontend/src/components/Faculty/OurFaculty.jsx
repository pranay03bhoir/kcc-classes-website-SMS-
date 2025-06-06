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
    <div className="w-full max-w-7xl mx-auto py-16 px-6 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="flex items-center justify-center w-full relative z-10"
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
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:pt-40 pt-16 relative z-10"
      >
        {facultyMembers.map((faculty, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center p-6 relative"
          >
            {/* Profile Image with Overlay */}
            <div className="relative w-36 h-36 mb-4">
              <img
                src={faculty.image}
                alt={`${faculty.name} - ${faculty.subject} teacher`}
                className="w-full h-full object-cover rounded-full border-4 border-indigo-500 shadow-md transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>

            {/* Details */}
            <div className="text-center">
              <FaChalkboardTeacher className="text-4xl text-indigo-600 mx-auto mb-3 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {faculty.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {faculty.description}
              </p>

              {/* Achievements */}
              <div className="mt-4 space-y-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                <h4 className="text-sm font-semibold text-indigo-600">
                  Key Achievements
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {faculty.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                  href={faculty.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href={faculty.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${faculty.social.email}`}
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <FaEnvelope className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Subject Tag */}
            <div className="mt-4 px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium shadow-sm transition-colors duration-300 group-hover:bg-indigo-200">
              {faculty.subject}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        viewport={{ once: true, amount: 0.2 }}
        className="pt-16 w-full flex justify-center items-center text-center relative z-10"
      >
        <Button
          className="rounded-full h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => (window.location.href = "/faculty")}
        >
          Meet our full faculty
          <span className="ml-2">→</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default OurFaculty;
