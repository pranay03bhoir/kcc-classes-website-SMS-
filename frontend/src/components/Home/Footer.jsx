import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-red-900 text-white pt-10 pb-4">
      <div className="container mx-auto px-5">
        {/* Grid for Contact and Map */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Google Map */}
          <div className="w-full ">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.4506010517784!2d73.32349977421386!3d18.911439057120024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7fbd4d1d5054f%3A0xac3a244af5ef6108!2sKCC%20classes%20(Commerce%20%26%20Science%20classes)!5e0!3m2!1sen!2sin!4v1742556492510!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              className="w-full h-64 md:h-96 rounded-md"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Contact Information */}
          <div className="bg-red-950 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-l-4 border-yellow-400 pl-2">
              Contact Us
            </h2>

            {/* Branch 1 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-yellow-400">
                📍 Karjat (W)
              </h3>
              <p className="text-sm mt-2">
                Raghuvandana Apartment, near Shishu Mandir School,
                <br />
                Opposite Abhinav College, Kotwal Nagar,
                <br />
                Aamrai, Karjat, Maharashtra - 410201
              </p>
            </div>
            <hr className="border-gray-500" />

            <div className={`pt-5`}>
              <h3 className="text-lg font-bold text-yellow-400">📞 Contact</h3>
              <p className="text-sm mt-2">+91 9765022022</p>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-500 pt-5">
          <p className="text-sm">&copy; 2025 KCC CLASSES.</p>
          <div className="flex gap-6 text-xl mt-3 md:mt-0">
            <a href="#" className="hover:text-yellow-400">
              <FaWhatsapp />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
