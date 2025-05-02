"use client";
import CourseCard from "@/components/CardComponent/CourseCard";
import CustomHeading from "@/components/Heading/CustomHeading";
import { Button } from "@/components/ui/button";
import api from "@/utils/common-axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
const EnrollInCourses = () => {
  const buttonData = [
    { id: 1, title: "ALL Subjects" },
    { id: 2, title: "Middle School" },
    { id: 3, title: "High School" },
    { id: 4, title: "Science" },
    { id: 5, title: "Commerce" },
  ];

  const [courseData, setCourseData] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/get/courses");
        setCourseData(response.data.courses);
        if (response.status === 200) {
          // Handle successful response
          console.log("Courses fetched successfully:", response.data);
        }
        if (response.status >= 400) {
          // Handle bad request
          console.error("Bad request:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="flex justify-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <CustomHeading
          title="Our Primary Course Subjects"
          borderColour="border-white rounded-full"
          padding="py-14"
        />
      </motion.div>

      <motion.p
        className="text-gray-500 text-center md:pt-48 pt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Discover our carefully designed curriculum that helps students excel in
        academics and build a strong foundation for future success.
      </motion.p>

      <motion.div
        className="  grid grid-cols-3 md:flex md:flex-row justify-center items-center gap-2 pt-10 py-12 md:px-0 px-10 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {buttonData.map((course, index) => (
          <motion.div
            key={index}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.08 }}
              className=" rounded-full p-3 text-md md:text-lg bg-red-50 transition-colors hover:bg-red-100 md:h-12 md:w-36 text-black"
            >
              {course.title}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-5 md:px-10 px-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {courseData.map((course, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <CourseCard
              title={course.name}
              description={course.description}
              duration={course.duration}
              category={course.category}
              classesPerWeek={course.classesPerWeek}
              gradeLevel={course.gradeLevel}
              rating={course.rating}
              buttonText="Enroll Now"
              isPopular={course.isPopular}
              iconUrl={course.imageUrl}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex justify-center items-center pt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Button
          className={`h-12 w-[20%] bg-blue-600 hover:bg-blue-900 duration-200`}
        >
          View More
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EnrollInCourses;
