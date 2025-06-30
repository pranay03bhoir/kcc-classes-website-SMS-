"use client";
import { Button } from "@/components/ui/button";
import api from "@/utils/common-axios";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Loader2, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoCall } from "react-icons/io5";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    login: {},
    register: {},
    dashboard: false,
    nav: {},
  });
  const pathname = usePathname();
  const menuRef = useRef(null);
  const overlayRef = useRef(null);

  // Don't render navbar on dashboard pages
  const isDashboardPage =
    pathname.includes("/admindashboard") ||
    pathname.includes("/studentdashboard") ||
    pathname.includes("/teacherDashboard") ||
    pathname.includes("/teacherdashboard");

  if (isDashboardPage) {
    return null;
  }

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

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = ["Home", "About Us", "Courses", "Faculty", "Contact"];

  const isActive = (path) => {
    if (path === "/home") return pathname === "/";
    return pathname === path.toLowerCase().replace(" ", "");
  };

  const handleLinkClick = (type, role = null, item = null) => {
    if (type === "login") {
      setLoadingStates((prev) => ({
        ...prev,
        login: { ...prev.login, [role]: true },
      }));
    } else if (type === "register") {
      setLoadingStates((prev) => ({
        ...prev,
        register: { ...prev.register, [role]: true },
      }));
    } else if (type === "dashboard") {
      setLoadingStates((prev) => ({
        ...prev,
        dashboard: true,
      }));
    } else if (type === "nav") {
      setLoadingStates((prev) => ({
        ...prev,
        nav: { ...prev.nav, [item]: true },
      }));
    }
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
              <span className="md:text-2xl text-md text-red-500 font-bold group-hover:text-red-600 transition-colors">
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
                  onClick={() => handleLinkClick("nav", null, item)}
                  className={`relative px-4 py-2 text-gray-700 hover:text-red-500 transition-colors duration-200 rounded-lg hover:bg-red-50 flex items-center gap-2 min-w-[100px] justify-center ${
                    isActive(path) ? "text-red-500 font-medium" : ""
                  }`}
                >
                  {loadingStates.nav[item] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {item}
                      {isActive(path) && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-red-500 rounded-full"
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                    </>
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
                    ? "/teacherDashboard"
                    : "/studentdashboard"
                }
                target="_blank"
                onClick={() => handleLinkClick("dashboard")}
              >
                <Button
                  className="h-10 text-md bg-red-500 hover:bg-red-600 transition-colors shadow-sm hover:shadow-md min-w-[160px]"
                  disabled={loadingStates.dashboard}
                >
                  {loadingStates.dashboard ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : userRole === "admin" ? (
                    "Admin Panel"
                  ) : userRole === "teacher" ? (
                    "Teacher Dashboard"
                  ) : (
                    "Student Dashboard"
                  )}
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
                              onClick={() => {
                                handleLinkClick("login", role);
                                setLoginOpen(false);
                              }}
                            >
                              <span className="flex-1">{role} Login</span>
                              {loadingStates.login[role] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <ChevronDown size={14} className="rotate-270" />
                              )}
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
                              onClick={() => {
                                handleLinkClick("register", role);
                                setRegisterOpen(false);
                              }}
                            >
                              <span className="flex-1">{role} Register</span>
                              {loadingStates.register[role] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <ChevronDown size={14} className="rotate-270" />
                              )}
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
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu (Off-canvas) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            ref={menuRef}
            id="mobile-menu"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white z-50 shadow-lg border-l overflow-y-auto"
            style={{ touchAction: "manipulation" }}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <div className="px-4 py-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <Link
                  href="/"
                  className="flex items-center space-x-3 group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative w-10 h-10">
                    <img
                      src={`KCC-icon.jpeg`}
                      alt="KCC Classes Logo"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="text-lg text-red-500 font-bold">
                    KCC-CLASSES
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-lg hover:bg-red-50"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 grid gap-4">
                {navItems.map((item) => {
                  const path = `/${item.toLowerCase().replace(" ", "")}`;
                  return (
                    <Link
                      key={item}
                      href={path}
                      onClick={() => {
                        handleLinkClick("nav", null, item);
                        setIsOpen(false);
                      }}
                      className={`flex items-center px-6 py-4 text-lg text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg min-h-[56px] ${
                        isActive(path)
                          ? "text-red-500 font-medium bg-red-50"
                          : ""
                      }`}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <span className="flex-1">{item}</span>
                      {loadingStates.nav[item] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        isActive(path) && (
                          <motion.div
                            layoutId="mobile-navbar-indicator"
                            className="w-1.5 h-1.5 bg-red-500 rounded-full"
                          />
                        )
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
                      onClick={() => {
                        handleLinkClick("dashboard");
                        setIsOpen(false);
                      }}
                    >
                      <Button
                        className="w-full h-12 bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
                        disabled={loadingStates.dashboard}
                      >
                        {loadingStates.dashboard ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : userRole === "admin" ? (
                          "Admin Panel"
                        ) : userRole === "teacher" ? (
                          "Teacher Dashboard"
                        ) : (
                          "Student Dashboard"
                        )}
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
                              className="flex items-center justify-between px-4 py-3 text-md text-gray-700 bg-white hover:bg-red-50 hover:text-red-500 transition-colors rounded-lg shadow-sm min-h-[48px]"
                              style={{ WebkitTapHighlightColor: "transparent" }}
                              onClick={() => {
                                handleLinkClick("login", role);
                                setIsOpen(false);
                              }}
                            >
                              <span>{role} Login</span>
                              {loadingStates.login[role] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <ChevronDown size={14} className="rotate-270" />
                              )}
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
                              className="flex items-center justify-between px-4 py-3 text-md text-gray-700 bg-white hover:bg-red-50 hover:text-red-500 transition-colors rounded-lg shadow-sm min-h-[48px]"
                              style={{ WebkitTapHighlightColor: "transparent" }}
                              onClick={() => {
                                handleLinkClick("register", role);
                                setIsOpen(false);
                              }}
                            >
                              <span>{role} Register</span>
                              {loadingStates.register[role] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <ChevronDown size={14} className="rotate-270" />
                              )}
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
