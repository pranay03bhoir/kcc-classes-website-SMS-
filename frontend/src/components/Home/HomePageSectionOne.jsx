"use client";

import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";

const HomePageSectionOne = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };
  return (
    <div className="bg-[#272726] pt-20 flex flex-col gap-10 md:grid md:grid-cols-2 py-20">
      {/* Left Section */}
      <div className="text-white px-8">
        <h1 className="md:text-5xl text-4xl font-extrabold">
          Transform Your Academic Journey with Expert Tutoring
        </h1>
        <p className="pt-10 text-lg md:text-xl">
          Specialized coaching for grades 5-12 in Science and Commerce streams.
          Join us to excel in your academics with personalized attention and
          proven teaching methods.
        </p>
        <ol className="pt-3">
          <li className="flex pt-5">
            <Check size={24} className="text-blue-600" />
            <span className="pl-3">
              Comprehensive tutoring for all subjects.
            </span>
          </li>
          <li className="flex pt-5">
            <Check size={24} className="text-blue-600" />
            <span className="pl-3">
              Personalized attention from expert faculty.
            </span>
          </li>
          <li className="flex pt-5">
            <Check size={24} className="text-blue-600" />
            <span className="pl-3">
              Proven results with our teaching methods.
            </span>
          </li>
        </ol>
        <div className="md:flex md:gap-5 ">
          <button className="px-4 text-md items-center bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition h-12 md:w-48 w-full cursor-pointer mt-7 flex gap-4 justify-center">
            Explore Courses <ChevronRight size={24} />
          </button>
          <button className="px-4 text-md items-center bg-transparent border-1 text-white rounded-sm hover:bg-neutral-700 transition h-12 md:w-40 w-full cursor-pointer mt-7 flex gap-4 justify-center">
            Book Free Demo
          </button>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div>
        <div className="flex justify-center items-center  px-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-white text-center text-2xl font-bold mb-6">
              Get Started Today
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                placeholder="Student Name"
                {...register("studentName", { required: true })}
                className="w-full px-4 py-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Parent's Email"
                {...register("parentEmail", { required: true })}
                className="w-full px-4 py-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                {...register("phone", { required: true })}
                className="w-full px-4 py-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                {...register("grade", { required: true })}
                className="w-full px-4 py-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Grade</option>
                <option value="5">Grades 5</option>
                <option value="6">Grades 6</option>
                <option value="7">Grades 7</option>
                <option value="8">Grades 8</option>
                <option value="9">Grades 9</option>
                <option value="10">Grades 10</option>

                <option value="11 science">Grades 11 (Science)</option>
                <option value="12 science">Grades 12 (Science)</option>
                <option value="11 commerce">Grades 11 (Commerce)</option>
                <option value="12 commerce">Grades 12 (Commerce)</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
              >
                Schedule Free Consultation
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageSectionOne;
