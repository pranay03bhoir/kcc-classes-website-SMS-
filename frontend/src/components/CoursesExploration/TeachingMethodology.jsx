"use client";

import PillarsOfTeaching from "@/components/CoursesExploration/CourseProgramComponents/PillarsOfTeaching";
import TeachingApproach from "@/components/CoursesExploration/CourseProgramComponents/TeachingApproach";
import CustomHeading from "@/components/Heading/CustomHeading";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const TeachingMethodology = () => {
  return (
    <section
      className="py-16 bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="teaching-methodology-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <motion.div variants={headingVariants} className="flex justify-center mb-8">
            <CustomHeading
              id="teaching-methodology-heading"
              title="Our Teaching Methodology"
              padding="py-14"
              borderColour="border-white"
            />
          </motion.div>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto mt-4"
            variants={headingVariants}
          >
            We believe in a holistic approach to education that combines
            traditional teaching methods with modern pedagogical techniques to
            ensure the best learning outcomes for our students.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-16 md:mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8"
            variants={headingVariants}
          >
            Four Pillars of Our Teaching Methodology
          </motion.h2>
          <motion.div variants={sectionVariants}>
            <PillarsOfTeaching />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-20 md:mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8"
            variants={headingVariants}
          >
            Tailored Approaches for Different Age Groups
          </motion.h2>
          <motion.div variants={sectionVariants}>
            <TeachingApproach />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.a
            href="/about/methodology"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-blue-600 text-lg font-semibold hover:text-blue-700 transition-colors"
            aria-label="Learn more about our teaching methodology"
          >
            Learn More About Our Approach
            <span aria-hidden="true">→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default TeachingMethodology;
