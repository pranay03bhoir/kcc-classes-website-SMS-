"use client";

import React, { useRef } from "react";
import CustomHeading from "@/components/Heading/CustomHeading";
import { motion, useInView } from "framer-motion";

const ContactPageSectionThree = () => {
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  const inViewCard1 = useInView(card1Ref, { once: true, margin: "-100px" });
  const inViewCard2 = useInView(card2Ref, { once: true, margin: "-100px" });
  const inViewCard3 = useInView(card3Ref, { once: true, margin: "-100px" });

  const cardAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={`pt-16`}>
      <div className={`flex justify-center items-center`}>
        <CustomHeading
          title={`How to Reach Us`}
          padding={`py-14`}
          borderColour={`border-white`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 pt-36">
        {/* Main Learning Center Card */}
        <motion.div
          ref={card1Ref}
          variants={cardAnimation}
          initial="hidden"
          animate={inViewCard1 ? "visible" : "hidden"}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white shadow-md rounded-xl overflow-hidden"
        >
          <div className="bg-gray-800 text-white p-4 text-xl font-bold">
            Main Learning Center
          </div>
          <div className="p-4 space-y-4">
            <div>
              <p className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <span className="text-purple-600">📍</span> Address
              </p>
              <p className="text-gray-600 ml-6">
                Raghuvandana Apartment, near Shishu Mandir
                <br />
                School, opposite Abhinav college, Kotwal nagar
                <br />
                Aamrai, Karjat, Maharashtra 410201
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <span className="text-purple-600">⏰</span> Hours
              </p>
              <p className="text-gray-600 ml-6">
                Monday–Friday: 9am–6pm
                <br />
                Saturday: 9am–5pm
                <br />
                Sunday: Closed
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/place/KCC+classes+(Commerce+%26+Science+classes)/data=!4m2!3m1!1s0x0:0xac3a244af5ef6108?sa=X&ved=1t:2428&ictx=111`}
              target={"_blank"}
            >
              <button className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg w-full hover:bg-purple-700">
                Get Directions
              </button>
            </a>
          </div>
        </motion.div>

        {/* Contact Methods Card */}
        <motion.div
          ref={card2Ref}
          variants={cardAnimation}
          initial="hidden"
          animate={inViewCard2 ? "visible" : "hidden"}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="bg-white shadow-md rounded-xl overflow-hidden"
        >
          <div className="bg-gray-800 text-white p-4 text-xl font-bold">
            Contact Methods
          </div>
          <div className="p-4 space-y-4">
            <div>
              <p className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <span className="text-purple-600">📞</span> Phone
              </p>
              <p className="text-gray-600 ml-6">
                Main: +91 97650 22022
                <br />
                Admissions: (555) 123-8910
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <span className="text-purple-600">✉️</span> Email
              </p>
              <p className="text-gray-600 ml-6">
                kccclasses.KCC@gmail.com
                <br />
                admissions@tutoringacademy.com
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <span className="text-purple-600">💬</span> WhatsApp
              </p>
              <p className="text-gray-600 ml-6">+91 97650 22022</p>
            </div>
            <button className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg w-full hover:bg-purple-700">
              Send a Message
            </button>
          </div>
        </motion.div>

        {/* Social + Newsletter Card */}
        <motion.div
          ref={card3Ref}
          variants={cardAnimation}
          initial="hidden"
          animate={inViewCard3 ? "visible" : "hidden"}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="bg-white shadow-md rounded-xl overflow-hidden"
        >
          <div className="bg-gray-800 text-white p-4 text-xl font-bold">
            Connect With Us
          </div>
          <div className="p-4 space-y-4">
            <p className="text-gray-700">
              Follow us on social media for updates, educational tips, and
              success stories from our students.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="#"
                className="bg-blue-100 text-blue-600 py-2 px-3 rounded-lg text-center font-semibold"
              >
                Facebook
              </a>
              <a
                href="#"
                className="bg-pink-100 text-pink-600 py-2 px-3 rounded-lg text-center font-semibold"
              >
                Instagram
              </a>
              <a
                href="#"
                className="bg-blue-100 text-blue-400 py-2 px-3 rounded-lg text-center font-semibold"
              >
                Twitter
              </a>
              <a
                href="#"
                className="bg-red-100 text-red-600 py-2 px-3 rounded-lg text-center font-semibold"
              >
                YouTube
              </a>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 mt-2">
              <p className="font-semibold mb-2">Newsletter</p>
              <p className="text-gray-600 text-sm mb-3">
                Subscribe to our newsletter for updates and educational
                resources.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-l-lg border border-gray-300"
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPageSectionThree;
