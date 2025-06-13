"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
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
import BatchDetailsModal from "@/Dashboard/AdminDashboard/components/BatchDetailsModal";
import EditBatchModal from "@/Dashboard/AdminDashboard/components/modals/EditBatchModal";
import { useBatchForm } from "@/Dashboard/AdminDashboard/hooks/useBatchForm";
import api from "@/utils/axios";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const BatchManagement = ({
  students,
  batches,
  teachers,
  subjects,
  onBatchChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [viewBatch, setViewBatch] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [studentToAdd, setStudentToAdd] = useState({
    studentId: "",
    batchId: "",
  });

  const {
    formData,
    setFormData,
    selectedStudents,
    isLoading,
    handleCheckboxChange,
    handleCreateBatch,
    handleUpdateBatch,
    handleDeleteBatch,
    handleEditBatch,
  } = useBatchForm(onBatchChange);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudentToBatch = async () => {
    if (!studentToAdd.studentId || !studentToAdd.batchId) {
      toast.error("Please select both student and batch");
      return;
    }

    const toastId = toast.loading("Adding student to batch...");
    try {
      const response = await api.put(
        `/add/student/batch/${studentToAdd.studentId}?batchId=${studentToAdd.batchId}`
      );
      if (response.status === 200) {
        toast.update(toastId, {
          render:
            response?.data?.message || "Student added to batch successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        onBatchChange?.();
        setStudentToAdd({ studentId: "", batchId: "" });
      }
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleRemoveStudentFromBatch = async () => {
    if (!studentToAdd.studentId || !studentToAdd.batchId) {
      toast.error("Please select both student and batch");
      return;
    }

    const toastId = toast.loading("Removing student from batch...");
    try {
      const response = await api.delete(
        `/remove/student/batch/${studentToAdd.studentId}?batchId=${studentToAdd.batchId}`
      );
      if (response.status === 200) {
        toast.update(toastId, {
          render: "Student removed from batch successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        onBatchChange?.();
        setStudentToAdd({ studentId: "", batchId: "" });
      }
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const openDeleteDialog = useCallback((batch) => {
    setBatchToDelete(batch);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (batchToDelete) {
      await handleDeleteBatch(batchToDelete._id);
      setDeleteDialogOpen(false);
      setBatchToDelete(null);
    }
  }, [batchToDelete, handleDeleteBatch]);

  const openEditModal = (batch) => {
    setSelectedBatch(batch);
    setEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="space-y-4 py-6">
          <h2 className="text-2xl font-semibold mb-4">
            Manage Student Batches
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Batch Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full"
            />
            <Input
              placeholder="Class Standard"
              value={formData.classStd}
              onChange={(e) =>
                setFormData({ ...formData, classStd: e.target.value })
              }
              className="w-full"
            />
            <Input
              placeholder="Timings"
              value={formData.timings}
              onChange={(e) =>
                setFormData({ ...formData, timings: e.target.value })
              }
              className="w-full"
            />
            <Select
              value={formData.subjectId}
              onValueChange={(value) =>
                setFormData({ ...formData, subjectId: value })
              }
            >
              <SelectTrigger className="w-full">
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
              <SelectTrigger className="w-full">
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
          </div>

          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  {selectedStudents.length > 0
                    ? `Selected students (${selectedStudents.length})`
                    : "Select students"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-h-60 overflow-auto p-4">
                <Input
                  type="text"
                  placeholder="Search students..."
                  className="w-full mb-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="space-y-2">
                  {filteredStudents.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No students found
                    </p>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                      >
                        <Checkbox
                          id={student._id}
                          checked={selectedStudents.includes(student._id)}
                          onCheckedChange={() =>
                            handleCheckboxChange(student._id)
                          }
                        />
                        <label
                          htmlFor={student._id}
                          className="flex-1 cursor-pointer"
                        >
                          {student.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleCreateBatch}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Creating..." : "Create Batch"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(true)}
              disabled={isLoading || !formData._id}
              className="flex-1"
            >
              {isLoading ? "Updating..." : "Update Batch"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6">
          <h2 className="text-2xl font-semibold mb-4">Add/Remove Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Select
              value={studentToAdd.studentId}
              onValueChange={(value) =>
                setStudentToAdd((prev) => ({ ...prev, studentId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student._id} value={student._id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={studentToAdd.batchId}
              onValueChange={(value) =>
                setStudentToAdd((prev) => ({ ...prev, batchId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch._id} value={batch._id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleAddStudentToBatch}
              disabled={!studentToAdd.studentId || !studentToAdd.batchId}
              className="flex-1"
            >
              Add to Batch
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveStudentFromBatch}
              disabled={!studentToAdd.studentId || !studentToAdd.batchId}
              className="flex-1"
            >
              Remove from Batch
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6">
          <h2 className="text-2xl font-semibold mb-4">All Batches</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr.no</TableHead>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Timings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch, index) => (
                  <TableRow
                    key={batch._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{batch.batchId}</TableCell>
                    <TableCell>{batch.name}</TableCell>
                    <TableCell>{batch.classStd}</TableCell>
                    <TableCell>{batch.timings}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setViewBatch(true);
                            setSelectedBatch(batch);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(batch)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(batch)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <BatchDetailsModal
        open={viewBatch}
        onClose={() => {
          setViewBatch(false);
          setSelectedBatch(null);
        }}
        batch={selectedBatch}
        subjects={subjects}
        teachers={teachers}
        students={students}
      />

      <EditBatchModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedBatch(null);
        }}
        batch={selectedBatch}
        subjects={subjects}
        teachers={teachers}
        onSave={handleUpdateBatch}
      />

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Batch"
        description="Are you sure you want to delete this batch? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

BatchManagement.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  batches: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      batchId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      classStd: PropTypes.string.isRequired,
      timings: PropTypes.string.isRequired,
      subjectId: PropTypes.string.isRequired,
      teacherId: PropTypes.string.isRequired,
      studentIds: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  teachers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onBatchChange: PropTypes.func,
};

export default BatchManagement;
