"use client";
import { Button } from "@/components/ui/button";
import api from "@/utils/common-axios";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCall } from "react-icons/io5";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const pathname = usePathname();

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

  const navItems = ["Home", "About Us", "Courses", "Faculty", "Contact"];

  const isActive = (path) => {
    if (path === "/home") return pathname === "/";
    return pathname === path.toLowerCase().replace(" ", "");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img
              src={`KCC-icon.jpeg`}
              alt="KCC Classes Logo"
              className="w-12 h-12 rounded-full transition-transform duration-300 group-hover:scale-105"
            />
            <span className="md:text-2xl text-xl text-red-500 font-bold group-hover:text-red-600 transition-colors">
              KCC-CLASSES
            </span>
          </Link>

          {/* Mobile Call Button */}
          <a href={`tel:+919765022022`} className="md:hidden">
            <Button className="h-10 text-start text-lg bg-red-600 hover:bg-red-700 transition-colors">
              Call us <IoCall className="ml-2" />
            </Button>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const path = `/${item.toLowerCase().replace(" ", "")}`;
              return (
                <Link
                  key={item}
                  href={path}
                  className={`relative text-gray-700 hover:text-red-500 transition-colors duration-200 ${
                    isActive(path) ? "text-red-500" : ""
                  }`}
                >
                  {item}
                  {isActive(path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href={`tel:+918830986365`}>
              <Button className="h-10 text-lg bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2">
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
              >
                <Button className="h-10 text-md bg-red-600 hover:bg-red-700 transition-colors">
                  {userRole === "admin"
                    ? "Admin Panel"
                    : userRole === "teacher"
                    ? "Teacher Dashboard"
                    : "Student Dashboard"}
                </Button>
              </Link>
            ) : (
              <>
                <div className="relative">
                  <button
                    onClick={() => {
                      setLoginOpen(!loginOpen);
                      setRegisterOpen(false);
                    }}
                    className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center gap-2"
                  >
                    Login{" "}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        loginOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {loginOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg border border-gray-100"
                      >
                        <div className="py-1">
                          {["Student", "Teacher", "Admin"].map((role) => (
                            <Link
                              key={role}
                              href={`/login/${role.toLowerCase()}`}
                              target="_blank"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                              onClick={() => setLoginOpen(false)}
                            >
                              {role} Login
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setRegisterOpen(!registerOpen);
                      setLoginOpen(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
                  >
                    Register{" "}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        registerOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {registerOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg border border-gray-100"
                      >
                        <div className="py-1">
                          {["Student", "Teacher"].map((role) => (
                            <Link
                              key={role}
                              href={`/register/${role.toLowerCase()}-register`}
                              target="_blank"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                              onClick={() => setRegisterOpen(false)}
                            >
                              {role} Register
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-red-500 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              {navItems.map((item) => {
                const path = `/${item.toLowerCase().replace(" ", "")}`;
                return (
                  <Link
                    key={item}
                    href={path}
                    className={`block py-2 text-gray-700 hover:text-red-500 transition-colors ${
                      isActive(path) ? "text-red-500 font-medium" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                );
              })}

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
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full h-10 bg-red-600 hover:bg-red-700 transition-colors">
                    {userRole === "admin"
                      ? "Admin Panel"
                      : userRole === "teacher"
                      ? "Teacher Dashboard"
                      : "Student Dashboard"}
                  </Button>
                </Link>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">
                      Login as:
                    </p>
                    {["Student", "Teacher", "Admin"].map((role) => (
                      <Link
                        key={role}
                        href={`/login/${role.toLowerCase()}`}
                        target="_blank"
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        {role} Login
                      </Link>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">
                      Register as:
                    </p>
                    {["Student", "Teacher"].map((role) => (
                      <Link
                        key={role}
                        href={`/register/${role.toLowerCase()}-register`}
                        target="_blank"
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        {role} Register
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
