"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import api from "@/utils/teacher-axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaBook,
  FaChartBar,
  FaClipboardCheck,
  FaCog,
  FaHome,
  FaSignOutAlt,
  FaTimes,
  FaUserGraduate,
} from "react-icons/fa";
import { toast } from "react-toastify";

const navItems = [
  {
    label: "Dashboard",
    href: "/teacherDashboard",
    icon: <FaHome />,
    description: "View your dashboard overview",
  },
  {
    label: "Courses",
    href: "/teacherDashboard/courses",
    icon: <FaBook />,
    description: "Manage your courses",
  },
  {
    label: "Students",
    href: "/teacherDashboard/students",
    icon: <FaUserGraduate />,
    description: "View and manage students",
  },
  {
    label: "Attendance",
    href: "/teacherDashboard/attendance",
    icon: <FaClipboardCheck />,
    description: "Track student attendance",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: <FaChartBar />,
    description: "View analytics and reports",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <FaCog />,
    description: "Configure your settings",
  },
];

export default function Sidebar({ teacher }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize for mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      const logout = await api.post("/logout");
      if (logout.status === 200) {
        toast.update(toastId, {
          render: logout?.data?.message || "Logged out successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        window.location.href = "/login/teacher";
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.update(toastId, {
        render: error?.response?.data?.message || "Logout failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const NavItem = ({ item }) => {
    const isActive = pathname === item.href;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={`flex items-center gap-5 px-4 py-3 rounded-lg transition-all duration-200 
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-800 text-gray-300 hover:text-white"
                }
                ${!isOpen && "justify-center px-2"}
              `}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <span
                className={`text-lg ${
                  isActive ? "text-white" : "text-gray-400"
                }`}
              >
                {item.icon}
              </span>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                {item.label}
              </span>
            </Link>
          </TooltipTrigger>
          {!isOpen && (
            <TooltipContent side="right" className="bg-gray-800 text-white">
              <p>{item.label}</p>
              <p className="text-xs text-gray-400">{item.description}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed h-screen ${
          isOpen ? "w-64" : "w-16"
        } bg-gray-900 text-white flex flex-col justify-between transition-all duration-300 ease-in-out z-50
        ${isMobile ? (isOpen ? "left-0" : "-left-16") : "left-0"}`}
      >
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1
              className={`text-2xl font-bold transition-all duration-300 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              Teacher Panel
            </h1>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </nav>
        </div>

        <div
          className={`px-4 py-6 border-t border-gray-800 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <Card className="bg-gray-800 p-4 space-y-4">
            <div className="flex items-center gap-3">
              {teacher.profileImage ? (
                <img
                  src={teacher.profileImage}
                  alt="Teacher"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-500">
                  <span className="text-white font-medium text-lg">
                    {teacher.name
                      ?.split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium text-white truncate max-w-[120px]">
                  {teacher?.name}
                </p>
                <p className="text-xs text-gray-400 truncate max-w-[120px]">
                  {teacher?.email}
                </p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2">
                  <FaSignOutAlt />
                  <span>Logout</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout? You will need to login
                    again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-4 ${
            isOpen ? "left-[232px]" : "left-4"
          } p-2 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg transition-all duration-300 z-50`}
        >
          <span className="text-white">
            {isOpen ? <FaTimes /> : <FaBars />}
          </span>
        </button>
      </aside>
    </>
  );
}
