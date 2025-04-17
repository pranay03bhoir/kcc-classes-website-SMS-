import React from "react";
import FacultyPageSectionOne from "@/components/Faculty/FacultyPageSectionOne";
import Navbar from "@/components/NavigationBar/NavBar";
import BrowseOurDepartment from "@/components/Faculty/BrowseOurDepartment";

import OurFaculty from "@/components/Faculty/OurFaculty";
import FindYourMentor from "@/components/Faculty/FindYourMentor";
import EnquiryAndAddressSection from "@/components/Home/EnquiryAndAddressSection";
import ContactUs from "@/components/Faculty/ContactUs";
import Footer from "@/components/Footer/Footer";

const Faculty = () => {
  return (
    <div>
      <nav>
        <Navbar />
      </nav>
      <div className={`pt-14`}>
        <FacultyPageSectionOne />
      </div>
      <div className={`pt-16`}>
        <BrowseOurDepartment />
      </div>
      <div className={`pt-36`}>
        <OurFaculty />
      </div>
      <div>
        <FindYourMentor />
      </div>
      <div className={`pt-16`}>
        <ContactUs />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Faculty;
