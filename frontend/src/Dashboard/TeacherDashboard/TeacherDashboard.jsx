"use client";
import api from "@/utils/teacher-axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import StudentTable from "./StudentManagement/StudentTable";
const TeacherDashboard = () => {
  const [student, setStudent] = useState([]);
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
