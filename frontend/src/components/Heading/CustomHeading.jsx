"use client";
import React from "react";
import { motion } from "framer-motion";

const CustomHeading = ({ title, top, padding, borderColour }) => {
  return (
    <motiondiv
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className={`text-center md:z-10 md:absolute ${top} border-2 ${borderColour} ${padding} md:w-[60%] w-full md:rounded-l-full md:rounded-r-full bg-white `}
    >
      <h1
        className={`text-3xl md:text-4xl font-bold relative after:content-[''] after:block after:w-[10%] after:h-1 after:bg-red-500 after:absolute after:-bottom-10 after:left-1/2 after:-translate-x-1/2`}
      >
        {title}
      </h1>
    </motiondiv>
  );
};

export default CustomHeading;
