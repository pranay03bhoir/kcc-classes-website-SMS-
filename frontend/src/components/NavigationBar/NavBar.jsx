"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold text-gray-800">
          KCC-CLASSES
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-gray-700">
          {["Home", "About Us", "Courses", "Faculty", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "")}`}
              className="hover:text-blue-500 transition"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Authentication Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link
            href={`/login`}
            target="_blank"
            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href={`/register`}
            target="_blank"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white shadow-md px-6 py-4 flex flex-col space-y-4"
        >
          {["Home", "About Us", "Courses", "Faculty", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "")}`}
              className="text-gray-700 hover:text-blue-500 transition"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <Link
            href={`/login`}
            target="_blank"
            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href={`/register`}
            target="_blank"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Register
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
