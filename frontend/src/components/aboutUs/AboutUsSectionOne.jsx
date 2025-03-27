import React from "react";
import { Button } from "@/components/ui/button";
import { IoCall } from "react-icons/io5";

const AboutUsSectionOne = () => {
  return (
    <div
      className={`grid md:grid-cols-2 bg-gray-900 pt-16 p-6 text-center md:text-start gap-10 md:gap-0`}
    >
      <div className="text-white space-y-10">
        <h1 className={`font-extrabold md:text-5xl text-4xl`}>
          Excel in Academics with Expert Tutoring
        </h1>
        <p className="text-xl">
          Comprehensive tutoring for grades 5-12 in Science and Commerce
          streams. Empowering students to achieve academic excellence.
        </p>
        <div className="space-x-5">
          <Button
            className={`h-15 text-lg bg-red-600 hover:bg-red-800 rounded-4xl`}
          >
            Explore Courses
          </Button>

          <Button
            className={`h-15 text-start text-lg  bg-red-600 hover:bg-red-800 rounded-4xl`}
          >
            Contact us <IoCall />
          </Button>
        </div>
      </div>
      <div className={`w-full`}>
        <div className="flex justify-center items-center w-full bg-gray-900">
          <div className="grid grid-cols-2 gap-4 p-6 bg-gray-800 text-white rounded-xl shadow-lg w-full">
            <div className="p-6 bg-gray-700 rounded-lg text-center">
              <h2 className="text-2xl font-bold">1500+</h2>
              <p className="text-sm">Students</p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg text-center">
              <h2 className="text-2xl font-bold">95%</h2>
              <p className="text-sm">Success Rate</p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg text-center">
              <h2 className="text-2xl font-bold">15+</h2>
              <p className="text-sm">Expert Tutors</p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg text-center">
              <h2 className="text-2xl font-bold">15+</h2>
              <p className="text-sm">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSectionOne;
