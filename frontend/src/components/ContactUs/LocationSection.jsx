"use client";

import { Mail, Map } from "lucide-react";
import React from "react";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";

export default function LocationsSection() {
  return (
    <div className="bg-white rounded-xl shadow-md max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-neutral-800 text-white px-6 py-3 rounded-t-xl text-xl font-bold">
        Our Locations
      </div>

      {/* Map placeholder */}
      <div className=" flex flex-col items-center justify-center h-72 rounded-b-xl text-center px-4 py-6">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.4506010517784!2d73.32349977421386!3d18.911439057120024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7fbd4d1d5054f%3A0xac3a244af5ef6108!2sKCC%20classes%20(Commerce%20%26%20Science%20classes)!5e0!3m2!1sen!2sin!4v1743678948294!5m2!1sen!2sin"
          className=" w-full h-full border-0 rounded-3xl"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Location info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 px-2 sm:px-6">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FaLocationArrow /> Main Learning Center
          </h3>
          <p className="text-gray-700">
            Raghuvandana Apartment, near Shishu Mandir School, opposite Abhinav
            college, Kotwal nagar, Aamrai, Karjat, Maharashtra 410201
          </p>
        </div>
        <div className={`flex gap-5`}>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              {" "}
              <FaPhone /> Contact
            </h3>
            <p className="text-gray-700">+91 97650 22022</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Mail /> Email
            </h3>
            <p className="text-gray-700">kccclasses.KCC@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
