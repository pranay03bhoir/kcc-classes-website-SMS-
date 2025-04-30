"use client";
import Sidebar from "@/Dashboard/StudentDashboard/SideBar";
import api from "@/utils/student-axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
const StudentEnrolledCourses = () => {
  const [subjects, setSubjects] = useState([]);
  const [student, setStudent] = useState(null);
  console.log("Subjects:", subjects);
  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Loading student data...");
      try {
        const response = await api.get("/get/student/details");
        setSubjects(response.data.data.subjects);
        setStudent(response.data.data);
        console.log("Student Data:", response?.status);

        if (response.status === 200) {
          toast.update(toastId, {
            render: response?.data?.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          toast.update(toastId, {
            render: response?.data?.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          // If the access token expired, attempt to refresh using cookies
          const refreshSession = await api.post(
            "/refresh",
            {},
            { withCredentials: true }
          );
          setTimeout(() => {
            window.location.reload();
          }, 1);
          // if (refreshSession.status === 200) {
          //   // If refresh is successful, retry the original request
          //   const retryResponse = await api.get("/get/student/details", {
          //     headers: {
          //       Authorization: `Bearer ${refreshSession?.data?.newAccessToken}`, // Pass new access token if needed
          //     },
          //     withCredentials: true, // Ensures cookies are sent with the request
          //   });

          //   if (retryResponse.status === 200) {
          //     setSubjects(retryResponse.data.data.subjects);
          //     setStudent(retryResponse.data.data);
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
        console.error("Error fetching data:", error);
        toast.update(toastId, {
          render: error?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col gap-6">
      {Array.isArray(subjects) && subjects.length > 0 ? (
        subjects.map(
          (course, index) =>
            course && (
              <div
                key={index}
                className="flex w-full max-w-3xl rounded-xl overflow-hidden shadow-lg border"
              >
                {/* Sidebar */}
                <div>
                  <Sidebar student={student} />
                </div>

                {/* Left Section */}
                <div className="w-1/3 bg-[#2f2a63] text-white p-4 flex flex-col justify-between ms-64">
                  <div>
                    <p className="text-xs uppercase text-gray-300">Course</p>
                    <h2 className="text-xl font-semibold mt-1">
                      {course.name}
                    </h2>
                    <p className="text-sm mt-2 text-gray-300">
                      Code: {course.code}
                    </p>
                  </div>
                  <button className="text-sm text-indigo-200 hover:underline flex items-center mt-4">
                    View all chapters <span className="ml-1">➔</span>
                  </button>
                </div>

                {/* Right Section */}
                <div className="w-2/3 bg-white p-5 flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">
                      Description
                    </p>
                    <h3 className="text-lg font-semibold text-[#2f2a63]">
                      {course.description}
                    </h3>

                    <div className="mt-4 space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Teachers:</strong>{" "}
                        {Array.isArray(course.teachers)
                          ? course.teachers.join(", ")
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Category:</strong> {course.category}
                      </p>
                      <p>
                        <strong>Duration:</strong> {course.duration}
                      </p>
                      <p>
                        <strong>Grade Level:</strong> {course.gradeLevel}
                      </p>
                    </div>
                  </div>

                  {/*<div className="flex justify-between items-center mt-4">*/}
                  {/*  <div className="flex-1 mr-4">*/}
                  {/*    <div className="w-full bg-gray-200 h-2 rounded-full">*/}
                  {/*      <div*/}
                  {/*        className="bg-[#2f2a63] h-2 rounded-full"*/}
                  {/*        style={{ width: "70%" }}*/}
                  {/*      ></div>*/}
                  {/*    </div>*/}
                  {/*    <p className="text-xs text-gray-500 mt-1">*/}
                  {/*      6/9 Challenges*/}
                  {/*    </p>*/}
                  {/*  </div>*/}
                  {/*  <button className="bg-[#2f2a63] text-white px-5 py-1.5 rounded-full shadow hover:bg-[#221d4d] transition">*/}
                  {/*    Continue*/}
                  {/*  </button>*/}
                  {/*</div>*/}
                </div>
              </div>
            )
        )
      ) : (
        <p className="text-gray-600 mx-auto mt-[20%] text-4xl font-extrabold">
          No courses enrolled.
        </p>
      )}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default StudentEnrolledCourses;
