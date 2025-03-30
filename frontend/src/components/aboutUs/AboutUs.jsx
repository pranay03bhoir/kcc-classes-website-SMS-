import React from "react";
import AboutUsSectionOne from "@/components/aboutUs/AboutUsSectionOne";
import Navbar from "@/components/NavigationBar/NavBar";
import HomeIntroScreen from "@/components/Home/HomeIntroScreen";
import AboutUsSectionTwo from "@/components/aboutUs/AboutUsSectionTwo";
import VisionAndMission from "@/components/aboutUs/VisionAndMission";

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <div className={`pt-36`}>
        <HomeIntroScreen />
      </div>
      <div className={`pt-16`}>
        <AboutUsSectionOne />
      </div>
      <div className={``}>
        <AboutUsSectionTwo />
      </div>
      <div>
        <VisionAndMission />
      </div>
    </div>
  );
};

export default AboutUs;
