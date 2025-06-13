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
import { MdScore } from "react-icons/md";

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
    label: "Scores",
    href: "/admindashboard/scores",
    icon: <MdScore />,
    description: "Track and manage students scores",
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed h-screen ${
          isOpen ? "w-64" : "w-16"
        } bg-gray-900 text-white flex flex-col justify-between transition-all duration-300 ease-in-out z-40
        ${
          isMobile
            ? isOpen
              ? "left-0 translate-x-0"
              : "-left-16 -translate-x-full"
            : "left-0"
        }
        shadow-lg`}
      >
        <div className="px-3 py-4 md:px-4 md:py-6">
          <div className="flex items-center justify-between mb-6">
            <h1
              className={`text-xl md:text-2xl font-bold transition-all duration-300 whitespace-nowrap ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Admin Panel
            </h1>
            {isMobile && (
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-gray-800 rounded-full md:hidden"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            )}
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
          className={`px-3 md:px-4 border-t border-gray-800 transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <Card className="bg-gray-800 p-3 md:p-4 space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://api.dicebear.com/6.x/adventurer/svg?seed=admin"
                alt="Admin"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-500"
              />
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-400 truncate">
                  admin@tutoracademy.com
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 text-sm md:text-base"
              onClick={() => setShowLogoutModal(true)}
              disabled={isLoggingOut}
            >
              <FaSignOutAlt className="h-4 w-4 md:h-5 md:w-5" />
              <span className="truncate">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </Button>
          </Card>
        </div>

        {/* Toggle Button - Only show on desktop */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className={`fixed top-4 ${
              isOpen ? "left-[232px]" : "left-4"
            } p-2 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg transition-all duration-300 z-50`}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            <span className="text-white">
              {isOpen ? (
                <FaTimes className="h-4 w-4" />
              ) : (
                <FaBars className="h-4 w-4" />
              )}
            </span>
          </button>
        )}
      </aside>
    </>
  );
}
