import React from "react";
import CommentsCarousel from "@/components/Carousel/CommentsCarousel";
import CustomHeading from "@/components/Heading/CustomHeading";

const StudentSuccessStories = () => {
  return (
    <div>
      <div className={`flex justify-center items-center text-center`}>
        <CustomHeading
          title={`Student Success Stories`}
          padding={`md:py-14`}
          borderColour={`border-white`}
        />
      </div>
      <div className={`text-center`}>
        <CommentsCarousel />
      </div>
    </div>
  );
};

export default StudentSuccessStories;
