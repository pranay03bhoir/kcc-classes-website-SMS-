"use client";
import React from "react";
import CustomHeading from "@/components/Heading/CustomHeading";
import CourseCard from "@/components/CardComponent/CourseCard";
import { Button } from "@/components/ui/button";

const EnrollInCourses = () => {
  const buttonData = [
    {
      id: 1,
      title: "ALL Courses",
    },
    {
      id: 2,
      title: "Middle School",
    },
    {
      id: 3,
      title: "High School",
    },
    {
      id: 4,
      title: "Science",
    },
    {
      id: 5,
      title: "Commerce",
    },
  ];
  return (
    <div>
      <div className={`flex justify-center `}>
        <CustomHeading
          title={`Our Primary Courses`}
          borderColour={`border-white rounded-full`}
          padding={`py-14`}
        />
      </div>
      <p className={`text-gray-500 text-center md:pt-48 pt-10`}>
        Discover our carefully designed curriculum that helps students excel in
        academics and build a strong foundation for future success.
      </p>
      <div
        className={`grid grid-cols-3 md:flex md:flex-row justify-center gap-5 pt-10 py-12 px-3`}
      >
        {buttonData.map((course, index) => (
          <Button
            key={index}
            className={`rounded-full bg-red-50 hover:bg-red-100 md:h-12 md:w-36 text-black`}
          >
            {course.title}
          </Button>
        ))}
      </div>
      <div className={`grid md:grid-cols-3 gap-5 md:px-10 px-3`}>
        <CourseCard
          title="Mathematics Foundation"
          description="Build a strong mathematical foundation with our comprehensive course covering arithmetic, algebra, geometry, and more."
          duration="3 months"
          classesPerWeek="2 per week"
          gradeLevel="Class 5-8"
          rating={5}
          buttonText="Enroll Now"
          isPopular={true}
          iconUrl="/images/KCC-CLASSES.png"
        />
        <CourseCard
          title="Mathematics Foundation"
          description="Build a strong mathematical foundation with our comprehensive course covering arithmetic, algebra, geometry, and more."
          duration="3 months"
          classesPerWeek="2 per week"
          gradeLevel="Class 5-8"
          rating={5}
          buttonText="Enroll Now"
          isPopular={true}
          iconUrl="/images/KCC-CLASSES.png"
        />
        <CourseCard
          title="Mathematics Foundation"
          description="Build a strong mathematical foundation with our comprehensive course covering arithmetic, algebra, geometry, and more."
          duration="3 months"
          classesPerWeek="2 per week"
          gradeLevel="Class 5-8"
          rating={5}
          buttonText="Enroll Now"
          isPopular={true}
          iconUrl="/images/KCC-CLASSES.png"
        />
      </div>
    </div>
  );
};

export default EnrollInCourses;
