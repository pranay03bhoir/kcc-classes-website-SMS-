"use client";
import api from "@/utils/teacher-axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../SideBar";
import StudentDetailsViewModal from "./modals/StudentDetailsViewModal";
import EditStudentModal from "./modals/StudentUpdateModal";

export default function StudentTable({ students, teacher }) {
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [batchList, setBatchList] = useState([]);
  
  /**
   * The function fetches batches data from an API endpoint and sets the batch list in the component
   * state.
   */
  const fetchBatches = async () => {
    try {
      const response = await api.get("get/batches"); // ✅ Added await
      setBatchList(response.data.batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  // const fetchStudents = async () => {
  //   const toastId = toast.loading("Loading students...");
  //   try {
  //     const response = await api.get("/get/teacher/details");
  //     setStudentList(response.data.teacher.batches.studentIds);
  //   } catch (error) {
  //     console.error("Error fetching students:", error);
  //     const message =
  //       error?.response?.data?.message || "Failed to load students.";
  //     toast.update(toastId, {
  //       render: message,
  //       type: "error",
  //       isLoading: false,
  //       autoClose: 2000,
  //     });
  //   }
  // };
  /**
   * The function `handleSaveEdit` is an asynchronous function that updates a student's data via an API
   * call and displays a toast notification based on the response status.
   */
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
    // fetchStudents();
  }, []);
  const studentList = students.flatMap((student) => student.studentIds);
  const filteredStudents = studentList.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const matchesBatch =
      selectedBatch === "All" ||
      student.batches.some((batch) => batch.name === selectedBatch);

    return matchesSearch && matchesBatch;
  });
  console.log("Filtered Students:", filteredStudents);
  console.log(
    "student data",
    students.flatMap((student) => student.studentIds)
  );

  return (
    <div>
      <div className="fixed h-screen bg-gray-100">
        <Sidebar teacher={teacher} />
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
              {students.map((batch) => (
                <option key={batch._id || batch.name} value={batch.name}>
                  {batch.name}
                </option>
              ))}
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
                    {students.map((batch) => (
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
                  <div
                    className={`${student.attendance.map((attendance) =>
                      attendance.status === "Absent"
                        ? "bg-red-100/50 text-red-800"
                        : attendance.status === "Late"
                        ? "bg-yellow-100/50 text-yellow-800"
                        : "bg-green-100/50 text-green-800"
                    )} rounded-full px-2 py-1 text-xs font-semibold text-center`}
                  >
                    {student.attendance
                      .map((status) => status.status)
                      .join(", ")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {student.attendedDays}
                  </div>
                </td>
                <td className="px-4 py-3">{student.avgScore}</td>
                <td className="px-4 py-3 space-x-3 text-sm">
                  <button
                    className="text-blue-600 font-medium hover:underline cursor-pointer"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsViewModalOpen(true);
                    }}
                  >
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

      <StudentDetailsViewModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        student={selectedStudent}
        batchList={batchList}
      />
    </div>
  );
}
