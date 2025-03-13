"use client";
import React, { useEffect, useState } from "react";
import { Diamond } from "lucide-react";
import { NotebookPen } from "lucide-react";
import { Users } from "lucide-react";
import { Check } from "lucide-react";
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
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  useEffect(() => {
    if (isInView) {
      const controls = animate(count, 1500, { duration: 5 });
      const controlsTeachers = animate(teachers, 15, { duration: 2 });
      const controlsExperience = animate(experience, 10, {
        duration: 2,
      });
      const controlSuccessRate = animate(successRate, 95, { duration: 2 });

      const updateCount = () => setDisplayCount(Math.round(count.get()));
      const updateTeachers = () =>
        setDisplayTeacherCount(Math.round(teachers.get()));
      const updateExperience = () =>
        setDisplayExperienceCount(Math.round(experience.get()));
      const updateSuccessRate = () =>
        setDisplaySuccessRate(Math.round(successRate.get()));
      const interval = setInterval(updateCount, 50); // Update UI every 50ms
      const intervalTeachers = setInterval(updateTeachers, 50); // Update UI every 50ms
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
    <div>
      <div className={`text-center`}>
        <h1 className={`text-4xl font-bold `}>
          Why Choose Our Tutoring Program?
        </h1>
        <p className={`text-lg  pt-5 text-gray-700`}>
          Empowering students with comprehensive education and personalized
          attention
        </p>
      </div>
      <div
        className={`md:flex md:flex-row gap-5 pt-10 px-8 md:px-8 flex flex-col`}
      >
        <div className={`${CommonClassesForCards}`}>
          <div className={`${CommonClassesForTheCardsIcons}`}>
            <Diamond />
          </div>
          <h1 className={`text-xl font-bold mb-2.5`}>Experienced Faculty</h1>
          <p>
            Our teachers bring years of expertise in teaching and mentoring
            students across different boards and subjects.
          </p>
        </div>
        <div className={`${CommonClassesForCards}`}>
          <div className={`${CommonClassesForTheCardsIcons}`}>
            <NotebookPen />
          </div>
          <h1 className={`text-xl font-bold mb-2.5`}>Structured Curriculum</h1>
          <p>
            Well-planned study materials and systematic approach aligned with
            board requirements and exam patterns.
          </p>
        </div>
        <div className={`${CommonClassesForCards}`}>
          <div className={`${CommonClassesForTheCardsIcons}`}>
            <Users />
          </div>
          <h1 className={`text-xl font-bold mb-2.5`}>Personalized Attention</h1>
          <p>
            Small batch sizes and individual attention to help students
            understand concepts and excel in academics.
          </p>
        </div>
      </div>
      <div
        className={`pt-20 px-8 md:grid md:grid-cols-2 flex flex-col gap-10`}
        ref={sectionRef}
      >
        <div>
          <h1 className={`text-2xl font-bold mb-5`}>
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
        </div>
        <div
          className={`grid grid-cols-2 ${CommonClassesForCards} text-center items-center gap-10`}
        >
          <div>
            <h1 className={`md:text-3xl text-2xl font-bold text-blue-600`}>
              {displayCount}+
            </h1>
            <p className={`md:text-lg text-neutral-700`}>Students Taught</p>
          </div>
          <div>
            <h1 className={`md:text-3xl text-2xl font-bold text-blue-600`}>
              {displaySuccessRate}%
            </h1>
            <p className={`text-lg text-neutral-700`}>Success Rate</p>
          </div>
          <div>
            <h1 className={`md:text-3xl text-2xl font-bold text-blue-600`}>
              {displayTeacherCount}+
            </h1>
            <p className={`text-lg text-neutral-700`}>Expert Teachers</p>
          </div>
          <div>
            <h1 className={`md:text-3xl text-2xl font-bold text-blue-600`}>
              {displayExperienceCount}+
            </h1>
            <p className={`text-lg text-neutral-700`}>Years of Experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageSectionTwo;
