"use client";

import { Button } from "@/components/ui/button";
import { LogoutModal } from "@/components/ui/sidebar/LogoutModal";
import { SidebarItem } from "@/components/ui/sidebar/SidebarItem";
import { useLogout } from "@/hooks/useLogout";
import { useSidebar } from "@/hooks/useSidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    href: "/admindashboard/reports",
    icon: <FaChartBar />,
    description: "View detailed reports and analytics",
  },
  {
    label: "Settings",
    href: "/admindashboard/settings",
    icon: <FaCog />,
    description: "Configure system settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loadingPath, setLoadingPath] = useState(null);
  const { isOpen, isMobile, toggleSidebar, closeSidebar } = useSidebar();
  const { handleLogout, isLoggingOut } = useLogout("/login/admin");

  useEffect(() => {
    const handleClick = (e) => {
      // Find the closest anchor tag
      const anchor = e.target.closest("a");
      if (anchor && anchor.href) {
        const url = new URL(anchor.href);
        // Only set loading for internal navigation
        if (url.pathname.startsWith("/admindashboard")) {
          setLoadingPath(url.pathname);
        }
      }
    };

    // Add click listener to the entire sidebar
    const sidebar = document.querySelector("aside");
    if (sidebar) {
      sidebar.addEventListener("click", handleClick);
    }

    // Reset loading state when pathname changes
    setLoadingPath(null);

    return () => {
      if (sidebar) {
        sidebar.removeEventListener("click", handleClick);
      }
    };
  }, [pathname]);

  return (
    <>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={handleLogout}
      />

      {/* Mobile Menu Button - Only show on mobile when sidebar is collapsed */}
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 p-2 bg-white hover:bg-gray-50 rounded-md shadow-sm border border-gray-100 z-50 md:hidden"
          aria-label="Open menu"
        >
          <FaBars className="h-4 w-4 text-gray-600" />
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed h-screen ${
          isOpen ? "w-56 sm:w-64 lg:w-64" : "w-14 sm:w-16"
        } bg-white text-gray-700 flex flex-col justify-between transition-all duration-300 ease-in-out z-40
        ${
          isMobile
            ? isOpen
              ? "left-0 translate-x-0"
              : "-left-14 sm:-left-16 -translate-x-full"
            : "left-0"
        }
        border-r border-gray-100`}
      >
        <div className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
            <h1
              className={`text-base sm:text-lg lg:text-xl font-medium transition-all duration-300 whitespace-nowrap ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Admin
            </h1>
            {isMobile && (
              <button
                onClick={closeSidebar}
                className="p-1.5 sm:p-2 hover:bg-gray-50 rounded-md md:hidden"
              >
                <FaTimes className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
          <nav className="space-y-0.5 sm:space-y-1">
            {navItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isOpen={isOpen}
                isActive={pathname === item.href}
                isLoading={loadingPath === item.href}
                onMobileClick={() => isMobile && closeSidebar()}
              />
            ))}
          </nav>
        </div>

        <div
          className={`px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-3 border-t border-gray-100 transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 p-2 sm:p-2.5 lg:p-3">
            <img
              src="https://api.dicebear.com/6.x/adventurer/svg?seed=admin"
              alt="Admin"
              className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full"
            />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-700 truncate">
                Admin
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm lg:text-base text-gray-600 hover:text-red-500 hover:bg-red-50"
            onClick={() => setShowLogoutModal(true)}
            disabled={isLoggingOut}
          >
            <FaSignOutAlt className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            <span className="truncate">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          </Button>
        </div>

        {/* Toggle Button - Only show on desktop */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className={`fixed top-2 sm:top-3 lg:top-4 ${
              isOpen
                ? "left-[220px] sm:left-[248px] lg:left-[280px]"
                : "left-3 sm:left-4 lg:left-5"
            } p-1.5 sm:p-2 bg-white hover:bg-gray-50 rounded-md shadow-sm border border-gray-100 transition-all duration-300 z-50 hidden md:block`}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            <span className="text-gray-600">
              {isOpen ? (
                <FaTimes className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <FaBars className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </span>
          </button>
        )}
      </aside>
    </>
  );
}
