"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
const BatchManagement = ({ students, batches, teachers, subjects }) => {
  const [formData, setFormData] = useState({
    name: "",
    classStd: "",
    timings: "",
    subjectId: "",
    teacherId: "",
    studentIds: [],
  });
  const [selectedStudents, setSelectedStudents] = useState(formData.studentIds);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [selectedBatch, setSelectedBatch] = useState({});
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (studentId, checked) => {
    const newSelectedStudents = selectedStudents.includes(studentId)
      ? selectedStudents.filter((id) => id !== studentId) // Remove if already selected
      : [...selectedStudents, studentId]; // Add if not selected

    setSelectedStudents(newSelectedStudents);
    setFormData({ ...formData, studentIds: newSelectedStudents });

    setFormData({ ...formData, studentIds: newSelectedStudents });
  };

  const handleCreateBatch = async () => {
    const toastId = toast.loading("Creating batch...");
    try {
      const response = await api.post(`/batch/create`, formData);
      if (response.status === 200) {
        toast.update(toastId, {
          render: "Batch created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setFormData({
          name: "",
          classStandard: "",
          timings: "",
          subjectId: "",
          teacherId: "",
          studentIds: [],
        });
        setSelectedStudents([]);
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      const message = error.response?.data?.message || "An error occurred";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  const handleUpdateBatch = async () => {
    const toastId = toast.loading("Updating batch...");
    try {
      const batchId = formData._id;
      // console.log("selectedBatch", selectedBatch);

      // console.log("Batch ID to update:", batchId);
      // // console.log("Form data _id:", formData._id);
      // console.log("Form data:", formData);

      const response = await api.put(`/batch/update/${batchId}`, formData);
      if (response.status === 200) {
        toast.update(toastId, {
          render: "Batch updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setFormData({
          name: "",
          classStandard: "",
          timings: "",
          subjectId: "",
          teacherId: "",
          studentIds: [],
        });
        setSelectedStudents([]);
      }
    } catch (error) {
      console.error("Error updating batch:", error);
      const message = error.response?.data?.message || "An error occurred";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  const handleEditBatch = async (index) => {
    const batch = batches[index];
    // console.log("Batch to edit:", batch._id);
    setSelectedBatch(batch._id);
    setFormData({
      ...batch,
    });
    setSelectedStudents(batch.studentIds);
  };

  return (
    <div>
      <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="space-y-4 py-4">
          <h2 className="text-xl font-semibold">Manage Student Batches</h2>
          <Input
            placeholder="Batch Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Input
            placeholder="Class Standard"
            value={formData.classStd}
            onChange={(e) =>
              setFormData({ ...formData, classStd: e.target.value })
            }
            className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Input
            placeholder="Timings"
            value={formData.timings}
            onChange={(e) =>
              setFormData({ ...formData, timings: e.target.value })
            }
            className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Select
            value={formData.subjectId}
            onValueChange={(value) =>
              setFormData({ ...formData, subjectId: value })
            }
          >
            <SelectTrigger className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject._id} value={subject._id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={formData.teacherId}
            onValueChange={(value) =>
              setFormData({ ...formData, teacherId: value })
            }
          >
            <SelectTrigger className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {selectedStudents.length > 0
                    ? `Selected students (${selectedStudents.length})`
                    : "Select students"}{" "}
                  (optional)
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-h-60 overflow-auto p-2 border rounded-md">
                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* List of filtered studentIds */}
                <div className="space-y-2">
                  {filteredStudents.length === 0 ? (
                    <p>No students found</p>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={student._id}
                          checked={selectedStudents.includes(student._id)}
                          onCheckedChange={() =>
                            handleCheckboxChange(student._id)
                          }
                        />
                        <label htmlFor={student._id}>{student.name}</label>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2 mb-4">
            <Button onClick={handleCreateBatch}>Create Batch</Button>
            <Button variant="outline" onClick={handleUpdateBatch}>
              Update Batch
            </Button>
          </div>
          <Select
            // onValueChange={setSelectedStudent}
            // value={selectedStudent}
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
            // onValueChange={setSelectedBatch}
            // value={selectedBatch}
            className="w-full"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch, index) => (
                <SelectItem key={index} value={batch.name}>
                  {batch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 flex-wrap mt-4">
            <Button onClick={() => console.log("Add to Batch")}>
              Add to Batch
            </Button>
            <Button
              variant="destructive"
              onClick={() => console.log("Remove from Batch")}
            >
              Remove from Batch
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <h2 className="text-lg font-semibold mb-2">All Batches</h2>
          <Table className={`text-start`}>
            <TableHeader>
              <TableRow>
                <TableHead>Sr.no</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Batch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((b, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-200 cursor-pointer transition-colors"
                  onClick={() => setSelectedBatch(b.name)}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{b.batchId}</TableCell>
                  <TableCell>{b.name}</TableCell>
                  <TableCell>
                    <Button
                      className={`w-full`}
                      variant="outline"
                      onClick={() => handleEditBatch(index)}
                    >
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

export default BatchManagement;
