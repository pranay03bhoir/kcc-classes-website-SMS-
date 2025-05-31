"use client";
import api from "@/utils/teacher-axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import StudentTable from "./StudentManagement/StudentTable";
const TeacherDashboard = () => {
  const [student, setStudent] = useState([]);
  const [teacher, setTeacher] = useState([]);
  /**
   * The function `fetchData` asynchronously fetches teacher details and updates a toast notification
   * based on the response status.
   */
  const fetchData = async () => {
    const toastId = toast.loading("Loading students.....");
    try {
      console.log("Fetching teacher details...");
      const response = await api.get("get/teacher/details");
      // console.log("Full API Response:", response);
      // console.log("Response data:", response.data);
      // console.log("Teacher data:", response.data.teacher);

      if (!response.data.teacher) {
        console.error("Teacher data is undefined in response");
        toast.update(toastId, {
          render: "Error: Teacher data not found in response",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        return;
      }

      setStudent(response.data.teacher.batches);
      setTeacher(response.data.teacher);

      if (response.status === 200) {
        toast.update(toastId, {
          render: response?.data?.message || "Students loaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          render: response?.data?.message || "Something went wrong.",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        console.log("401 detected — attempting refresh");
        const refreshSession = await api.post(
          "/refresh",
          {},
          { withCredentials: true }
        );
        fetchData(); // Retry fetching data after refreshing session
        // console.log("Refresh response:", refreshSession);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1);
      }

      console.error("Error fetching data:", error);
      const message =
        error?.response?.data?.message || "Failed to load students.";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <ToastContainer position="top-center" />
      <StudentTable students={student} teacher={teacher} />
    </div>
  );
};

export default TeacherDashboard;
