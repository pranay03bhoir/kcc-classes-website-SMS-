import { motion } from "framer-motion";
import { FaMedal, FaStar, FaTrophy } from "react-icons/fa";

const TopperCards = ({ student }) => {
  // Default student data if none provided
  const studentData = student || {
    name: "HARDIK JAIN",
    percentage: "99.40%",
    exam: "JEE Main",
    rank: "AIR 1",
    year: "2024",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    achievements: [
      "National Topper",
      "Perfect Score in Physics",
      "State Champion",
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto"
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className="relative flex flex-col items-center bg-gradient-to-br from-white to-red-50 shadow-xl rounded-2xl p-6 border border-red-100"
      >
        {/* Achievement Badge */}
        <div className="absolute -top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md flex items-center gap-1">
          <FaTrophy className="text-yellow-300" />
          {studentData.rank}
        </div>

        {/* Profile Image */}
        <div className="relative w-32 h-32 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-20 blur-sm"></div>
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={studentData.image}
              alt={studentData.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Student Info */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            {studentData.name}
          </h2>
          <div className="flex items-center justify-center gap-2 text-red-600 font-semibold">
            <FaMedal className="text-yellow-500" />
            <span>{studentData.percentage}</span>
            <span className="text-gray-400">|</span>
            <span>{studentData.exam}</span>
          </div>
          <p className="text-sm text-gray-600">{studentData.year}</p>
        </div>

        {/* Achievements */}
        <div className="mt-4 w-full">
          <div className="flex flex-wrap gap-2 justify-center">
            {studentData.achievements.map((achievement, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
              >
                <FaStar className="text-yellow-500 text-xs" />
                {achievement}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TopperCards;
