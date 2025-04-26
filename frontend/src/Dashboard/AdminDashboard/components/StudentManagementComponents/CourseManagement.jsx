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

const CourseManagement = ({
  students,
  courses,
  selectedStudent,
  setSelectedStudent,
  selectedCourse,
  setSelectedCourse,
}) => {
  return (
    <div>
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
                <SelectItem key={index} value={student.name}>
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
                <SelectItem key={index} value={course.name}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() =>
                console.log("Add to course", selectedStudent, selectedCourse)
              }
            >
              Add to Course
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                console.log("Update Course", selectedStudent, selectedCourse)
              }
            >
              Update Course
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                console.log(
                  "Remove from Course",
                  selectedStudent,
                  selectedCourse
                )
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
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button className={`w-full`} variant={`destructive`}>
                      Delete
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
