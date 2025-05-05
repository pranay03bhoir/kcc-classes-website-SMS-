"use client";
import { Button } from "@/components/ui/button";
import api from "@/utils/common-axios";
import { motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCall } from "react-icons/io5";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await api.get("/auth/check");
        if (response.status === 200) {
          setIsLoggedIn(response.data.loggedIn);
          setUserRole(response.data.role);
          // if (response.data.loggedIn) {
          //   window.location.href = `/${response.data.role}dashboard`;
          // }
        }
      } catch (e) {
        console.log(e);
      }
    };
    checkLoginStatus();
  }, []);

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
          {isLoggedIn ? (
            <Link
              href={
                userRole === "admin"
                  ? "/admindashboard"
                  : userRole === "teacher"
                    ? "/teacherdashboard"
                    : "/studentdashboard"
              }
              target="_blank"
              className="px-4 py-2 bg-white text-white rounded-lg  transition"
            >
              <Button className="h-10 text-md w-40 bg-red-600 cursor-pointer">
                {userRole === "admin"
                  ? "Admin Panel"
                  : userRole === "teacher"
                    ? "Teacher Dashboard"
                    : "Student Dashboard"}
              </Button>
            </Link>
          ) : (
            <div className="relative inline-block text-left">
              <button
                onClick={() => setLoginOpen(!loginOpen)}
                className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition flex items-center gap-2"
              >
                Login <ChevronDown size={16} />
              </button>

              {loginOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg border">
                  <div className="py-1">
                    <Link
                      href="/login/student"
                      target="_blank"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                    >
                      Student Login
                    </Link>
                    <Link
                      href="/login/teacher"
                      target="_blank"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                    >
                      Teacher Login
                    </Link>
                    <Link
                      href="/login/admin"
                      target="_blank"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                    >
                      Admin Login
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setRegisterOpen(!registerOpen)}
              className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 ${
                isLoggedIn ? "hidden" : ""
              }`}
            >
              Register <ChevronDown size={16} />
            </button>

            {registerOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg border">
                <div className="py-1">
                  <Link
                    href="/register/student-register"
                    target="_blank"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                  >
                    Student Register
                  </Link>
                  <Link
                    href="/register/teacher-register"
                    target="_blank"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                  >
                    Teacher Register
                  </Link>
                  {/* <Link
                    href="/register/admin-register"
                    target="_blank"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                  >
                    Admin Register
                  </Link> */}
                </div>
              </div>
            )}
          </div>
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
          {isLoggedIn ? (
            <Link
              href={
                userRole === "admin"
                  ? "/admindashboard"
                  : userRole === "teacher"
                    ? "/teacherdashboard"
                    : "/studentdashboard"
              }
              target="_blank"
              className="px-4 py-2 bg-white text-white rounded-lg  transition"
            >
              <Button className="h-10 text-md w-40 bg-red-600 cursor-pointer">
                {userRole === "admin"
                  ? "Admin Panel"
                  : userRole === "teacher"
                    ? "Teacher Dashboard"
                    : "Student Dashboard"}
              </Button>
            </Link>
          ) : (
            <div className="relative inline-block text-left">
              <button
                onClick={() => setLoginOpen(!loginOpen)}
                className="w-full px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition flex items-center gap-2"
              >
                Login <ChevronDown size={16} />
              </button>

              {loginOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg border">
                  <div className="py-1">
                    <Link
                      href="/login/student"
                      target="_blank"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                    >
                      Student Login
                    </Link>
                    <Link
                      href="/login/teacher"
                      target="_blank"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                    >
                      Teacher Login
                    </Link>
                    <Link
                      href="/login/admin"
                      target="_blank"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                    >
                      Admin Login
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setRegisterOpen(!registerOpen)}
              className={`w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 ${
                isLoggedIn ? "hidden" : ""
              }`}
            >
              Register <ChevronDown size={16} />
            </button>

            {registerOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg border">
                <div className="py-1">
                  <Link
                    href="/register/student-register"
                    target="_blank"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                  >
                    Student Register
                  </Link>
                  <Link
                    href="/register/teacher-register"
                    target="_blank"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                  >
                    Teacher Register
                  </Link>
                  {/* <Link
                    href="/register/admin-register"
                    target="_blank"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                  >
                    Admin Register
                  </Link> */}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
