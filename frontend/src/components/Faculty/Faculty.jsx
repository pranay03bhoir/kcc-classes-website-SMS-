"use client";
import BrowseOurDepartment from "@/components/Faculty/BrowseOurDepartment";
import FacultyPageSectionOne from "@/components/Faculty/FacultyPageSectionOne";
import Navbar from "@/components/NavigationBar/NavBar";

import ContactUs from "@/components/Faculty/ContactUs";
import FindYourMentor from "@/components/Faculty/FindYourMentor";
import OurFaculty from "@/components/Faculty/OurFaculty";
import Footer from "@/components/Footer/Footer";

const Faculty = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center overflow-x-hidden">
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
