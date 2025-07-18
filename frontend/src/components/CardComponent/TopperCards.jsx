import { motion } from "framer-motion";
import { FaMedal, FaStar, FaTrophy } from "react-icons/fa";

const TopperCards = ({ student }) => {
  // Use the Topper model fields from the backend
  const {
    studentName = "Topper Name",
    score = "-",
    examType = "-",
    year = "-",
    profileImage = "https://randomuser.me/api/portraits/men/34.jpg",
    otherAchievements = [],
  } = student || {};

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
        {/* Topper Badge with Score */}
        <div className="absolute -top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md flex items-center gap-1">
          <FaTrophy className="text-yellow-300" />
          Topper
          <span className="ml-2">{score}</span>
        </div>

        {/* Profile Image */}
        <div className="relative w-32 h-32 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-20 blur-sm"></div>
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={profileImage || "https://randomuser.me/api/portraits/men/34.jpg"}
              alt={studentName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Student Info */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            {studentName}
          </h2>
          <div className="flex items-center justify-center gap-2 text-red-600 font-semibold">
            <FaMedal className="text-yellow-500" />
            <span>{examType}</span>
            <span className="text-gray-400">|</span>
            <span>{year}</span>
          </div>
          <p className="text-sm text-gray-600">Score: {score}</p>
        </div>

        {/* Achievements */}
        {otherAchievements && otherAchievements.length > 0 && (
          <div className="mt-4 w-full">
            <div className="flex flex-wrap gap-2 justify-center">
              {otherAchievements.map((achievement, index) => (
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
        )}
      </motion.div>
    </motion.div>
  );
};

export default TopperCards;
