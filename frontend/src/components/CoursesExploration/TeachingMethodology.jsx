import React from "react";
import CustomHeading from "@/components/Heading/CustomHeading";
import PillarsOfTeaching from "@/components/CoursesExploration/CourseProgramComponents/PillarsOfTeaching";
import TeachingApproach from "@/components/CoursesExploration/CourseProgramComponents/TeachingApproach";

const TeachingMethodology = () => {
  return (
    <div>
      <div className="flex justify-center pt-10">
        <CustomHeading
          title={"Our Teaching Methodology"}
          padding={`py-14`}
          borderColour={`border-white`}
        />
      </div>
      <div className={`md:pt-44 pt-16`}>
        <h1 className={`text-2xl font-bold text-center`}>
          Four Pillars of Our Teaching Methodology
        </h1>
        <PillarsOfTeaching />
      </div>
      <div className={`pt-20`}>
        <h1 className={`text-2xl font-bold text-center`}>
          Tailored Approaches for Different Age Groups
        </h1>
        <TeachingApproach />
      </div>
    </div>
  );
};

export default TeachingMethodology;
