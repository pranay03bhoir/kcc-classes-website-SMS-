"use client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getTeacherDetails } from "@/utils/teacher-axios";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaLayerGroup } from "react-icons/fa6";
import { HiOutlineUserGroup } from "react-icons/hi2";
import Sidebar from "../SideBar";
import BatchDetailsModal from "./modals/BatchDetailsModal";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <FaLayerGroup className="text-6xl text-blue-200 mb-4" />
    <div className="text-lg text-gray-500 font-medium mb-1">
      No batches assigned yet
    </div>
    <div className="text-sm text-gray-400">
      You will see your assigned batches here once available.
    </div>
  </div>
);

const TeacherBatchManagement = () => {
  const [teacher, setTeacher] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTeacherDetails();
        const teacherData = res.data.teacher;
        setTeacher(teacherData);
        setBatches(teacherData?.batches || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to fetch batches"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-100">
      {/* Sidebar */}
      <div className="z-40 flex-shrink-0">
        <Sidebar teacher={teacher} />
      </div>
      {/* Main content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 md:ml-16 flex flex-col justify-center w-full">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 p-2 sm:p-3 shadow-lg">
              <FaLayerGroup className="text-white text-xl sm:text-2xl" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
              My Batches
            </h2>
            <span className="sm:ml-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full w-fit">
              {batches.length} {batches.length === 1 ? "Batch" : "Batches"}
            </span>
          </div>
          {batches.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <div className="rounded-2xl shadow-2xl bg-white/90 backdrop-blur-md p-1 sm:p-4 min-w-[340px]">
                <table className="min-w-full rounded-xl overflow-hidden text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-100 via-cyan-100 to-purple-100 text-gray-700">
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold whitespace-nowrap">
                        Batch Name
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold whitespace-nowrap">
                        Timing
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold whitespace-nowrap">
                        Subject
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold flex items-center gap-1 whitespace-nowrap">
                        <HiOutlineUserGroup className="inline text-blue-400 text-lg" />
                        Students
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch, idx) => (
                      <tr
                        key={batch._id || batch.batchId}
                        className={`border-b last:border-none transition-all duration-150 hover:bg-blue-50/70 ${
                          idx % 2 === 0 ? "bg-white/70" : "bg-blue-50/40"
                        }`}
                      >
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-800 whitespace-nowrap">
                          {batch.name}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 whitespace-nowrap">
                          {batch.timings || "-"}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 whitespace-nowrap">
                          {batch.subjectId?.name || "-"}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-blue-700 font-semibold whitespace-nowrap">
                          {batch.studentIds?.length || 0}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow text-xs sm:text-sm font-semibold transition"
                            onClick={() => setSelectedBatch(batch)}
                          >
                            <FaEye className="text-white text-sm" />
                            <span className="hidden xs:inline">
                              View Details
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {selectedBatch && (
          <BatchDetailsModal
            batchId={selectedBatch._id || selectedBatch.batchId}
            onClose={() => setSelectedBatch(null)}
          />
        )}
      </main>
    </div>
  );
};

export default TeacherBatchManagement;
