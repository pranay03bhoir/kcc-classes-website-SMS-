"use client";
import api from "@/utils/student-axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
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

  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Loading student data...");
      try {
        const response = await api.get("/get/student/details");
        if (response.status === 200) {
          setStudentData(response.data.data);
        } else {
          toast.update(toastId, {
            render: response?.data?.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      } catch (err) {
        if (err?.response?.status >= 400) {
          // If the access token expired, attempt to refresh using cookies
          const toastId = toast.loading("Session expired. Refreshing...");
          const refreshSession = await api.post(
            "/refresh",
            {},
            { withCredentials: true }
          );
          setTimeout(() => {
            window.location.reload();
          }, 1);
          toast.update(toastId, {
            render: refreshSession?.data?.message,
            type: "warning",
            isLoading: false,
            autoClose: 2000,
          });

          // Uncomment the following code if you want to handle the refresh token logic

          // if (refreshSession.status === 200) {
          //   // If refresh is successful, retry the original request
          //   const retryResponse = await api.get("/get/student/details", {
          //     headers: {
          //       Authorization: `Bearer ${refreshSession?.data?.newAccessToken}`, // Pass new access token if needed
          //     },
          //     withCredentials: true, // Ensures cookies are sent with the request
          //   });

          //   if (retryResponse.status === 200) {
          //     setStudentData(retryResponse.data.data);
          //     toast.update(toastId, {
          //       render: retryResponse?.data?.message,
          //       type: "success",
          //       isLoading: false,
          //       autoClose: 2000,
          //     });
          //   } else {
          //     toast.update(toastId, {
          //       render:
          //         retryResponse?.data?.message ||
          //         "Failed to load data after refresh.",
          //       type: "error",
          //       isLoading: false,
          //       autoClose: 2000,
          //     });
          //   }
          // } else {
          //   toast.update(toastId, {
          //     render:
          //       refreshSession?.data?.message ||
          //       "Session expired. Please login again.",
          //     type: "warning",
          //     isLoading: false,
          //     autoClose: 2000,
          //   });
          // }
        }
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
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default DashBoardStudent;
