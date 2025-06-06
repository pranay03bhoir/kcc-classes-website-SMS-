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
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12">
              <img
                src={`KCC-icon.jpeg`}
                alt="KCC Classes Logo"
                className="w-full h-full rounded-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="md:text-2xl text-xl text-red-500 font-bold group-hover:text-red-600 transition-colors">
                KCC-CLASSES
              </span>
              <span className="text-xs text-gray-500 hidden md:block">
                Empowering Education
              </span>
            </div>
          </Link>

          {/* Mobile Call Button */}
          <a
            href={`tel:+919765022022`}
            className="md:hidden flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
          >
            <IoCall className="text-lg" />
            <span className="text-sm font-medium">Call Us</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const path = `/${item.toLowerCase().replace(" ", "")}`;
              return (
                <Link
                  key={item}
                  href={path}
                  className={`relative px-4 py-2 text-gray-700 hover:text-red-500 transition-colors duration-200 rounded-lg hover:bg-red-50 ${
                    isActive(path) ? "text-red-500 font-medium" : ""
                  }`}
                >
                  {item}
                  {isActive(path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-red-500 rounded-full"
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
              <Button className="h-10 text-lg bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md">
                <IoCall className="text-lg" />
                <span>Call Us</span>
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
                <Button className="h-10 text-md bg-red-500 hover:bg-red-600 transition-colors shadow-sm hover:shadow-md">
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
                    className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
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
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg border border-gray-100 overflow-hidden"
                      >
                        <div className="py-2">
                          {["Student", "Teacher", "Admin"].map((role) => (
                            <Link
                              key={role}
                              href={`/login/${role.toLowerCase()}`}
                              target="_blank"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                              onClick={() => setLoginOpen(false)}
                            >
                              <span className="flex-1">{role} Login</span>
                              <ChevronDown size={14} className="rotate-270" />
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
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
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
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg border border-gray-100 overflow-hidden"
                      >
                        <div className="py-2">
                          {["Student", "Teacher"].map((role) => (
                            <Link
                              key={role}
                              href={`/register/${role.toLowerCase()}-register`}
                              target="_blank"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                              onClick={() => setRegisterOpen(false)}
                            >
                              <span className="flex-1">{role} Register</span>
                              <ChevronDown size={14} className="rotate-270" />
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
            className="md:hidden p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="md:hidden bg-white border-t shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="grid gap-4">
                {navItems.map((item) => {
                  const path = `/${item.toLowerCase().replace(" ", "")}`;
                  return (
                    <Link
                      key={item}
                      href={path}
                      className={`flex items-center px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg ${
                        isActive(path)
                          ? "text-red-500 font-medium bg-red-50"
                          : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex-1">{item}</span>
                      {isActive(path) && (
                        <motion.div
                          layoutId="mobile-navbar-indicator"
                          className="w-1.5 h-1.5 bg-red-500 rounded-full"
                        />
                      )}
                    </Link>
                  );
                })}

                <div className="border-t border-gray-100 pt-4 mt-2">
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
                      <Button className="w-full h-12 bg-red-500 hover:bg-red-600 transition-colors shadow-sm">
                        {userRole === "admin"
                          ? "Admin Panel"
                          : userRole === "teacher"
                          ? "Teacher Dashboard"
                          : "Student Dashboard"}
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Login as:
                        </h3>
                        <div className="grid gap-2">
                          {["Student", "Teacher", "Admin"].map((role) => (
                            <Link
                              key={role}
                              href={`/login/${role.toLowerCase()}`}
                              target="_blank"
                              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 bg-white hover:bg-red-50 hover:text-red-500 transition-colors rounded-lg shadow-sm"
                              onClick={() => setIsOpen(false)}
                            >
                              <span>{role} Login</span>
                              <ChevronDown size={14} className="rotate-270" />
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Register as:
                        </h3>
                        <div className="grid gap-2">
                          {["Student", "Teacher"].map((role) => (
                            <Link
                              key={role}
                              href={`/register/${role.toLowerCase()}-register`}
                              target="_blank"
                              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 bg-white hover:bg-red-50 hover:text-red-500 transition-colors rounded-lg shadow-sm"
                              onClick={() => setIsOpen(false)}
                            >
                              <span>{role} Register</span>
                              <ChevronDown size={14} className="rotate-270" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
