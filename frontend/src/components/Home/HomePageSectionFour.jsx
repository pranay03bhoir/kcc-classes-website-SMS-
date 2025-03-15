"use client";
import React from "react";
import InfoCards from "@/components/CardComponent/InfoCards";
import { GiTeacher } from "react-icons/gi";
import { GiOpenBook } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { FaClock } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa";
const HomePageSectionFour = () => {
  const data = [
    {
      id: 1,
      title: "Expert Teachers",
      description:
        "Our teachers are highly qualified and experienced in their respective fields.",
      icon: GiTeacher,
    },
    {
      id: 2,
      title: "Customized Study Material",
      description:
        "Comprehensive study materials designed by experts for better understanding.",
      icon: GiOpenBook,
    },
    {
      id: 3,
      title: "Regular Assessment",
      description:
        "Regular assessments to keep track of your progress and help you improve.",
      icon: FaCheckCircle,
    },
    {
      id: 4,
      title: "Doubt Resolution",
      description:
        "Get your doubts resolved by our experts and clear your concepts.",
      icon: TiMessages,
    },
    {
      id: 5,
      title: "Flexible Timings",
      description:
        "Multiple batches available to accommodate different schedules.\n" +
        "\n",
      icon: FaClock,
    },
    {
      id: 6,
      title: "Performance Analytics",
      description:
        "Detailed insights into student performance with regular parent updates.",
      icon: FaChartPie,
    },
  ];
  return (
    <div className={``}>
      <div className={`text-center`}>
        <h1 className={`text-4xl font-bold pb-4`}>What Makes Us Different</h1>
        <p className={`text-lg`}>
          Experience excellence in education with our unique features.
        </p>
      </div>
      <div
        className={`md:grid md:grid-cols-3 gap-5 pt-10 px-8 md:px-8 flex flex-col`}
      >
        {data.map((item, index) => (
          <InfoCards
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePageSectionFour;
