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
import { Loader2, Search } from "lucide-react";
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
    <div className="dark:bg-gray-800 bg-white p-6 rounded-lg shadow-md space-y-6">
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="space-y-4 py-4">
          <h2 className="text-xl font-semibold">Manage Student Courses</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="student-select" className="text-sm font-medium">
                Select Student
              </label>
              <Select
                onValueChange={setSelectedStudent}
                value={selectedStudent}
                disabled={isLoading}
              >
                <SelectTrigger id="student-select" className="w-full">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student._id} value={student._id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="course-select" className="text-sm font-medium">
                Select Course
              </label>
              <Select
                onValueChange={setSelectedCourse}
                value={selectedCourse}
                disabled={isLoading}
              >
                <SelectTrigger id="course-select" className="w-full">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.name} ({course.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddStudentToCourse}
                disabled={isLoading || !selectedStudent || !selectedCourse}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add to Course"
                )}
              </Button>

              <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isLoading || !selectedStudent || !selectedCourse}
                    className="flex-1"
                  >
                    Remove from Course
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove {selectedStudentData?.name} from{" "}
                      {selectedCourseData?.name}. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteStudentFromCourse}>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">All Courses</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Sr.no</TableHead>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No courses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course, index) => (
                    <TableRow
                      key={course._id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course._id);
                            // Scroll to the top form
                            document
                              .querySelector('[id="course-select"]')
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                        >
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
