"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
} from "react-icons/fa";

const socialLinks = [
  {
    icon: FaFacebookF,
    href: "https://facebook.com/kccclasses",
    label: "Facebook",
  },
  { icon: FaTwitter, href: "https://twitter.com/kccclasses", label: "Twitter" },
  {
    icon: FaInstagram,
    href: "https://instagram.com/kccclasses",
    label: "Instagram",
  },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/aboutus" },
  { name: "Courses", href: "/courses" },
  { name: "Faculty", href: "/faculty" },
  { name: "Contact", href: "/contact" },
];

const programs = [
  { name: "Classes 5-8", href: "/programs/classes-5-8" },
  { name: "Classes 9-10", href: "/programs/classes-9-10" },
  { name: "Science (11-12)", href: "/programs/science-11-12" },
  { name: "Commerce (11-12)", href: "/programs/commerce-11-12" },
];

const Footer = () => {
  return (
    <footer
      className="relative bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-zinc-100 py-20 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] before:from-zinc-900/50 before:to-transparent before:pointer-events-none"
      role="contentinfo"
    >
      <div className="relative max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
        {/* Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-5"
        >
          <Link href="/" className="block">
            <h2 className="text-2xl font-light tracking-wide text-white hover:text-zinc-200 transition-colors">
              KCC classes
            </h2>
          </Link>
          <p className="text-zinc-300 text-sm leading-relaxed max-w-xs">
            Empowering students with quality education and personalized
            attention since 2010.
          </p>
          <div className="flex space-x-6 pt-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                aria-label={`Visit our ${label} page`}
              >
                <Icon className="text-lg" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-xs font-medium uppercase tracking-wider mb-6 text-zinc-300">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {quickLinks.map(({ name, href }) => (
              <li key={name}>
                <Link
                  href={href}
                  className="text-zinc-400 hover:text-white text-sm transition-colors duration-300 inline-block hover:translate-x-1 transform"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Our Programs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xs font-medium uppercase tracking-wider mb-6 text-zinc-300">
            Our Programs
          </h3>
          <ul className="space-y-3">
            {programs.map(({ name, href }) => (
              <li key={name}>
                <Link
                  href={href}
                  className="text-zinc-400 hover:text-white text-sm transition-colors duration-300 inline-block hover:translate-x-1 transform"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xs font-medium uppercase tracking-wider mb-6 text-zinc-300">
            Contact Us
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3 group">
              <FaMapMarkerAlt className="text-zinc-400 mt-1 flex-shrink-0 group-hover:text-white transition-colors duration-300" />
              <address className="text-zinc-300 text-sm not-italic group-hover:text-white transition-colors duration-300">
                Raghuvandana Apartment, near Shishu Mandir School, Opposite
                Abhinav College, Kotwal Nagar, Aamrai, Karjat, Maharashtra -
                410201
              </address>
            </li>
            <li className="flex items-center space-x-3 group">
              <FaEnvelope className="text-zinc-400 group-hover:text-white transition-colors duration-300" />
              <a
                href="mailto:kccclasses.KCC@gmail.com"
                className="text-zinc-300 hover:text-white text-sm transition-colors duration-300"
                aria-label="Send us an email"
              >
                kccclasses.KCC@gmail.com
              </a>
            </li>
            <li className="flex items-center space-x-3 group">
              <FaPhoneAlt className="text-zinc-400 group-hover:text-white transition-colors duration-300" />
              <a
                href="tel:+919765022022"
                className="text-zinc-300 hover:text-white text-sm transition-colors duration-300"
                aria-label="Call us"
              >
                +91 97650 22022
              </a>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Copyright Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative max-w-6xl mx-auto px-4 mt-20 pt-8 border-t border-zinc-800/30"
      >
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-zinc-400 text-xs">
            &copy; {new Date().getFullYear()} KCC Classes. All rights reserved.
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-6 text-xs">
              {[
                "Privacy Policy",
                "Terms & Conditions",
                "Contact Us",
                "Careers",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-zinc-400 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
