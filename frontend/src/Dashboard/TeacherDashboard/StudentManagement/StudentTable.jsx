"use client";
import api from "@/utils/teacher-axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../SideBar";
import EditStudentModal from "./modals/StudentUpdateModal";

export default function StudentTable({ students }) {
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [batchList, setBatchList] = useState([]);
  const fetchBatches = async () => {
    try {
      const response = await api.get("get/batches"); // ✅ Added await
      setBatchList(response.data.batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };
  const handleSaveEdit = async (updatedData) => {
    const toastId = toast.loading("Updating student...");
    try {
      const studentId = selectedStudent._id;
      const response = await api.put(
        `/update/student/${studentId}`,
        updatedData
      );

      if (response.status === 200) {
        toast.update(toastId, {
          render: response?.data?.message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setIsEditModalOpen(false);
      } else {
        toast.update(toastId, {
          render: response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  useEffect(() => {
    fetchBatches();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const matchesBatch =
      selectedBatch === "All" ||
      student.batches.some((batch) => batch.name === selectedBatch);

    return matchesSearch && matchesBatch;
  });

  return (
    <div>
      <div className="fixed h-screen bg-gray-100">
        <Sidebar />
      </div>
      <div className="p-6 ms-64">
        <h1 className="text-2xl font-bold mb-1">Students</h1>
        <p className="text-sm text-gray-600 mb-4">
          Manage your students and view their details.
        </p>

        {/* Search and Batch Filter */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-4 py-2 w-1/2"
          />
          <div className="flex items-center gap-3">
            <select
              className="border rounded-md px-4 py-2"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="All">All Batches</option>
              <option>Batch A</option>
              <option>Batch B</option>
              <option>Batch C</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              + Add Student
            </button>
          </div>
        </div>

        {/* Student Table */}
        <table className="min-w-full bg-white border rounded-md overflow-hidden shadow-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Attendance</th>
              <th className="px-4 py-3">Avg. Score</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id} className="border-t">
                <td className="px-4 py-3">{student.studentId}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {student.batches.map((batch) => (
                      <span
                        key={batch._id || batch.name}
                        className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full"
                      >
                        {batch.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>{student.attendance}</div>
                  <div className="text-sm text-gray-500">
                    {student.attendedDays}
                  </div>
                </td>
                <td className="px-4 py-3">{student.avgScore}</td>
                <td className="px-4 py-3 space-x-3 text-sm">
                  <button className="text-blue-600 font-medium hover:underline cursor-pointer">
                    View
                  </button>
                  <button
                    className="text-gray-600 hover:underline cursor-pointer"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline cursor-pointer">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination (Static for now) */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>
            Showing {filteredStudents.length > 0 ? 1 : 0} to{" "}
            {Math.min(5, filteredStudents.length)} of {filteredStudents.length}{" "}
            results
          </span>
          <div className="flex space-x-1">
            <button className="px-2 py-1 border rounded hover:bg-gray-100">
              &lt;
            </button>
            {[1, 2, 3, "...", 8, 9].map((page, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 border rounded ${
                  page === 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-2 py-1 border rounded hover:bg-gray-100">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudent}
        onSave={handleSaveEdit}
        batchList={batchList}
      />
    </div>
  );
}
