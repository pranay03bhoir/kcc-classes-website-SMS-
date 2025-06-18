"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  BookOpen,
  Clock,
  Edit,
  Eye,
  GraduationCap,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
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
    <div className="space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Batch Management
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-4">
          Create, manage, and organize student batches efficiently
        </p>
      </div>

      {/* Create Batch Section */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Create New Batch</span>
            <span className="sm:hidden">New Batch</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                Batch Name
              </label>
              <Input
                placeholder="Enter batch name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                Class Standard
              </label>
              <Input
                placeholder="e.g., Class 10"
                value={formData.classStd}
                onChange={(e) =>
                  setFormData({ ...formData, classStd: e.target.value })
                }
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                Timings
              </label>
              <Input
                placeholder="9:00 AM - 11:00 AM"
                value={formData.timings}
                onChange={(e) =>
                  setFormData({ ...formData, timings: e.target.value })
                }
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                Subject
              </label>
              <Select
                value={formData.subjectId}
                onValueChange={(value) =>
                  setFormData({ ...formData, subjectId: value })
                }
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
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
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                Teacher
              </label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) =>
                  setFormData({ ...formData, teacherId: value })
                }
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
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
          </div>

          <div className="w-full">
            <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              Select Students
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {selectedStudents.length > 0
                      ? `${selectedStudents.length} students selected`
                      : "Choose students for this batch"}
                  </span>
                  <span className="sm:hidden">
                    {selectedStudents.length > 0
                      ? `${selectedStudents.length} selected`
                      : "Select students"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] sm:w-96 max-h-80 overflow-auto p-3 sm:p-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <Input
                      type="text"
                      placeholder="Search students..."
                      className="w-full pl-8 sm:pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredStudents.length === 0 ? (
                      <div className="text-center py-6 sm:py-8">
                        <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          No students found
                        </p>
                      </div>
                    ) : (
                      filteredStudents.map((student) => (
                        <div
                          key={student._id}
                          className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Checkbox
                            id={student._id}
                            checked={selectedStudents.includes(student._id)}
                            onCheckedChange={() =>
                              handleCheckboxChange(student._id)
                            }
                            className="text-blue-600"
                          />
                          <label
                            htmlFor={student._id}
                            className="flex-1 cursor-pointer font-medium text-sm"
                          >
                            {student.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap pt-2 sm:pt-4">
            <Button
              onClick={handleCreateBatch}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {isLoading ? "Creating..." : "Create Batch"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(true)}
              disabled={isLoading || !formData._id}
              className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {isLoading ? "Updating..." : "Update Batch"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add/Remove Students Section */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Manage Batch Students</span>
            <span className="sm:hidden">Manage Students</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                Select Student
              </label>
              <Select
                value={studentToAdd.studentId}
                onValueChange={(value) =>
                  setStudentToAdd((prev) => ({ ...prev, studentId: value }))
                }
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm">
                  <SelectValue placeholder="Choose a student" />
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
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                Select Batch
              </label>
              <Select
                value={studentToAdd.batchId}
                onValueChange={(value) =>
                  setStudentToAdd((prev) => ({ ...prev, batchId: value }))
                }
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm">
                  <SelectValue placeholder="Choose a batch" />
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
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
            <Button
              onClick={handleAddStudentToBatch}
              disabled={!studentToAdd.studentId || !studentToAdd.batchId}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Add to Batch
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveStudentFromBatch}
              disabled={!studentToAdd.studentId || !studentToAdd.batchId}
              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              <UserMinus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Remove from Batch
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Batches Section */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">
              All Batches ({batches.length})
            </span>
            <span className="sm:hidden">Batches ({batches.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
          {/* Mobile Cards View */}
          <div className="block lg:hidden space-y-4">
            {batches.map((batch, index) => (
              <div
                key={batch._id}
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {batch.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      ID: {batch.batchId}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setViewBatch(true);
                          setSelectedBatch(batch);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(batch)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(batch)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-gray-400" />
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                      {batch.classStd}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600 truncate">
                      {batch.timings}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-200">
                  <TableHead className="font-semibold text-indigo-700 py-4">
                    #
                  </TableHead>
                  <TableHead className="font-semibold text-indigo-700 py-4">
                    Batch ID
                  </TableHead>
                  <TableHead className="font-semibold text-indigo-700 py-4">
                    Batch Name
                  </TableHead>
                  <TableHead className="font-semibold text-indigo-700 py-4">
                    Class
                  </TableHead>
                  <TableHead className="font-semibold text-indigo-700 py-4">
                    Timings
                  </TableHead>
                  <TableHead className="font-semibold text-indigo-700 py-4 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch, index) => (
                  <TableRow
                    key={batch._id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100"
                  >
                    <TableCell className="py-4 font-medium text-gray-700">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {batch.batchId}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-gray-800">
                      {batch.name}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {batch.classStd}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {batch.timings}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setViewBatch(true);
                            setSelectedBatch(batch);
                          }}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(batch)}
                          className="border-green-300 text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(batch)}
                          className="bg-red-500 hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
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
