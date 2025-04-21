// app/components/admin/Sidebar.jsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBook,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    href: "/admin/attendance",
    icon: <FaClipboardCheck />,
  },
  { label: "Reports", href: "/admin/reports", icon: <FaChartBar /> },
  { label: "Settings", href: "/admin/settings", icon: <FaCog /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col justify-between">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-gray-800 ${
                pathname === item.href ? "bg-gray-800" : ""
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-4 py-6 border-t border-gray-800">
        <Card className="bg-gray-800 p-4 flex items-center gap-3">
          <img
            src="https://api.dicebear.com/6.x/adventurer/svg?seed=admin"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />
          <div className={`space-y-2 text-center`}>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">admin@tutoracademy.com</p>
            <Button className={`bg-red-500 hover:bg-red-800`}>Logout</Button>
          </div>
        </Card>
      </div>
    </aside>
  );
}
