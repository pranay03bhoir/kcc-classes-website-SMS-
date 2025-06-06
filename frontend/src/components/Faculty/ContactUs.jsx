"use client"
import React from "react";
import CustomHeading from "@/components/Heading/CustomHeading";
import EnquiryAndAddressSection from "@/components/Home/EnquiryAndAddressSection";

const ContactUs = () => {
  return (
    <div>
      <div className="flex justify-center">
        <CustomHeading
          title={`Contact Us`}
          borderColour={`border-white`}
          padding={`py-14`}
        />
      </div>
      <div className="md:pt-40">
        <EnquiryAndAddressSection />
      </div>
    </div>
  );
};

export default ContactUs;
