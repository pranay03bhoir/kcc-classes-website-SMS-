"use client";
import api from "@/utils/student-axios";
import { useEffect, useState } from "react";
import AttendanceTable from "./AttendanceTable";
import CourseList from "./CourseList";
import ProfileCard from "./ProfileCard";
import ScoreCard from "./ScoreCard";
import Sidebar from "./SideBar";
import SubjectList from "./SubjectList";

const DashBoardStudent = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Student Data subjects:", studentData?.subjects);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/get/student/details");
        if (response.status === 200) {
          setStudentData(response.data.data);
          console.log("Data fetched successfully:", response.data.data);
        } else {
          console.error("Failed to fetch data:", response.data.status);
          setError("Failed to fetch student data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching student data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-bounce">Loading student dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      <Sidebar student={studentData} />
      <main className="flex-1 p-6 ms-64">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          <ProfileCard student={studentData} />
          <ScoreCard student={studentData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <AttendanceTable student={studentData} />
          <CourseList student={studentData?.subjects} />
        </div>
        <div className="mt-6">
          <SubjectList student={studentData} />
        </div>
      </main>
    </div>
  );
};

export default DashBoardStudent;
