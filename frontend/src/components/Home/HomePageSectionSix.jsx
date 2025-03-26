"use client";
import React from "react";
import GetInTouchForm from "@/components/FormComponent/GetInTouchForm";
import { Button } from "@/components/ui/button";
import { IoCall } from "react-icons/io5";
const HomePageSectionSix = () => {
  return (
    <div className={`bg-[#F9F9F9] py-16`}>
      <div>
        <h1 className={`text-4xl font-bold text-center`}>Get in Touch</h1>
      </div>
      <GetInTouchForm />
    </div>
  );
};

export default HomePageSectionSix;
