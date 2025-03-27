import React from "react";
import AboutUsSectionOne from "@/components/aboutUs/AboutUsSectionOne";
import Navbar from "@/components/NavigationBar/NavBar";
import HomeIntroScreen from "@/components/Home/HomeIntroScreen";

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
    </div>
  );
};

export default AboutUs;
