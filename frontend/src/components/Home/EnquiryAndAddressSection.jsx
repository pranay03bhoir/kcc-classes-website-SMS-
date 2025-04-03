import React from "react";
import GetInTouchForm from "@/components/FormComponent/GetInTouchForm";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const EnquiryAndAddressSection = () => {
  return (
    <div className="  pt-10 pb-4">
      <div className="container mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="w-full bg-white">
            <GetInTouchForm />
          </div>

          <div className="max-w-2xl mx-auto  space-y-6">
            {/* Contact Information */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaMapMarkerAlt className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-600">
                      Raghuvandana Apartment, near Shishu Mandir School,
                      Opposite Abhinav College, Kotwal Nagar, Aamrai, Karjat,
                      Maharashtra - 410201
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaPhoneAlt className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">+91 9765022022</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaEnvelope className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">kccclasses.KCC@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Map Section */}
            <div className="w-full md:h-[50%] pb-[56.25%] relative r">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.4506010517784!2d73.32349977421386!3d18.911439057120024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7fbd4d1d5054f%3A0xac3a244af5ef6108!2sKCC%20classes%20(Commerce%20%26%20Science%20classes)!5e0!3m2!1sen!2sin!4v1743678948294!5m2!1sen!2sin"
                className="absolute top-0 left-0 w-full h-full border-0 rounded-3xl"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            {/* Business Hours */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Business Hours</h2>
              <div className="grid grid-cols-2 text-gray-600">
                <p>Monday - Friday:</p>{" "}
                <p className="text-right">9:00 AM - 7:00 PM</p>
                <p>Saturday:</p> <p className="text-right">9:00 AM - 5:00 PM</p>
                <p>Sunday:</p> <p className="text-right">Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryAndAddressSection;
