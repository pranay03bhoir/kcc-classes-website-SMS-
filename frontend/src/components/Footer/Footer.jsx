import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold">KCC classes</h2>
          <p className="mt-2 text-gray-400">
            Empowering students with quality education and personalized
            attention since 2010.
          </p>
          <div className="flex space-x-4 mt-4">
            <FaFacebookF className="text-xl cursor-pointer hover:text-gray-500" />
            <FaTwitter className="text-xl cursor-pointer hover:text-gray-500" />
            <FaInstagram className="text-xl cursor-pointer hover:text-gray-500" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Home</li>
            <li>About</li>
            <li>Courses</li>
            <li>Faculty</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Our Programs */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Our Programs</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Classes 5-8</li>
            <li>Classes 9-10</li>
            <li>Science (11-12)</li>
            <li>Commerce (11-12)</li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-gray-400 w-full">
            <li className="flex items-center w-full space-x-2">
              <FaMapMarkerAlt className={`text-[3rem]`} />
              <span>
                Raghuvandana Apartment, near Shishu Mandir School, Opposite
                Abhinav College, Kotwal Nagar, Aamrai, Karjat, Maharashtra -
                410201
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <FaEnvelope /> <span>kccclasses.KCC@gmail.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaPhoneAlt /> <span>+91 97650 22022</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-400 mt-8 border-t border-gray-700 pt-4">
        <p>&copy; 2024 EduTutor. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-2">
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
          <span>Contact Us</span>
          <span>Careers</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
