"use client";
import React from "react";
import ContactPageSectionOne from "@/components/ContactUs/ContactPageSectionOne";
import Navbar from "@/components/NavigationBar/NavBar";
import ContactForm from "@/components/ContactUs/ContactForm";
import ContactPageSectionThree from "@/components/ContactUs/ContactPageSectionThree";
import FaqAccordion from "@/components/ContactUs/FaqAccordian";
import LocationsSection from "@/components/ContactUs/LocationSection";
import Footer from "@/components/Footer/Footer";

const Contact = () => {
  return (
    <div>
      <nav>
        <Navbar />
      </nav>
      <div>
        <ContactPageSectionOne />
      </div>
      <div className={`pt-16`}>
        <ContactForm />
      </div>
      <div className={`pt-16`}>
        <ContactPageSectionThree />
      </div>
      <div className={`pt-16`}>
        <FaqAccordion />
      </div>
      <div className={`pt-16`}>
        <LocationsSection />
      </div>
      <div className={`pt-16`}>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
