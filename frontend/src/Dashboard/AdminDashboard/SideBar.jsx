"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogoutModal } from "@/components/ui/sidebar/LogoutModal";
import { SidebarItem } from "@/components/ui/sidebar/SidebarItem";
import { useLogout } from "@/hooks/useLogout";
import { useSidebar } from "@/hooks/useSidebar";
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
  FaSignOutAlt,
  FaTimes,
  FaUserGraduate,
} from "react-icons/fa";

const navItems = [
  {
    label: "Dashboard",
    href: "/admindashboard",
    icon: <FaHome />,
    description: "View system overview and analytics",
  },
  {
    label: "Courses",
    href: "/admindashboard/courses",
    icon: <FaBook />,
    description: "Manage all courses and curriculum",
  },
  {
    label: "Students",
    href: "/admindashboard/students",
    icon: <FaUserGraduate />,
    description: "Manage student accounts and records",
  },
  {
    label: "Teachers",
    href: "/admindashboard/teachers",
    icon: <FaChalkboardTeacher />,
    description: "Manage teacher accounts and assignments",
  },
  {
    label: "Attendance",
    href: "/admindashboard/attendance",
    icon: <FaClipboardCheck />,
    description: "Track and manage attendance records",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: <FaChartBar />,
    description: "View detailed reports and analytics",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <FaCog />,
    description: "Configure system settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isOpen, isMobile, toggleSidebar, closeSidebar } = useSidebar();
  const { handleLogout, isLoggingOut } = useLogout("/login/admin");

  return (
    <>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={handleLogout}
      />

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed h-screen ${
          isOpen ? "w-64" : "w-16"
        } bg-gray-900 text-white flex flex-col justify-between transition-all duration-300 ease-in-out z-40
        ${isMobile ? (isOpen ? "left-0" : "-left-16") : "left-0"}`}
      >
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1
              className={`text-2xl font-bold transition-all duration-300 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              Admin Panel
            </h1>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isOpen={isOpen}
                isActive={pathname === item.href}
                onMobileClick={() => isMobile && closeSidebar()}
              />
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
              <img
                src="https://api.dicebear.com/6.x/adventurer/svg?seed=admin"
                alt="Admin"
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-400">admin@tutoracademy.com</p>
              </div>
            </div>

            <Button
              className="w-full bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2"
              onClick={() => setShowLogoutModal(true)}
              disabled={isLoggingOut}
            >
              <FaSignOutAlt />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </Button>
          </Card>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
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
