"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useState } from "react";
import { toast } from "react-toastify";

const CourseManagement = ({ students, courses }) => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const handleAddStudentToCourse = async (studentId, courseId) => {
    const toastId = toast.loading("Adding student to course...");
    try {
      const response = await api.put(
        `/subjects/add/students/${studentId}?subjects=${courseId}`
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
          render: response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);
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
    }
  };
  const handleDeleteStudentFromCourse = async (studentId, courseId) => {
    const toastId = toast.loading("Removing student from course...");
    try {
      const response = await api.put(
        `/subjects/remove/students/${courseId}?studentIds=${studentId}`
      );
      if (response.status === 200) {
        toast.update(toastId, {
          render: response?.data?.message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setSelectedStudent("");
        setSelectedCourse("");
      } else {
        toast.update(toastId, {
          render: response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);
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
    }
  };
  return (
    <div className="dark:bg-gray-800 bg-white p-6 rounded-lg shadow-md">
      <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="space-y-4 py-4">
          <h2 className="text-xl font-semibold">Manage Student Courses</h2>
          <Select
            onValueChange={setSelectedStudent}
            value={selectedStudent}
            className="w-full"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student, index) => (
                <SelectItem
                  key={index}
                  value={student._id}
                  onClick={() => setSelectedStudent(student._id)}
                >
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={setSelectedCourse}
            value={selectedCourse}
            className="w-full"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course, index) => (
                <SelectItem
                  key={index}
                  value={course._id}
                  onClick={() => setSelectedCourse(course._id)}
                >
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() =>
                handleAddStudentToCourse(selectedStudent, selectedCourse)
              }
            >
              Add to Course
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                handleDeleteStudentFromCourse(selectedStudent, selectedCourse)
              }
            >
              Remove from Course
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <h2 className="text-lg font-semibold mb-2">All Courses</h2>
          <Table className={`text-start`}>
            <TableHeader>
              <TableRow>
                <TableHead>Sr.no</TableHead>
                <TableHead>Course Code</TableHead>
                <TableHead>Course</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-200 cursor-pointer transition-colors"
                  onClick={() => setSelectedCourse(c.name)}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{c.code}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>
                    <Button className={`w-full`} variant="outline">
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseManagement;
