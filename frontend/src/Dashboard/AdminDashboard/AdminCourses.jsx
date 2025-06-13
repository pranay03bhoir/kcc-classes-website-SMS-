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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Course Management
            </h1>
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
              className="w-full md:w-auto"
            >
              <FaPlus className="mr-2" /> Add New Course
            </Button>
          </div>

          {/* Course Form */}
          <Card className="p-4 md:p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddOrUpdate();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course Code</label>
                  <Input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g., MATH101"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course Name</label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Advanced Mathematics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g., Science"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Duration (months)
                  </label>
                  <Input
                    name="duration"
                    type="number"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g., 6"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Classes per Week
                  </label>
                  <Input
                    name="classesPerWeek"
                    type="number"
                    value={form.classesPerWeek}
                    onChange={handleChange}
                    placeholder="e.g., 3"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Grade Level</label>
                  <Input
                    name="gradeLevel"
                    value={form.gradeLevel}
                    onChange={handleChange}
                    placeholder="e.g., Grade 10"
                    required
                  />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teachers Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Assign Teachers</h3>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search teachers..."
                        value={teacherSearch}
                        onChange={(e) => setTeacherSearch(e.target.value)}
                        className="pl-10 w-full md:w-48"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 p-2 border rounded-lg">
                    {filteredTeachers.map((teacher) => (
                      <label
                        key={teacher._id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="teachers"
                          value={teacher._id}
                          checked={form.teachers.includes(teacher._id)}
                          onChange={handleMultiSelectChange}
                          className="rounded"
                        />
                        <span>{teacher.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Students Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Enroll Students</h3>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search students..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="pl-10 w-full md:w-48"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 p-2 border rounded-lg">
                    {filteredStudents.map((student) => (
                      <label
                        key={student._id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="students"
                          value={student._id}
                          checked={form.students.includes(student._id)}
                          onChange={handleMultiSelectChange}
                          className="rounded"
                        />
                        <span>{student.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={form.isPopular}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span>Mark as Popular Course</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
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
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" className="min-w-[120px]">
                  {editingIndex !== null ? "Update Course" : "Add Course"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Courses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, index) => (
              <Card key={course._id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      <p className="text-sm text-gray-500">{course.code}</p>
                    </div>
                    {course.isPopular && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <FaFire className="mr-1" /> Popular
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2" />
                      {course.duration} months
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaLayerGroup className="mr-2" />
                      {course.classesPerWeek}/week
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaChalkboardTeacher className="mr-2" />
                      {course.teachers?.length || 0} teachers
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUserGraduate className="mr-2" />
                      {course.students?.length || 0} students
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(index)}
                    >
                      <FaEdit className="mr-2" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setCourseIndex(index);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <FaTrash className="mr-2" /> Delete
                    </Button>
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
