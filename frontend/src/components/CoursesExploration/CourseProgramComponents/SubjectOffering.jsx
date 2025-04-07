"use client";
import { motion } from "framer-motion";

const SubjectOffering = ({ title, description, categories, subjects }) => {
  // Scroll animation for each subject
  const subjectVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg border"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="p-6">
        {/* Description */}
        <p className="text-gray-700 mt-4">{description}</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category, index) => (
            <motion.span
              key={index}
              className="bg-purple-100 text-purple-700 px-3 py-1 text-sm rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: false }}
            >
              {category}
            </motion.span>
          ))}
        </div>

        {/* Subjects with Scroll Animation */}
        <div className="mt-6 space-y-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              variants={subjectVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="border-t pt-4"
            >
              {/* Subject Header */}
              <div className="flex items-center gap-2 text-purple-700 font-semibold text-lg">
                {subject.icon} {subject.name}
              </div>

              {/* Subject Description */}
              <p className="text-gray-700 mt-1">{subject.description}</p>

              {/* Study Hours */}
              <p className="text-purple-600 text-sm mt-2">
                {subject.studyHours} |{" "}
                <span className="underline">{subject.extraDetails}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeInVariant}
        className="p-6 bg-white shadow-lg rounded-lg border"
      >
        {/* Heading */}
        <h2 className="text-xl font-bold mb-4">Class Schedule</h2>

        {/* Streams Container */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Science Stream */}
          <div>
            <h3 className="text-purple-700 font-semibold mb-2">
              Science Stream
            </h3>
            <div className="space-y-3">
              <motion.div
                variants={fadeInVariant}
                className="bg-purple-50 p-4 rounded-lg border"
              >
                <p className="font-semibold">Weekday Batches:</p>
                <p>Mon-Fri: 4:00 PM - 8:00 PM</p>
              </motion.div>
              <motion.div
                variants={fadeInVariant}
                className="bg-purple-50 p-4 rounded-lg border"
              >
                <p className="font-semibold">Weekend Batches:</p>
                <p>Sat-Sun: 8:00 AM - 3:00 PM</p>
              </motion.div>
            </div>
          </div>

          {/* Commerce Stream */}
          <div>
            <h3 className="text-blue-700 font-semibold mb-2">
              Commerce Stream
            </h3>
            <div className="space-y-3">
              <motion.div
                variants={fadeInVariant}
                className="bg-blue-50 p-4 rounded-lg border"
              >
                <p className="font-semibold">Weekday Batches:</p>
                <p>Mon-Fri: 4:30 PM - 7:30 PM</p>
              </motion.div>
              <motion.div
                variants={fadeInVariant}
                className="bg-blue-50 p-4 rounded-lg border"
              >
                <p className="font-semibold">Weekend Batches:</p>
                <p>Sat-Sun: 9:00 AM - 2:00 PM</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubjectOffering;
