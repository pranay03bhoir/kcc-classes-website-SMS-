"use client";
// components/Sidebar.jsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import api from "@/utils/student-axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  // { label: "Reports", href: "/admin/reports", icon: <FaChartBar /> },
  // { label: "Settings", href: "/admin/settings", icon: <FaCog /> },
];

export default function Sidebar({ student }) {
  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      // Perform logout logic here (e.g., API call, clearing tokens, etc.)
      const response = await api.post("/logout");
      if (response.status === 200) {
        toast.update(toastId, {
          render: response?.data?.message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        router.push("/"); // Redirect to login page
      } else if (response.status === 401) {
        toast.update(toastId, {
          render: response?.data?.message,
          type: "warning",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          render: response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
      // Clear any stored tokens or user data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Optionally, redirect to the login page or show a success message
      // window.location.href = "/login"; // Redirect to login page

      // Redirect to login page or perform any other action
    } catch (error) {
      console.error("Logout error:", error);
      const message = error?.response?.data?.message || "Logout failed.";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };
  const pathName = usePathname();
  const router = useRouter();
  return (
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
            <AvatarImage src={student.profileImage} />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-semibold">{student.name}</p>
            <p className="text-gray-400 text-xs">{student.email}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-3 text-gray-400 hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer text-sm"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="w-4 h-4" />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
}
