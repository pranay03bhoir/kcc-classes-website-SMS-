"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaBars,
  FaBook,
  FaChalkboardTeacher,
  FaChartBar,
  FaClipboardCheck,
  FaCog,
  FaHome,
  FaTimes,
  FaUserGraduate,
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard", href: "/admindashboard", icon: <FaHome /> },
  { label: "Courses", href: "/admindashboard/courses", icon: <FaBook /> },
  {
    label: "Students",
    href: "/admindashboard/students",
    icon: <FaUserGraduate />,
  },
  {
    label: "Teachers",
    href: "/admindashboard/teachers",
    icon: <FaChalkboardTeacher />,
  },
  {
    label: "Attendance",
    href: "/admindashboard/attendance",
    icon: <FaClipboardCheck />,
  },
  { label: "Reports", href: "/admin/reports", icon: <FaChartBar /> },
  { label: "Settings", href: "/admin/settings", icon: <FaCog /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true); // To toggle sidebar on mobile

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
          <img
            src="https://api.dicebear.com/6.x/adventurer/svg?seed=admin"
            alt="Admin"
            className={`w-10 h-10 rounded-full `}
          />
          <div className={`space-y-2 text-center `}>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">admin@tutoracademy.com</p>
          </div>
          <Button className={`bg-red-500 hover:bg-red-800`}>Logout</Button>
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
