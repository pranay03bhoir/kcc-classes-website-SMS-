"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/Dashboard/AdminDashboard/SideBar";
import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaClock,
  FaEdit,
  FaFire,
  FaGraduationCap,
  FaLayerGroup,
  FaPlus,
  FaSearch,
  FaStar,
  FaTrash,
  FaUserGraduate,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import api from "../../utils/axios";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    category: "",
    duration: "",
    classesPerWeek: "",
    gradeLevel: "",
    rating: 0,
    isPopular: false,
    imageUrl: "",
    teachers: [],
    students: [],
  });

  const [editingIndex, setEditingIndex] = useState(null);

  // Search filters
  const [teacherSearch, setTeacherSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    // Example data initialization, ensuring arrays are not undefined
    const fetchData = async () => {
      const toastId = toast.loading("Loading data...");
      try {
        const [CourseResponse, TeacherResponse, StudentResponse] =
          await Promise.all([
            api.get("/subjects"),
            api.get("/teachers"),
            api.get("/students"),
          ]);
        setCourses(CourseResponse.data.subjects);
        setTeachers(TeacherResponse.data.teachers);
        setStudents(StudentResponse.data.students);
        toast.update(toastId, {
          render: "Data loaded successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } catch (error) {
        toast.update(toastId, {
          render: "Error loading data",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleMultiSelectChange = (e) => {
    const { name, value, checked } = e.target;

    setForm((prevForm) => {
      const selected = prevForm[name] || [];

      if (checked) {
        // Add the value if checked
        return {
          ...prevForm,
          [name]: [...selected, value],
        };
      } else {
        // Remove the value if unchecked
        return {
          ...prevForm,
          [name]: selected.filter((v) => v !== value),
        };
      }
    });
  };

  const handleAddOrUpdate = async () => {
    try {
      if (editingIndex !== null) {
        const updated = await api.put(`/subjects/${form._id}`, form);
        const updatedCourses = [...courses];
        updatedCourses[editingIndex] = updated.data;
        setCourses(updatedCourses);
        setEditingIndex(null);
        toast.success(updated.data.message || "Course updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        const created = await api.post(`/subjects`, form);
        setCourses([...courses, created.data]);
        if (created.status === 200) {
          toast.success(created.data.message || "Course created successfully");
        } else {
          toast.error(created.data.message || "Course creation failed");
        }
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
      setForm({
        code: "",
        name: "",
        description: "",
        category: "",
        duration: "",
        classesPerWeek: "",
        gradeLevel: "",
        rating: 0,
        isPopular: false,
        imageUrl: "",
        teachers: [],
        students: [],
      });
    } catch (e) {
      toast.error(
        e?.created?.data?.message ||
          e?.updated?.data?.message ||
          "Error occurred"
      );
      console.error(e);
    }
  };

  const handleEdit = (index) => {
    const selected = courses[index];
    setForm({ ...selected });
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (index) => {
    try {
      const courseToDelete = courses[index];
      await api.delete(`/subjects/${courseToDelete._id}`);
      setCourses(courses.filter((_, i) => i !== index));
      toast.success("Course deleted successfully");
    } catch (e) {
      toast.error("Error deleting course", e);
      console.log(e);
    }
  };

  // Filtered teachers and students based on search input
  const filteredTeachers = Array.isArray(teachers)
    ? teachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(teacherSearch.toLowerCase())
      )
    : [];
  const filteredStudents = Array.isArray(students)
    ? students?.filter((student) =>
        student.name.toLowerCase().includes(studentSearch.toLowerCase())
      )
    : [];
  if (!courses) {
    return <strong className={`text-2xl font-bold`}>Loading.....</strong>;
  }

  return (
    <div>
      <ToastContainer position={`top-center`} />
      <div className="md:w-64 h-screen fixed border-r bg-gray-100">
        <Sidebar />
      </div>

      <div className="flex-1 md:ml-64 ml-2 p-6 space-y-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <FaBookOpen className="text-blue-600" /> Manage Courses
        </h2>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Course Code
              </label>
              <Input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Course Code (Unique)"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Course Name
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Course Name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Duration
              </label>
              <Input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="Duration (e.g. 3 months)"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Classes per Week
              </label>
              <Input
                type="number"
                name="classesPerWeek"
                value={form.classesPerWeek}
                onChange={handleChange}
                placeholder="Classes per Week"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Grade Level
              </label>
              <Input
                name="gradeLevel"
                value={form.gradeLevel}
                onChange={handleChange}
                placeholder="Grade Level"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Category</option>
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
                <option value="Science Stream">Science Stream</option>
                <option value="Commerce Stream">Commerce Stream</option>
              </select>
            </div>

            <div className="col-span-full">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Course Description"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Image URL
              </label>
              <Input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="Image URL (optional)"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Rating
              </label>
              <Input
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                min="0"
                max="5"
                placeholder="Course Rating"
              />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="isPopular"
                checked={form.isPopular}
                onChange={handleChange}
              />
              <label className="text-sm">Mark as Popular</label>
            </div>

            {/* Teacher Search */}
            <div className="col-span-full">
              <label className="text-sm font-medium text-gray-700">
                Search Teachers
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  placeholder="Search teachers"
                  className="w-full"
                />
                <FaSearch />
              </div>
              <select
                name="teachers"
                multiple
                value={form.teachers}
                onChange={handleMultiSelectChange}
                className="w-full border rounded p-2 mt-2"
              >
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))
                ) : (
                  <option>No teachers found</option>
                )}
              </select>
            </div>

            {/* Student Search */}
            <div className="col-span-full">
              <label className="text-sm font-medium text-gray-700">
                Search Students
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students"
                  className="w-full"
                />
                <FaSearch />
              </div>
              <div className="mt-2">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <div key={student._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="students"
                        value={student._id}
                        checked={form.students.includes(student._id)}
                        onChange={handleMultiSelectChange}
                      />
                      <span>{student.name}</span>
                    </div>
                  ))
                ) : (
                  <p>No students found</p>
                )}
              </div>
            </div>
          </div>

          <Button onClick={handleAddOrUpdate} className="w-full mt-4">
            {editingIndex !== null ? (
              <>
                <FaEdit className="mr-2" /> Update Course
              </>
            ) : (
              <>
                <FaPlus className="mr-2" /> Add Course
              </>
            )}
          </Button>
        </div>

        <div>
          <h1 className={`text-4xl font-bold`}>Courses</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <Card
                key={index}
                className="p-4 shadow-md hover:shadow-lg transition duration-200 rounded-lg bg-white"
              >
                <CardContent className="space-y-3">
                  <div className="flex flex-col items-start gap-2">
                    <h3 className="text-2xl font-semibold text-blue-700">
                      {course.name}
                    </h3>
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-full h-48 object-cover rounded-lg mt-3"
                      />
                    )}
                    <p className="text-sm text-gray-600">
                      {course.description}
                    </p>
                    <p className="text-sm flex items-center gap-1 text-gray-500">
                      <FaLayerGroup /> {course.category}
                    </p>
                    <p className="text-sm flex items-center gap-1 text-gray-500">
                      <FaGraduationCap /> Grade {course.gradeLevel}
                    </p>
                    <p className="text-sm flex items-center gap-1 text-gray-500">
                      <FaClock /> Duration: {course.duration}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < Math.round(course.rating)
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }
                          />
                        ))}
                      </span>
                      <span className="text-sm text-gray-600">
                        {course.rating}
                      </span>
                    </div>
                    {course.isPopular && (
                      <p className="text-sm text-green-600">
                        <FaFire className="inline mr-1" /> Popular Course
                      </p>
                    )}
                    {Array.isArray(course.teachers) &&
                      course.teachers.length > 0 && (
                        <p className="text-sm flex items-center gap-1 text-gray-500">
                          <FaChalkboardTeacher /> Teachers:{" "}
                          {course.teachers
                            .slice(0, 5)
                            .map((teacher) => teacher.name)
                            .join(", ")}
                          {course.teachers.length > 5 ? "...." : ""}
                        </p>
                      )}

                    {Array.isArray(course.students) &&
                      course.students.length > 0 && (
                        <p className="text-sm flex items-center gap-1 text-gray-500">
                          <FaUserGraduate /> Students:{" "}
                          {course.students
                            .slice(0, 5)
                            .map((student) => student.name)
                            .join(", ")}
                          {course.students.length > 5 ? "...." : ""}
                        </p>
                      )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(index)}
                    >
                      <FaEdit className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(index)}
                      className={`bg-red-700 text-white`}
                    >
                      <FaTrash className="mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No courses available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
