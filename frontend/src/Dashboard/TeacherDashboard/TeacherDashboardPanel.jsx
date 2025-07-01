"use client";
import InfoCards from "@/components/CardComponent/InfoCards";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getTeacherDetails } from "@/utils/teacher-axios";
import { useEffect, useState } from "react";
import { FaBook, FaLayerGroup, FaUsers } from "react-icons/fa";
import Sidebar from "./SideBar";

const TeacherDashboardPanel = () => {
  const [analytics, setAnalytics] = useState({
    totalBatches: 0,
    totalStudents: 0,
    totalSubjects: 0,
  });
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTeacherDetails();
        const teacher = res.data.teacher;
        if (!teacher) throw new Error("No teacher data found");
        setTeacher(teacher);
        const totalBatches = teacher.batches ? teacher.batches.length : 0;
        // Flatten all students from all batches, then get unique by _id
        const allStudents = (teacher.batches || []).flatMap(
          (batch) => batch.studentIds || []
        );
        const uniqueStudentIds = new Set(allStudents.map((s) => s._id));
        const totalStudents = uniqueStudentIds.size;
        const totalSubjects = teacher.subjects ? teacher.subjects.length : 0;
        setAnalytics({ totalBatches, totalStudents, totalSubjects });
      } catch (err) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Sidebar */}
      <div className="z-40">
        <Sidebar teacher={teacher} />
      </div>
      {/* Main analytics panel */}
      <main className="flex-1 p-6 md:ml-16 flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full">
          <h1 className="text-3xl font-extrabold mb-2 text-gray-800">
            Dashboard Analytics
          </h1>
          <p className="text-gray-500 mb-4 text-lg">
            Quick overview of your teaching assignments
          </p>
          <div className="border-b border-gray-200 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <InfoCards
              icon={FaLayerGroup}
              title="Total Batches Assigned"
              description={analytics.totalBatches}
              className="group transition-transform transform hover:scale-105 shadow-lg rounded-xl bg-white/80 hover:bg-blue-50"
              iconBgColor="from-blue-400 via-cyan-400 to-green-400"
            />
            <InfoCards
              icon={FaUsers}
              title="Total Students Assigned"
              description={analytics.totalStudents}
              className="group transition-transform transform hover:scale-105 shadow-lg rounded-xl bg-white/80 hover:bg-pink-50"
              iconBgColor="from-pink-500 via-red-400 to-yellow-400"
            />
            <InfoCards
              icon={FaBook}
              title="Total Subjects Assigned"
              description={analytics.totalSubjects}
              className="group transition-transform transform hover:scale-105 shadow-lg rounded-xl bg-white/80 hover:bg-purple-50"
              iconBgColor="from-purple-500 via-indigo-400 to-blue-400"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboardPanel;
