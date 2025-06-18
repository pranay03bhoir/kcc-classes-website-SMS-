"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Separator } from "@/components/ui/separator";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaBook,
  FaChartBar,
  FaClipboardCheck,
  FaClipboardList,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const SidebarItem = ({ icon, label, active }) => {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer
      ${active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800"}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

const navItems = [
  { label: "Dashboard", href: "/studentdashboard", icon: <FaHome /> },
  { label: "Courses", href: "/studentdashboard/courses", icon: <FaBook /> },
  {
    label: "Assignments",
    href: "/studentdashboard/assignments",
    icon: <FaClipboardList />,
  },
  {
    label: "Grades",
    href: "/studentdashboard/grades",
    icon: <FaChartBar />,
  },
  {
    label: "Attendance",
    href: "/studentdashboard/attendance",
    icon: <FaClipboardCheck />,
  },
  {
    label: "Settings",
    href: "/studentdashboard/settings",
    icon: <GearIcon />,
  },
];

export default function Sidebar({ student }) {
  const { logout } = useStudentAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await logout();
      toast.update(toastId, {
        render: "Logged out successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.update(toastId, {
        render: "Logout failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const pathName = usePathname();

  // If student is null or undefined, show loading state
  if (!student) {
    return (
      <aside className="h-screen w-64 fixed bg-gray-900 text-white flex flex-col justify-between p-4">
        <div className="flex flex-col gap-3 text-xl mb-4">
          <h1>Student Panel</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          <Separator className="bg-gray-700" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="text-sm">
              <div className="h-4 bg-gray-700 rounded mb-1 w-20"></div>
              <div className="h-3 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className="h-screen w-64 fixed bg-gray-900 text-white flex flex-col justify-between p-4">
        {/* Top Section */}
        <div>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <div className="flex flex-col gap-3 text-xl mb-4">
            <h1>Student Panel</h1>
            <nav className={`space-y-2`}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-5 px-4 py-2 rounded-lg transition hover:bg-gray-800 ${
                    pathName === item.href ? "bg-gray-800" : ""
                  }`}
                >
                  <SidebarItem icon={item.icon} label={item.label} />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">
          <Separator className="bg-gray-700" />
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={student?.profileImage} />
              <AvatarFallback>
                {student?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "S"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-semibold">{student?.name}</p>
              <p className="text-gray-400 text-xs">{student?.email}</p>
            </div>
          </div>
          <div
            className="flex items-center gap-3 text-gray-400 hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer text-sm"
            onClick={handleLogoutClick}
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      <ConfirmationDialog
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to login again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}
