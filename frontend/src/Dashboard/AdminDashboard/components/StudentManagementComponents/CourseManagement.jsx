"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/utils/axios";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Loader2,
  Minus,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const CourseManagement = ({ students, courses }) => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const selectedStudentData = useMemo(() => {
    return students.find((s) => s._id === selectedStudent);
  }, [students, selectedStudent]);

  const selectedCourseData = useMemo(() => {
    return courses.find((c) => c._id === selectedCourse);
  }, [courses, selectedCourse]);

  const validateSelection = () => {
    if (!selectedStudent) {
      toast.error("Please select a student");
      return false;
    }
    if (!selectedCourse) {
      toast.error("Please select a course");
      return false;
    }
    return true;
  };

  const handleAddStudentToCourse = async () => {
    if (!validateSelection()) return;

    setIsLoading(true);
    const toastId = toast.loading("Adding student to course...");
    try {
      const response = await api.put(
        `/subjects/add/students/${selectedStudent}?subjects=${selectedCourse}`
      );
      if (response.status === 200) {
        toast.update(toastId, {
          render: "Student added to course successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setSelectedStudent("");
        setSelectedCourse("");
      } else {
        toast.update(toastId, {
          render: response?.data?.message || "Failed to add student to course",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (e) {
      console.error("Error adding student to course", e);
      const message =
        e.response?.data?.message || "Error adding student to course";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudentFromCourse = async () => {
    if (!validateSelection()) return;

    setIsLoading(true);
    const toastId = toast.loading("Removing student from course...");
    try {
      const response = await api.put(
        `/subjects/remove/students/${selectedCourse}?studentIds=${selectedStudent}`
      );
      if (response.status === 200) {
        toast.update(toastId, {
          render:
            response?.data?.message ||
            "Student removed from course successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setSelectedStudent("");
        setSelectedCourse("");
        setShowDeleteDialog(false);
      } else {
        toast.update(toastId, {
          render:
            response?.data?.message || "Failed to remove student from course",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (e) {
      console.error("Error removing student from course", e);
      const message =
        e.response?.data?.message || "Error removing student from course";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2 px-2">
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Course Management
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
          Manage student enrollments, add students to courses, and oversee
          academic progress with ease
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">
                  Total Students
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {students.length}
                </p>
              </div>
              <Users className="h-8 w-8 sm:h-12 sm:w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">
                  Total Courses
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {courses.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">
                  Active
                </p>
                <p className="text-2xl sm:text-3xl font-bold">Ready</p>
              </div>
              <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Management Card */}
      <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              Manage Student Courses
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Student Selection */}
            <div className="space-y-2 sm:space-y-3">
              <label
                htmlFor="student-select"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Select Student
              </label>
              <Select
                onValueChange={setSelectedStudent}
                value={selectedStudent}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="student-select"
                  className="w-full h-11 sm:h-12 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {students.map((student) => (
                    <SelectItem
                      key={student._id}
                      value={student._id}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="truncate">{student.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course Selection */}
            <div className="space-y-2 sm:space-y-3">
              <label
                htmlFor="course-select"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Select Course
              </label>
              <Select
                onValueChange={setSelectedCourse}
                value={selectedCourse}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="course-select"
                  className="w-full h-11 sm:h-12 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 transition-colors focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <SelectValue placeholder="Choose a course..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {courses.map((course) => (
                    <SelectItem
                      key={course._id}
                      value={course._id}
                      className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex flex-col">
                          <span className="truncate">{course.name}</span>
                          <span className="text-xs text-gray-500">
                            ({course.code})
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              onClick={handleAddStudentToCourse}
              disabled={isLoading || !selectedStudent || !selectedCourse}
              className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span className="hidden sm:inline">Adding...</span>
                  <span className="sm:hidden">Adding</span>
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Add to Course</span>
                  <span className="sm:hidden">Add</span>
                </>
              )}
            </Button>

            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isLoading || !selectedStudent || !selectedCourse}
                  className="flex-1 h-11 sm:h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50 text-sm sm:text-base"
                >
                  <Minus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Remove from Course</span>
                  <span className="sm:hidden">Remove</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-gray-800 border-0 shadow-2xl mx-4 sm:mx-0">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600 text-lg sm:text-xl">
                    <AlertCircle className="h-5 w-5" />
                    Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    This will remove{" "}
                    <span className="font-semibold text-blue-600">
                      {selectedStudentData?.name}
                    </span>{" "}
                    from{" "}
                    <span className="font-semibold text-purple-600">
                      {selectedCourseData?.name}
                    </span>
                    . This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <AlertDialogCancel className="border-2 border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 w-full sm:w-auto">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteStudentFromCourse}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Removing...
                      </>
                    ) : (
                      "Remove"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                All Courses
              </h2>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 sm:h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Mobile Course Cards */}
          <div className="block sm:hidden space-y-3">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                  <BookOpen className="h-12 w-12 opacity-50" />
                  <p className="text-lg font-medium">No courses found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              </div>
            ) : (
              filteredCourses.map((course, index) => (
                <div
                  key={course._id}
                  className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        #{index + 1}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {course.code}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course._id);
                        document
                          .querySelector('[id="course-select"]')
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-xs"
                    >
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Select
                    </Button>
                  </div>
                  <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                    {course.name}
                  </h3>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block rounded-xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-600">
                  <TableHead className="w-[80px] font-semibold text-gray-700 dark:text-gray-300">
                    Sr.no
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Course Code
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                    Course Name
                  </TableHead>
                  <TableHead className="w-[120px] font-semibold text-gray-700 dark:text-gray-300 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                        <BookOpen className="h-12 w-12 opacity-50" />
                        <p className="text-lg font-medium">No courses found</p>
                        <p className="text-sm">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course, index) => (
                    <TableRow
                      key={course._id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all duration-300 border-b border-gray-100 dark:border-gray-700"
                    >
                      <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {course.code}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-gray-800 dark:text-white">
                        {course.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course._id);
                            document
                              .querySelector('[id="course-select"]')
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseManagement;
