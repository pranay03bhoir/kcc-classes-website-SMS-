import React from "react";
import EnquiryAndAddressSection from "@/components/Home/EnquiryAndAddressSection";
import CustomHeading from "@/components/Heading/CustomHeading";

const EnquiryForm = () => {
  return (
    <div>
      <div className={`flex items-center justify-center `}>
        <CustomHeading
          title="Get In Touch"
          padding="md:py-16"
          borderColour="border-white rounded-full"
        />
      </div>
      <div className={`pt-16`}>
        <EnquiryAndAddressSection />
      </div>
    </div>
  );
};

export default EnquiryForm;
