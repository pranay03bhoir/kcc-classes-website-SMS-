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
      <div className={`mx-auto`}>
        <h1 className={`text-2xl text-center pt-16 font-bold`}>OR</h1>
        <div className={`mx-auto`}>
          <a
            href={`tel:+918830986365`}
            className={`w-full flex justify-center items-center px-2 pt-16`}
          >
            <Button className={`h-12 text-xl w-48 bg-green-700`}>
              Call us <IoCall />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePageSectionSix;
