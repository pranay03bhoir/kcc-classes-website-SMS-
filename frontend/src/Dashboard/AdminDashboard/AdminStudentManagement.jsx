import React from "react";
import AdminSummaryCard from "@/Dashboard/AdminDashboard/components/AdminSummaryCard";
import Sidebar from "@/Dashboard/AdminDashboard/SideBar";
import { FaUserGraduate } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";

const AdminStudentManagement = () => {
  return (
    <div>
      <div className={`w-64 fixed h-screen`}>
        <Sidebar />
      </div>
      <div
        className={`flex-1 md:ml-64 lg-2 bg-gray-100 p-6 space-y-6 text-center`}
      >
        <div
          className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-center`}
        >
          <div>
            <AdminSummaryCard
              icon={<FaUserGraduate />}
              label={`Total Students`}
              value={0}
            />
            <div className={`px-10 pt-2`}>
              <Progress value={70} className="bg-gray-200">
                <div className="bg-blue-600 h-full" style={{ width: "70%" }} />
              </Progress>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentManagement;
