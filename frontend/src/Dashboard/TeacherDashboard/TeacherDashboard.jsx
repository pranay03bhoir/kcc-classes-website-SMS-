"use client";
import api from "@/utils/teacher-axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import StudentTable from "./StudentManagement/StudentTable";
const TeacherDashboard = () => {
  const [student, setStudent] = useState([]);
  /**
   * The function `fetchData` asynchronously fetches teacher details and updates a toast notification
   * based on the response status.
   */
  const fetchData = async () => {
    const toastId = toast.loading("Loading students.....");
    try {
      const response = await api.get("get/teacher/details");
      console.log(response.data.teacher.batches);

      setStudent(response.data.teacher.batches); // likely you want to use response.data
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
      <StudentTable students={student} />
    </div>
  );
};

export default TeacherDashboard;
