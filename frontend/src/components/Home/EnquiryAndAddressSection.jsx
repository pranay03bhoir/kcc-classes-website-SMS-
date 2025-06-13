"use client";
import GetInTouchForm from "@/components/FormComponent/GetInTouchForm";
import { useState } from "react";
import {
  FaClock,
  FaEnvelope,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const EnquiryAndAddressSection = () => {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [activeContact, setActiveContact] = useState(null);

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      content:
        "Raghuvandana Apartment, near Shishu Mandir School, Opposite Abhinav College, Kotwal Nagar, Aamrai, Karjat, Maharashtra - 410201",
      link: "https://maps.google.com/?q=18.911439,73.323499",
      iconColor: "text-gray-700",
      description: "Visit our location",
    },
    {
      icon: FaPhoneAlt,
      title: "Phone",
      content: "+91 9765022022",
      link: "tel:+919765022022",
      iconColor: "text-gray-700",
      description: "Call us directly",
    },
    {
      icon: FaEnvelope,
      title: "Email",
      content: "kccclasses.KCC@gmail.com",
      link: "mailto:kccclasses.KCC@gmail.com",
      iconColor: "text-gray-700",
      description: "Send us an email",
    },
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 7:00 PM", status: "open" },
    { day: "Saturday", hours: "9:00 AM - 5:00 PM", status: "open" },
    { day: "Sunday", hours: "Closed", status: "closed" },
  ];

  const getCurrentStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    if (day === 0) return "closed"; // Sunday
    if (day === 6 && hour >= 9 && hour < 17) return "open"; // Saturday
    if (day >= 1 && day <= 5 && hour >= 9 && hour < 19) return "open"; // Weekdays
    return "closed";
  };

  const currentStatus = getCurrentStatus();

  return (
    <section
      className="py-24 bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="contact-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Contact Form and Info */}
          <div className="space-y-12">
            <div className="w-full transform transition-all duration-300 hover:scale-[1.01]">
              <GetInTouchForm />
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2
                id="contact-section"
                className="text-2xl font-medium mb-8 text-gray-900 flex items-center"
              >
                <span className="w-1 h-8 bg-blue-500 rounded-full mr-3"></span>
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    target={info.title === "Address" ? "_blank" : undefined}
                    rel={
                      info.title === "Address"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-start space-x-4 group p-4 rounded-xl transition-all duration-300 hover:bg-gray-50"
                    aria-label={`${info.title}: ${info.content}`}
                    onMouseEnter={() => setActiveContact(index)}
                    onMouseLeave={() => setActiveContact(null)}
                  >
                    <div className="mt-1">
                      <div
                        className={`p-3 rounded-full transition-colors duration-300 ${
                          activeContact === index ? "bg-blue-50" : "bg-gray-50"
                        }`}
                      >
                        <info.icon
                          className={`${
                            info.iconColor
                          } text-lg transition-transform duration-300 ${
                            activeContact === index ? "scale-110" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {info.title}
                        </h3>
                        {info.title === "Address" && (
                          <FaExternalLinkAlt className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        )}
                      </div>
                      <p className="mt-1 text-gray-600 leading-relaxed">
                        {info.content}
                      </p>
                      <p className="mt-2 text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {info.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Map and Business Hours */}
          <div className="space-y-12">
            {/* Map Section */}
            <div className="h-[600px] bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8 pb-4">
                <h2 className="text-2xl font-medium text-gray-900 flex items-center">
                  <span className="w-1 h-8 bg-blue-500 rounded-full mr-3"></span>
                  Location
                </h2>
              </div>
              <div className="w-full h-[calc(100%-80px)] relative">
                {isMapLoading && (
                  <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                    <div className="text-gray-400 animate-pulse">
                      Loading map...
                    </div>
                  </div>
                )}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.4506010517784!2d73.32349977421386!3d18.911439057120024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7fbd4d1d5054f%3A0xac3a244af5ef6108!2sKCC%20classes%20(Commerce%20%26%20Science%20classes)!5e0!3m2!1sen!2sin!4v1743678948294!5m2!1sen!2sin"
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setIsMapLoading(false)}
                  title="KCC Classes Location"
                />
              </div>
            </div>

            {/* Business Hours - Centered below map */}
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="relative">
                  <FaClock
                    className="text-gray-700 text-lg"
                    aria-hidden="true"
                  />
                  <span
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      currentStatus === "open" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                </div>
                <h2 className="text-2xl font-medium text-gray-900">
                  Business Hours
                </h2>
              </div>
              <div className="space-y-4">
                {businessHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-700">{schedule.day}</span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`${
                          schedule.status === "closed"
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {schedule.hours}
                      </span>
                      {schedule.status === "open" && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          Open
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryAndAddressSection;
