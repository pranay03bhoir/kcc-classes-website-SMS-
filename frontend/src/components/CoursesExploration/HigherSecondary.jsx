"use client";
import CourseProgram from "@/components/CoursesExploration/CourseProgramComponents/CoursePrograms";
import SubjectOffering from "@/components/CoursesExploration/CourseProgramComponents/SubjectOffering";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaAtom, FaCalculator, FaDna, FaFlask, FaSignal } from "react-icons/fa";
import { HiOutlinePresentationChartLine } from "react-icons/hi";
import { MdBusinessCenter } from "react-icons/md";

const higherSecondaryProgramData = {
  description:
    "Our Higher Secondary Program is meticulously designed to cater to the needs of students in Classes 11 and 12 pursuing Science and Commerce streams. This crucial stage sets the foundation for students' future academic and career paths, and our curriculum is tailored to ensure they excel in board examinations while preparing for competitive entrance tests.",
  curriculum:
    "With specialized faculty for each subject, we focus on in-depth conceptual understanding, problem-solving abilities, and analytical skills. Our teaching methodology combines theoretical knowledge with practical applications, ensuring students develop a holistic understanding of their subjects.",
  keyFeatures: [
    "Specialized streams for Science (PCM/PCB) and Commerce",
    "Focus on entrance exams (JEE, NEET, CA, etc.)",
    "Regular mock tests and performance analysis",
    "Comprehensive study material and question banks",
  ],
  whyChoose: [
    {
      title: "Subject Matter Experts",
      desc: "Faculty with advanced degrees and teaching experience",
    },
    {
      title: "Dual Focus",
      desc: "Board exam excellence and entrance test preparation",
    },
    {
      title: "Comprehensive Resources",
      desc: "Curated study materials, digital resources, and practice tests",
    },
    {
      title: "Structured Schedule",
      desc: "Balanced timetable with regular assessments and revision sessions",
    },
  ],
};
const scienceStreamData = {
  title: "Science Stream",
  description:
    "Our Science stream program is designed for students pursuing Physics, Chemistry, and Mathematics (PCM) or Physics, Chemistry, and Biology (PCB), with comprehensive coverage of theoretical concepts and practical applications.",
  categories: ["PCM", "PCB", "JEE Preparation", "NEET Preparation"],
  subjects: [
    {
      name: "Physics",
      description:
        "Comprehensive coverage of mechanics, thermodynamics, electricity and magnetism, optics, and modern physics with focus on problem-solving techniques.",
      studyHours: "8 hours weekly",
      extraDetails: "Regular experiments and demonstrations",
      icon: <FaAtom />,
    },
    {
      name: "Chemistry",
      description:
        "In-depth study of organic, inorganic, and physical chemistry with emphasis on reaction mechanisms, periodic properties, and structural analysis.",
      studyHours: "8 hours weekly",
      extraDetails: "Regular lab sessions and molecular modeling",
      icon: <FaFlask />,
    },
    {
      name: "Mathematics (PCM Stream)",
      description:
        "Advanced algebra, calculus, coordinate geometry, trigonometry, and statistics with focus on problem-solving and application-based learning.",
      studyHours: "8 hours weekly",
      extraDetails: "Daily problem-solving sessions",
      icon: <FaCalculator />,
    },
    {
      name: "Biology (PCB Stream)",
      description:
        "Extensive coverage of botany, zoology, human physiology, genetics, and ecology with emphasis on conceptual clarity and diagram-based learning.",
      studyHours: "8 hours weekly",
      extraDetails: "Practical sessions and specimen studies",
      icon: <FaDna />,
    },
  ],
};
const commerceStreamData = {
  title: "Commerce Stream",
  description:
    "Our Commerce program provides a solid foundation in business studies, accountancy, economics, and mathematics with emphasis on practical applications and preparation for higher studies in commerce and management.",
  categories: ["Accountancy", "Business Studies", "Economics", "Mathematics"],
  subjects: [
    {
      name: "Accountancy",
      description:
        "Comprehensive coverage of financial accounting, partnership accounts, company accounts, and computerized accounting with emphasis on practical problem-solving.",
      studyHours: "8 hours weekly",
      extraDetails: "Case studies and practical accounting sessions",
      icon: <FaCalculator />,
    },
    {
      name: "Business Studies",
      description:
        "In-depth study of business environments, management principles, marketing, financial management, and entrepreneurship with focus on current business scenarios.",
      studyHours: "8 hours weekly",
      extraDetails: " Business case analysis and presentations",
      icon: <MdBusinessCenter />,
    },
    {
      name: "Economics",
      description:
        "Comprehensive coverage of microeconomics, macroeconomics, national income, money and banking, and international economics with focus on analytical skills.",
      studyHours: "6 hours weekly",
      extraDetails: "Data analysis and economic condition reviews",
      icon: <HiOutlinePresentationChartLine />,
    },
    {
      name: "Mathematics for Commerce",
      description:
        "Focused on commercial mathematics including algebra, calculus, statistics, and mathematical applications in business and economics.",
      studyHours: "6 hours weekly",
      extraDetails: "Practical application and problem sets",
      icon: <FaSignal />,
    },
  ],
};
const fadeInVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HigherSecondary = () => {
  const [showSubjects, setShowSubjects] = useState("Science Stream");
  const handleSubjectChange = (subject) => {
    setShowSubjects(subject);
  };
  return (
    <div className={`p-6 grid md:grid-cols-2 md:gap-14`}>
      <div className={`md:pt-40`}>
        <CourseProgram
          description={higherSecondaryProgramData.description}
          curriculum={higherSecondaryProgramData.curriculum}
          keyFeatures={higherSecondaryProgramData.keyFeatures}
          whyChoose={higherSecondaryProgramData.whyChoose}
          fadeInVariant={fadeInVariant}
          enrollButton={"Higher Secondary "}
        />
      </div>
      <div className={`md:pt-40 flex flex-col gap-2`}>
        <div className={`grid grid-cols-2 gap-5 `}>
          <Button
            className={`rounded-full bg-neutral-200 text-black hover:bg-purple-400 hover:text-white duration-300 ${
              showSubjects === "Science Stream"
                ? "bg-purple-600 text-white duration-300 hover:bg-purple-600  "
                : ""
            }`}
            onClick={() => handleSubjectChange("Science Stream")}
          >
            Science Stream
          </Button>
          <Button
            className={`rounded-full bg-neutral-200 text-black hover:bg-purple-400 hover:text-white duration-300 ${
              showSubjects === "Commerce Stream"
                ? "bg-purple-600 text-white duration-300 hover:bg-purple-600"
                : ""
            }`}
            onClick={() => handleSubjectChange("Commerce Stream")}
          >
            Commerce Stream
          </Button>
        </div>
        <div
          className={`${
            showSubjects === "Science Stream" ? "block" : "hidden"
          }`}
        >
          <SubjectOffering
            title={scienceStreamData.title}
            description={scienceStreamData.description}
            subjects={scienceStreamData.subjects}
            categories={scienceStreamData.categories}
          />
        </div>
        <div
          className={`${
            showSubjects === "Commerce Stream" ? "block" : "hidden"
          }`}
        >
          <SubjectOffering
            title={commerceStreamData.title}
            description={commerceStreamData.description}
            subjects={commerceStreamData.subjects}
            categories={commerceStreamData.categories}
          />
        </div>
      </div>
    </div>
  );
};

export default HigherSecondary;
