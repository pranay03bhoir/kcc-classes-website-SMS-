"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/Dashboard/AdminDashboard/SideBar";
import { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaClock,
  FaEdit,
  FaFire,
  FaLayerGroup,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUserGraduate,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import api from "../../utils/axios";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseIndex, setCourseIndex] = useState(null);
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
      setDeleteModalOpen(false);
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
    <div className="flex min-h-screen flex-col md:flex-row">
      <ToastContainer position="top-center" />
      <div className="w-full md:w-64 fixed h-full z-30">
        <Sidebar />
      </div>

      <div className="flex-1 md:ml-64 bg-[#f9fafb] p-4 md:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center">
                  <span className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                    <FaChalkboardTeacher className="text-2xl" />
                  </span>
                  Course Management
                </h1>
                <p className="text-blue-100 text-lg">
                  Create, edit, and manage all your educational courses
                </p>
              </div>
              <Button
                onClick={() => {
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
                  setEditingIndex(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full md:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <FaPlus className="mr-2" /> Add New Course
              </Button>
            </div>
          </div>

          {/* Course Form */}
          <Card className="p-4 md:p-6 bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {editingIndex !== null ? "Edit Course" : "Add New Course"}
              </h2>
              <p className="text-gray-600">
                {editingIndex !== null
                  ? "Update the course information below"
                  : "Fill in the details to create a new course"}
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddOrUpdate();
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <span className="bg-blue-100 p-1 rounded-full mr-2">
                      <FaEdit className="text-blue-600 text-xs" />
                    </span>
                    Course Code
                  </label>
                  <Input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g., MATH101"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <span className="bg-green-100 p-1 rounded-full mr-2">
                      <FaChalkboardTeacher className="text-green-600 text-xs" />
                    </span>
                    Course Name
                  </label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Advanced Mathematics"
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <span className="bg-purple-100 p-1 rounded-full mr-2">
                      <FaLayerGroup className="text-purple-600 text-xs" />
                    </span>
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Middle School">Middle School</option>
                    <option value="High School">High School</option>
                    <option value="Science Stream">Science Stream</option>
                    <option value="Commerce Stream">Commerce Stream</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <span className="bg-orange-100 p-1 rounded-full mr-2">
                      <FaClock className="text-orange-600 text-xs" />
                    </span>
                    Duration
                  </label>
                  <Input
                    name="duration"
                    type="text"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g., 6 months"
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <span className="bg-indigo-100 p-1 rounded-full mr-2">
                      <FaUserGraduate className="text-indigo-600 text-xs" />
                    </span>
                    Classes per Week
                  </label>
                  <Input
                    name="classesPerWeek"
                    type="number"
                    value={form.classesPerWeek}
                    onChange={handleChange}
                    placeholder="e.g., 3"
                    className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <span className="bg-teal-100 p-1 rounded-full mr-2">
                      <FaFire className="text-teal-600 text-xs" />
                    </span>
                    Grade Level
                  </label>
                  <Input
                    name="gradeLevel"
                    value={form.gradeLevel}
                    onChange={handleChange}
                    placeholder="e.g., Grade 10"
                    className="border-gray-200 focus:border-teal-500 focus:ring-teal-500 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <span className="bg-yellow-100 p-1 rounded-full mr-2">
                      <span className="text-yellow-600 text-xs">⭐</span>
                    </span>
                    Rating (0-5)
                  </label>
                  <Input
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="e.g., 4.5"
                    className="border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <span className="bg-pink-100 p-1 rounded-full mr-2">
                      <FaSearch className="text-pink-600 text-xs" />
                    </span>
                    Image URL
                  </label>
                  <Input
                    name="imageUrl"
                    type="url"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="e.g., https://example.com/image.jpg"
                    className="border-gray-200 focus:border-pink-500 focus:ring-pink-500 transition-all duration-200"
                  />
                  {form.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={form.imageUrl}
                        alt="Course preview"
                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter course description..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Teachers Section */}
                <div className="space-y-4 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <span className="bg-purple-100 p-2 rounded-full mr-3">
                        <FaChalkboardTeacher className="text-purple-600" />
                      </span>
                      Assign Teachers
                    </h3>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search teachers..."
                        value={teacherSearch}
                        onChange={(e) => setTeacherSearch(e.target.value)}
                        className="pl-10 w-full md:w-48 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 p-3 border border-purple-200 rounded-lg bg-white">
                    {filteredTeachers.map((teacher) => (
                      <label
                        key={teacher._id}
                        className="flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors duration-200 border border-transparent hover:border-purple-200"
                      >
                        <input
                          type="checkbox"
                          name="teachers"
                          value={teacher._id}
                          checked={form.teachers.includes(teacher._id)}
                          onChange={handleMultiSelectChange}
                          className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">
                            {teacher.name}
                          </span>
                          {teacher.email && (
                            <p className="text-xs text-gray-500">
                              {teacher.email}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Students Section */}
                <div className="space-y-4 bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <span className="bg-green-100 p-2 rounded-full mr-3">
                        <FaUserGraduate className="text-green-600" />
                      </span>
                      Enroll Students
                    </h3>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search students..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="pl-10 w-full md:w-48 border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 p-3 border border-green-200 rounded-lg bg-white">
                    {filteredStudents.map((student) => (
                      <label
                        key={student._id}
                        className="flex items-center space-x-3 p-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors duration-200 border border-transparent hover:border-green-200"
                      >
                        <input
                          type="checkbox"
                          name="students"
                          value={student._id}
                          checked={form.students.includes(student._id)}
                          onChange={handleMultiSelectChange}
                          className="rounded border-green-300 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">
                            {student.name}
                          </span>
                          {student.email && (
                            <p className="text-xs text-gray-500">
                              {student.email}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isPopular"
                      checked={form.isPopular}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                        form.isPopular
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-400"
                          : "border-gray-300 group-hover:border-yellow-400"
                      }`}
                    >
                      {form.isPopular && (
                        <FaFire className="text-white text-xs" />
                      )}
                    </div>
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-yellow-700 transition-colors duration-200">
                    Mark as Popular Course
                  </span>
                </label>
                {form.isPopular && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                    <FaFire className="mr-1" /> Popular Course
                  </span>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                {editingIndex !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingIndex(null);
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
                    }}
                    className="hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  className="min-w-[140px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {editingIndex !== null ? "Update Course" : "Add Course"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Courses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <Card
                key={course._id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 bg-white rounded-lg"
              >
                <CardContent className="p-0">
                  {/* Course Image Header */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-400 text-4xl">
                          <FaChalkboardTeacher />
                        </div>
                      </div>
                    )}

                    {/* Popular Badge */}
                    {course.isPopular && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          <FaFire className="mr-1" /> Popular
                        </span>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-4">
                    {/* Course Title and Code */}
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                        {course.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {course.code}
                      </p>
                    </div>

                    {/* Course Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2 text-gray-400" />
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaLayerGroup className="mr-2 text-gray-400" />
                        <span className="font-medium">
                          {course.classesPerWeek}/week
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaChalkboardTeacher className="mr-2 text-gray-400" />
                        <span className="font-medium">
                          {course.teachers?.length || 0} teachers
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaUserGraduate className="mr-2 text-gray-400" />
                        <span className="font-medium">
                          {course.students?.length || 0} students
                        </span>
                      </div>
                    </div>

                    {/* Rating and Grade */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="font-medium">
                          {course.rating || 0}/5
                        </span>
                      </div>
                      <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">
                        {course.gradeLevel}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(index)}
                        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 text-xs"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setCourseIndex(index);
                          setDeleteModalOpen(true);
                        }}
                        className="hover:bg-red-50 hover:border-red-300 transition-all duration-200 text-xs"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => handleDelete(courseIndex)}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
      />
    </div>
  );
};

export default AdminCourses;
