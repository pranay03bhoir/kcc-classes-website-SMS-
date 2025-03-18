import React from "react";
import CommentsCarousel from "@/components/Carousel/CommentsCarousel";

const HomePageSectionFive = () => {
  return (
    <div className="text-center">
      <h1 className={`text-4xl font-bold`}>Student Success Stories</h1>
      <p className={`text-xl`}>Feedback from Our Students</p>
      <CommentsCarousel />
    </div>
  );
};

export default HomePageSectionFive;
