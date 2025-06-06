"use client";
import ContactForm from "@/components/ContactUs/ContactForm";
import ContactPageSectionOne from "@/components/ContactUs/ContactPageSectionOne";
import ContactPageSectionThree from "@/components/ContactUs/ContactPageSectionThree";
import FaqAccordion from "@/components/ContactUs/FaqAccordian";
import LocationsSection from "@/components/ContactUs/LocationSection";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/NavigationBar/NavBar";
import { motion } from "framer-motion";
import { Suspense } from "react";

// Loading component for suspense
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
  </div>
);

const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </nav>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <motion.div variants={sectionVariants}>
            <ContactPageSectionOne />
          </motion.div>
        </Suspense>

        <motion.div variants={sectionVariants} className="py-16">
          <Suspense fallback={<LoadingSpinner />}>
            <ContactForm />
          </Suspense>
        </motion.div>

        <motion.div variants={sectionVariants} className="py-16">
          <Suspense fallback={<LoadingSpinner />}>
            <ContactPageSectionThree />
          </Suspense>
        </motion.div>

        <motion.div variants={sectionVariants} className="py-16">
          <Suspense fallback={<LoadingSpinner />}>
            <FaqAccordion />
          </Suspense>
        </motion.div>

        <motion.div variants={sectionVariants} className="py-16">
          <Suspense fallback={<LoadingSpinner />}>
            <LocationsSection />
          </Suspense>
        </motion.div>
      </motion.div>

      <motion.div variants={sectionVariants} className="mt-16">
        <Footer />
      </motion.div>
    </div>
  );
};

export default Contact;
