"use client";
import React from "react";
import CoursesSectionOne from "@/components/CoursesExploration/CoursesSectionOne";
import Navbar from "@/components/NavigationBar/NavBar";
import CourseCategories from "@/components/CoursesExploration/CourseCategories";
import EnrollInCourses from "@/components/CoursesExploration/EnrollInCourses";
import MiddleSchoolProgram from "@/components/CoursesExploration/MiddleSchoolProgram";
import HighSchoolProgram from "@/components/CoursesExploration/HighSchoolProgram";

const Courses = () => {
  return (
    <div>
      <nav>
        <Navbar />
      </nav>
      <div className={``}>
        <CoursesSectionOne />
      </div>
      <div className="pt-16">
        <CourseCategories />
      </div>
      <div className="pt-16">
        <EnrollInCourses />
      </div>
      <div className="pt-16">
        <MiddleSchoolProgram />
      </div>
      <div className="pt-16">
        <HighSchoolProgram />
      </div>
    </div>
  );
};

export default Courses;
