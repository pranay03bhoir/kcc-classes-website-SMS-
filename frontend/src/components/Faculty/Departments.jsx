"use client"
import { motion } from "framer-motion";
import { FaGreaterThan } from "react-icons/fa";

const Departments = ({
  title,
  grades,
  subjects,
  id,
  textColor,
  bgColor,
  description,
  icon: Icon,
  hoverColor,
  searchQuery,
}) => {
  // Highlight matching text in subjects
  const highlightMatch = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <motion.div
      className={`${bgColor} ${hoverColor} p-6 rounded-xl shadow-md transition-all duration-300 h-full flex flex-col`}
      whileHover={{ y: -5 }}
      role="article"
      aria-labelledby={`department-title-${id}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-lg ${textColor} bg-opacity-20`}>
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <h3
            id={`department-title-${id}`}
            className={`text-xl font-bold ${textColor}`}
          >
            {title}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{grades}</p>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700 mb-2">Subjects Offered:</h4>
        <ul className="space-y-2" role="list">
          {subjects.map((subject, index) => (
            <motion.li
              key={`${id}-${index}`}
              className={`flex items-center ${textColor} text-base`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FaGreaterThan
                className="w-4 h-4 mr-2 flex-shrink-0"
                aria-hidden="true"
              />
              <span>{highlightMatch(subject)}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.button
        className={`mt-6 w-full py-2 px-4 rounded-lg ${textColor} border border-current hover:bg-opacity-10 transition-colors`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Learn more about ${title}`}
      >
        Learn More
      </motion.button>
    </motion.div>
  );
};

export default Departments;
