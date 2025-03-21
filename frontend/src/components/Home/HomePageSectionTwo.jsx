"use client";
import React, { useEffect, useState, useRef } from "react";
import { Diamond, NotebookPen, Users, Check } from "lucide-react";
import { motion, animate, useInView } from "motion/react";
import { useMotionValue } from "motion/react";

const HomePageSectionTwo = () => {
  const CommonClassesForTheCardsIcons =
    "bg-neutral-300 w-fit p-3 rounded-full mb-5";
  const CommonClassesForCards =
    "rounded-lg p-5 hover:shadow-md transition duration-300 bg-[#FBFAFB] ease-in-out";

  const count = useMotionValue(0);
  const teachers = useMotionValue(0);
  const experience = useMotionValue(0);
  const successRate = useMotionValue(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [displayTeacherCount, setDisplayTeacherCount] = useState(0);
  const [displayExperienceCount, setDisplayExperienceCount] = useState(0);
  const [displaySuccessRate, setDisplaySuccessRate] = useState(0);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, 1500, { duration: 5 });
      const controlsTeachers = animate(teachers, 15, { duration: 2 });
      const controlsExperience = animate(experience, 10, { duration: 2 });
      const controlSuccessRate = animate(successRate, 95, { duration: 2 });

      const updateCount = () => setDisplayCount(Math.round(count.get()));
      const updateTeachers = () =>
        setDisplayTeacherCount(Math.round(teachers.get()));
      const updateExperience = () =>
        setDisplayExperienceCount(Math.round(experience.get()));
      const updateSuccessRate = () =>
        setDisplaySuccessRate(Math.round(successRate.get()));

      const interval = setInterval(updateCount, 50);
      const intervalTeachers = setInterval(updateTeachers, 50);
      const intervalExperience = setInterval(updateExperience, 50);
      const IntervalSuccessRate = setInterval(updateSuccessRate, 50);

      return () => {
        controls.stop();
        controlsTeachers.stop();
        controlsExperience.stop();
        controlSuccessRate.stop();
        clearInterval(interval);
        clearInterval(intervalTeachers);
        clearInterval(intervalExperience);
        clearInterval(IntervalSuccessRate);
      };
    }
  }, [isInView]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold"
        >
          Why Choose Our Tutoring Program?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-lg pt-5 text-gray-700"
        >
          Empowering students with comprehensive education and personalized
          attention
        </motion.p>
      </div>
      <div className="md:flex md:flex-row gap-5 pt-10 px-8 md:px-8 flex flex-col">
        {[
          {
            icon: Diamond,
            title: "Experienced Faculty",
            text: "Our teachers bring years of expertise in teaching and mentoring students across different boards and subjects.",
          },
          {
            icon: NotebookPen,
            title: "Structured Curriculum",
            text: "Well-planned study materials and systematic approach aligned with board requirements and exam patterns.",
          },
          {
            icon: Users,
            title: "Personalized Attention",
            text: "Small batch sizes and individual attention to help students understand concepts and excel in academics.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={CommonClassesForCards}
          >
            <div className={CommonClassesForTheCardsIcons}>
              <item.icon />
            </div>
            <h1 className="text-xl font-bold mb-2.5">{item.title}</h1>
            <p>{item.text}</p>
          </motion.div>
        ))}
      </div>
      <div
        className="pt-20 px-8 md:grid md:grid-cols-2 flex flex-col gap-10"
        ref={sectionRef}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={` px-8 md:grid md:grid-row-2 flex flex-col gap-5`}
          ref={sectionRef}
        >
          <h1 className="text-2xl font-bold mb-5">
            Our Commitment to Excellence
          </h1>
          <p>
            With over years of experience in education, we understand that each
            student has unique learning needs. Our approach combines traditional
            teaching methods with modern technology to ensure comprehensive
            learning.
          </p>
          <ol className="pt-3">
            <li className="flex pt-3">
              <Check size={24} className="text-blue-600" />
              <span className="pl-3">
                Regular progress tracking and reports{" "}
              </span>
            </li>
            <li className="flex pt-3">
              <Check size={24} className="text-blue-600" />
              <span className="pl-3">Practice tests and mock examinations</span>
            </li>
            <li className="flex pt-3">
              <Check size={24} className="text-blue-600" />
              <span className="pl-3">Doubt clearing sessions</span>
            </li>
          </ol>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`grid grid-cols-2 ${CommonClassesForCards} text-center items-center gap-10`}
        >
          {[
            { count: displayCount, text: "Students Taught" },
            { count: displaySuccessRate, text: "Success Rate" },
            { count: displayTeacherCount, text: "Expert Teachers" },
            { count: displayExperienceCount, text: "Years of Experience" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`grid grid-row-2 ${CommonClassesForCards} text-center items-center`}
            >
              <h1 className="md:text-3xl text-2xl font-bold text-blue-600">
                {item.count}+
              </h1>
              <p className="text-lg text-neutral-700">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePageSectionTwo;
