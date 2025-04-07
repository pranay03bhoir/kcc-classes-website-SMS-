import { motion } from "framer-motion";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

const fadeInVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const CourseProgram = ({
  description = "No description available.",
  curriculum = "No curriculum details provided.",
  keyFeatures = [],
  whyChoose = [],
  enrollButton = "",
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInVariant}
      className="p-6"
    >
      <motion.p variants={fadeInVariant} className="text-gray-700 mb-4">
        {description}
      </motion.p>
      <motion.p variants={fadeInVariant} className="text-gray-700 mb-6">
        {curriculum}
      </motion.p>

      {/* Key Features */}
      <motion.div
        variants={fadeInVariant}
        className="bg-purple-100 p-4 rounded-lg border-l-4 border-purple-600 mb-6"
      >
        <motion.h3
          variants={fadeInVariant}
          className="text-purple-700 font-bold mb-3"
        >
          Key Program Features
        </motion.h3>
        <motion.ul variants={fadeInVariant} className="space-y-2">
          {keyFeatures?.map((feature, index) => (
            <motion.li
              key={index}
              variants={fadeInVariant}
              className="flex items-center gap-2"
            >
              <FaCheckCircle className="text-purple-600" /> {feature}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Why Choose Section */}
      <motion.h3 variants={fadeInVariant} className="text-xl font-bold mb-4">
        Why Choose Our High School Program?
      </motion.h3>
      <motion.div
        variants={fadeInVariant}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        {whyChoose?.map((item, index) => (
          <motion.div
            key={index}
            variants={fadeInVariant}
            className="p-4 bg-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h4 className="font-semibold">{item.title}</h4>
            <p className="text-gray-700 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Enroll Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        variants={fadeInVariant}
        className="mt-6 col-span-2 w-fit bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors md:flex items-center gap-2 hidden"
      >
        Enroll in {enrollButton} Program <FaArrowRight />
      </motion.button>
    </motion.div>
  );
};

export default CourseProgram;
