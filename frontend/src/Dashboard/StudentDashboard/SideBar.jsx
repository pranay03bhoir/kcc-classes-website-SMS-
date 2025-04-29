"use client";
// components/Sidebar.jsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  FaBars,
  FaBookOpen,
  FaCalendarAlt,
  FaChartBar,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

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

export default function Sidebar({ student }) {
  return (
    <aside className="h-screen w-64 fixed bg-gray-900 text-white flex flex-col justify-between p-4">
      {/* Top Section */}
      <div>
        <SidebarItem
          icon={<FaBars className="w-4 h-4" />}
          label="Dashboard"
          active
        />

        <div className="mt-4 space-y-2">
          <SidebarItem
            icon={<FaBookOpen className="w-4 h-4" />}
            label="Courses"
          />
          <SidebarItem
            icon={<FaClipboardList className="w-4 h-4" />}
            label="Assignments"
          />
          <SidebarItem
            icon={<FaChartBar className="w-4 h-4" />}
            label="Grades"
          />
          <SidebarItem
            icon={<FaCalendarAlt className="w-4 h-4" />}
            label="Schedule"
          />
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
        <div className="flex items-center gap-3 text-gray-400 hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer text-sm">
          <FaSignOutAlt className="w-4 h-4" />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
}
