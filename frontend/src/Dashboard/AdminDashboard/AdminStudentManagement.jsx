"use client";
import React, { useEffect, useState } from "react";
import AdminSummaryCard from "@/Dashboard/AdminDashboard/components/AdminSummaryCard";
import Sidebar from "@/Dashboard/AdminDashboard/SideBar";
import { FaUserGraduate } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import StudentsAndBatchesManagement from "@/Dashboard/AdminDashboard/components/StudentsAndBatchesManagement";
import { toast, ToastContainer } from "react-toastify";
import api from "@/utils/axios";

const AdminStudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Fetching data...");
      try {
        const [studentsData, coursesData, batchesData, studentCountData] =
          await Promise.all([
            api.get("/students"),
            api.get("/subjects"),
            api.get("/batches"),
            api.get("/students-count"),
          ]);
        setStudents(studentsData.data.students);
        setCourses(coursesData.data.subjects);
        setBatches(batchesData.data.batches);
        setStudentCount(studentCountData.data.studentCount);
        // Simulate data fetching
        toast.update(toastId, {
          render: "Data loaded successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } catch (e) {
        console.error("Error fetching data", e);
        toast.update(toastId, {
          render: "Error fetching data",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <ToastContainer position={`top-center`} />
      <div className={`w-64 fixed h-screen`}>
        <Sidebar />
      </div>
      <div
        className={`flex-1 md:ml-64 lg-2  p-6 space-y-6 text-center`}
      >
        <div
          className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-center`}
        >
          <div>
            <AdminSummaryCard
              icon={<FaUserGraduate />}
              label={`Total Students`}
              value={studentCount}
            />
            <div className={`px-10 pt-2`}>
              <Progress value={studentCount} className="bg-gray-200">
                <div className="bg-blue-600 h-full" style={{ width: "70%" }} />
              </Progress>
            </div>
          </div>
        </div>
        <div>
          <StudentsAndBatchesManagement
            students={students}
            courses={courses}
            batches={batches}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminStudentManagement;
