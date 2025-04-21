"use client";
import React from "react";
import Sidebar from "./SideBar";
import ProfileCard from "./ProfileCard";
import AttendanceTable from "./AttendanceTable";
import CourseList from "./CourseList";
import ScoreCard from "./ScoreCard";
import SubjectList from "./SubjectList";
const DashBoardStudent = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCard />
          <ScoreCard />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <AttendanceTable />
          <CourseList />
        </div>
        <div className="mt-6">
          <SubjectList />
        </div>
      </main>
    </div>
  );
};

export default DashBoardStudent;
