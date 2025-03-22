"use client";
import React from "react";
import { motion } from "framer-motion";
import TopperCards from "@/components/CardComponent/TopperCards";
const MeetOurToppers = () => {
  return (
    <div>
      <div
        className={`text-center flex md:flex-row flex-col md:justify-center gap-5 items-center`}
      >
        <h1 className={`text-xl text-red-700`}>Inspiring Success Stories </h1>
        <span className={`text-4xl hidden md:block`}>|</span>
        <h1 className={`text-4xl text-red-700`}>Our Toppers</h1>
      </div>
      <div className={`pt-10 grid md:grid-cols-4 gap-10`}>
        <TopperCards />
        <TopperCards />
        <TopperCards />
        <TopperCards />
        <TopperCards />
        <TopperCards />
        <TopperCards />
        <TopperCards />
      </div>
    </div>
  );
};

export default MeetOurToppers;
