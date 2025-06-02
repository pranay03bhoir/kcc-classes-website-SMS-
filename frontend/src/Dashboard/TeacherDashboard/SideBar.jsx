"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/utils/teacher-axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaBars,
  FaBook,
  FaChartBar,
  FaClipboardCheck,
  FaCog,
  FaHome,
  FaTimes,
  FaUserGraduate,
} from "react-icons/fa";
import { toast } from "react-toastify";

const navItems = [
  { label: "Dashboard", href: "/teacherDashboard", icon: <FaHome /> },
  { label: "Courses", href: "/teacherDashboard/courses", icon: <FaBook /> },
  {
    label: "Students",
    href: "/teacherDashboard/students",
    icon: <FaUserGraduate />,
  },
  {
    label: "Attendance",
    href: "/teacherDashboard/attendance",
    icon: <FaClipboardCheck />,
  },
  { label: "Reports", href: "/admin/reports", icon: <FaChartBar /> },
  { label: "Settings", href: "/admin/settings", icon: <FaCog /> },
];

export default function Sidebar({ teacher }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true); // To toggle sidebar on mobile

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
        // Optionally redirect to login page or clear user state
        window.location.href = "/login/teacher"; // Redirect to login page
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
    console.log("Logout clicked");
  };

  return (
    <aside
      className={`h-screen ${
        isOpen ? "w-64" : "w-2"
      } bg-gray-900 text-white flex flex-col justify-between transition-all duration-300 ease-in-out`}
    >
      <div className="px-4 py-6">
        <h1
          className={`text-2xl font-bold mb-6 transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          Admin Panel
        </h1>
        <nav className={`space-y-2 ${isOpen ? "block" : "hidden"}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-5 px-4 py-2 rounded-lg transition hover:bg-gray-800 ${
                pathname === item.href ? "bg-gray-800" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className={`text-lg`}>{item.icon}</span>
              <span className={`${isOpen ? "block" : "hidden"}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div
        className={`px-4 py-6 border-t border-gray-800 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <Card className={`bg-gray-800 p-4 flex items-center gap-3`}>
          {teacher.profileImage ? (
            <img
              src={teacher.profileImage}
              alt="Teacher"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-700 font-medium text-sm">
                {teacher.name
                  ?.split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
          )}
          <div className={`space-y-2 text-center `}>
            <p className="text-sm font-medium text-white">{teacher?.name}</p>
            <p className="text-xs text-gray-400">{teacher?.email}</p>
          </div>
          <Button
            className={`bg-red-500 hover:bg-red-800`}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Card>
      </div>

      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={` fixed top-4 ${
          isOpen ? "left-50" : "left-4"
        } p-2 bg-gray-800 rounded-full shadow-lg duration-300`}
      >
        <span className="text-white">{isOpen ? <FaTimes /> : <FaBars />}</span>
      </button>
    </aside>
  );
}
