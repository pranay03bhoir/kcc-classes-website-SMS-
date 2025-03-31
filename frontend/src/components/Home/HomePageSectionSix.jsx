"use client";
import React from "react";
import GetInTouchForm from "@/components/FormComponent/GetInTouchForm";
import { Button } from "@/components/ui/button";
import { IoCall } from "react-icons/io5";
import EnquiryAndAddressSection from "@/components/Home/EnquiryAndAddressSection";
const HomePageSectionSix = () => {
  return (
    <div className={`bg-[#F9F9F9] py-16`}>
      <div className="text-center space-y-5">
        <h1 className={`text-4xl font-bold text-center`}>Get in Touch</h1>
        <p>
          Have questions? We're here to help. Send us a message and we'll
          respond as soon as possible.
        </p>
      </div>
      <EnquiryAndAddressSection />
    </div>
  );
};

export default HomePageSectionSix;
