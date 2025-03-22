"use client";
import React from "react";

const InfoCards = ({ icon: Icon, title, description }) => {
  const CommonClassesForTheCardsIcons =
    "bg-red-300 w-fit p-3 rounded-full mb-5";
  const CommonClassesForCards =
    "rounded-lg p-5 hover:shadow-md transition duration-300 bg-[#FBFAFB] ease-in-out";
  return (
    <div>
      <div className={`${CommonClassesForCards}`}>
        <div className={`${CommonClassesForTheCardsIcons}`}>
          <Icon />
        </div>
        <h1 className="text-xl font-bold mb-2.5 ">{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default InfoCards;
