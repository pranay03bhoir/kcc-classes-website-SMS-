"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { IoCall } from "react-icons/io5";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <img
          src={`KCC-icon.jpeg`}
          alt="KCC Classes Logo"
          className="w-12 h-12 rounded-full"
        />
        <a href="#" className="md:text-2xl text-red-500 font-bold">
          KCC-CLASSES
        </a>
        <a href={`tel:+919765022022`} className={`w-[30%] md:hidden`}>
          <Button className={`h-10 text-start text-lg w-full  bg-red-600`}>
            Call us <IoCall />
          </Button>
        </a>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-gray-700">
          {["Home", "About Us", "Courses", "Faculty", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(" ", "")}`}
              className="hover:text-red-500 transition"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Authentication Buttons */}
        <div className="hidden md:flex space-x-4">
          <a
            href={`tel:+918830986365`}
            className={`w-full flex justify-center items-center`}
          >
            <Button className={`h-10 text-xl w-40 bg-red-600`}>
              Call us <IoCall />
            </Button>
          </a>
          <Link
            href={`/login`}
            target="_blank"
            className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href={`/register`}
            target="_blank"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
              href={`/${item.toLowerCase().replace(" ", "")}`}
              className="text-gray-700 hover:text-red-500 transition"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          {/*<a href={`tel:+918830986365`} className={`w-full`}>*/}
          {/*  <Button className={`h-10 text-start text-lg w-full  bg-red-600`}>*/}
          {/*    Call us <IoCall />*/}
          {/*  </Button>*/}
          {/*</a>*/}
          <Link
            href={`/login`}
            target="_blank"
            className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href={`/register`}
            target="_blank"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Register
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
