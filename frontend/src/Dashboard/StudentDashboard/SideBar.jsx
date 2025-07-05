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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "react-toastify";

const navItems = [
  {
    label: "Dashboard",
    href: "/studentdashboard",
    icon: <HiOutlineHome />,
    description: "View your dashboard overview",
  },
  {
    label: "Courses",
    href: "/studentdashboard/courses",
    icon: <HiOutlineBookOpen />,
    description: "View your enrolled courses",
  },
  {
    label: "Assignments",
    href: "/studentdashboard/assignments",
    icon: <HiOutlineClipboardDocumentList />,
    description: "View and submit assignments",
  },
  {
    label: "Grades",
    href: "/studentdashboard/grades",
    icon: <HiOutlineChartBar />,
    description: "Check your grades and scores",
  },
  {
    label: "Attendance",
    href: "/studentdashboard/attendance",
    icon: <HiOutlineClipboardDocumentCheck />,
    description: "View your attendance record",
  },
  {
    label: "Settings",
    href: "/studentdashboard/settings",
    icon: <HiOutlineCog6Tooth />,
    description: "Configure your settings",
  },
];

export default function Sidebar({ student }) {
  const { logout } = useStudentAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const NavItem = ({ item }) => {
    const isActive = pathname === item.href;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            aria-label={item.label}
            className={`flex items-center gap-0 px-0 py-2 rounded-md transition-colors duration-150 text-base focus:outline-none
          ${
            isActive
              ? "text-blue-600 font-semibold"
              : "text-gray-700 hover:text-blue-500"
          }
          ${!isOpen && "justify-center"}
        `}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <span className={`text-xl ${isActive ? "" : ""}`}>{item.icon}</span>
            {isOpen && <span className="ml-3 text-sm">{item.label}</span>}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.description}
        </TooltipContent>
      </Tooltip>
    );
  };

  // If student is null or undefined, show loading state
  if (!student) {
    return (
      <aside className="h-screen w-52 fixed bg-white border-r border-gray-200 flex flex-col justify-between p-4 z-40">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 p-2 bg-white hover:bg-gray-100 rounded-md border border-gray-200 z-50 md:hidden"
          aria-label="Open menu"
        >
          <HiOutlineBars3 className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setIsOpen(false)}
          aria-label="Sidebar overlay"
        />
      )}

      <aside
        className={`fixed h-screen top-0 left-0 flex flex-col justify-between transition-all duration-200 z-50
          ${isOpen ? "w-52" : "w-14"}
          bg-white border-r border-gray-200
          ${
            isMobile
              ? isOpen
                ? "translate-x-0"
                : "-translate-x-20"
              : "translate-x-0"
          }
        `}
        aria-label="Sidebar navigation"
      >
        {/* Simple Logo/App Name */}
        <div className="flex items-center px-4 py-4 min-h-[56px]">
          <span
            className={`text-lg font-bold text-gray-900 tracking-tight transition-all duration-200 ${
              isOpen ? "block" : "hidden"
            }`}
          >
            Student Dashboard
          </span>
          <span
            className={`text-lg font-bold text-gray-900 tracking-tight transition-all duration-200 ${
              !isOpen ? "block" : "hidden"
            }`}
          >
            S
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        {/* Profile & Logout */}
        <div className={`px-4 py-4 ${isOpen ? "block" : "hidden"}`}>
          <div className="flex items-center gap-2 mb-2">
            {student?.profileImage ? (
              <img
                src={student.profileImage}
                alt="Student"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-700 font-semibold text-base">
                  {student?.name
                    ?.split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase() || "S"}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs text-gray-900 font-medium truncate max-w-[90px]">
                {student?.name || "Student"}
              </span>
              <span className="text-xs text-gray-400 truncate max-w-[90px]">
                {student?.email || "student@example.com"}
              </span>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center gap-2 px-2 py-1 h-8 text-xs font-normal rounded-md">
                <HiOutlineArrowRightOnRectangle className="text-base" />
                <span>Logout</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to logout? You will need to login again
                  to access your account.
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
        </div>

        {/* Collapsed Sidebar Logout Button */}
        {!isOpen && (
          <div className="px-2 py-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="w-full p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
                  aria-label="Logout"
                >
                  <HiOutlineArrowRightOnRectangle className="text-lg" />
                </button>
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
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-4 ${
            isOpen ? "left-48" : "left-4"
          } p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-md transition-all duration-200 z-50 focus:outline-none`}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <span className="text-gray-700 text-lg">
            {isOpen ? <HiOutlineXMark /> : <HiOutlineBars3 />}
          </span>
        </button>
      </aside>
    </>
  );
}
