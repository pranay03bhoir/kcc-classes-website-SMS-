import React from "react";
import AboutUsSectionOne from "@/components/aboutUs/AboutUsSectionOne";
import Navbar from "@/components/NavigationBar/NavBar";
import HomeIntroScreen from "@/components/Home/HomeIntroScreen";
import AboutUsSectionTwo from "@/components/aboutUs/AboutUsSectionTwo";
import VisionAndMission from "@/components/aboutUs/VisionAndMission";
import FacultySection from "@/components/aboutUs/FacultySection";
import StudentSuccessStories from "@/components/aboutUs/StudentSuccessStories";
import EnquiryForm from "@/components/aboutUs/EnquiryForm";
import Footer from "@/components/Footer/Footer";

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <div className={`pt-16`}>
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
      <div className={`pt-16`}>
        <FacultySection />
      </div>
      <div className={`pt-16`}>
        <StudentSuccessStories />
      </div>
      <div className={`pt-36`}>
        <EnquiryForm />
      </div>
      <div className={``}>
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
