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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function EditIndividualStudentModal({
  open,
  onClose,
  student,
  attendance,
  onSave,
  batch,
}) {
  const [attendanceData, setAttendanceData] = useState({
    student: "",
    subject: "",
    status: "",
    note: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize attendance data when modal opens
  useEffect(() => {
    if (student && attendance) {
      setAttendanceData({
        student: student._id,
        subject: Array.isArray(batch) ? batch[0]?.subjectId : batch?.subjectId,
        status: attendance.status || "",
        note: attendance.note || "",
      });
      setErrors({}); // Reset errors when modal opens
    }
  }, [student, attendance, batch]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!attendanceData.status) {
      newErrors.status = "Status is required";
    }
    if (!attendanceData.student) {
      newErrors.student = "Student information is missing";
    }
    if (!attendanceData.subject) {
      newErrors.subject = "Subject information is missing";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [attendanceData]);

  const handleStatusChange = (value) => {
    setAttendanceData((prev) => ({
      ...prev,
      status: value,
    }));
    // Clear error when status is selected
    if (errors.status) {
      setErrors((prev) => ({ ...prev, status: undefined }));
    }
  };

  const handleNoteChange = (e) => {
    const { value } = e.target;
    setAttendanceData((prev) => ({
      ...prev,
      note: value,
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setIsLoading(true);
    try {
      await onSave(attendanceData);
      toast.success("Attendance updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error(error.message || "Failed to update attendance");
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Enter" && e.ctrlKey) {
        handleSave();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyPress);
    }
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [open, onClose]);

  if (!student) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className="max-w-[500px] w-full p-6"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Attendance Record
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Student Information */}
            <div
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              role="region"
              aria-label="Student Information"
            >
              <div className="flex-shrink-0 bg-gray-200 w-12 h-12 flex items-center justify-center rounded-full text-sm font-medium text-gray-700">
                {student.profileImage ? (
                  <img
                    src={student.profileImage}
                    alt={`${student.name}'s profile`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="text-gray-500"
                    aria-label={`${student.name}'s initials`}
                  >
                    {student.name
                      .split(" ")
                      .splice(0, 3)
                      .map((word) => word[0].toUpperCase())
                      .join("")}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                <div className="mt-1">
                  <span className="text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-1">
                    {Array.isArray(batch)
                      ? batch.map((b) => b.name).join(", ")
                      : batch?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance Form */}
            <div className="space-y-4" role="form" aria-label="Attendance Form">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="status"
                >
                  Status <span className="text-red-500">*</span>
                </label>
                <Select
                  value={attendanceData.status}
                  onValueChange={handleStatusChange}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    className="w-full"
                    id="status"
                    aria-invalid={!!errors.status}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                    <SelectItem value="Late">Late</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-500" role="alert">
                    {errors.status}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="notes"
                >
                  Notes
                </label>
                <Input
                  id="notes"
                  value={attendanceData.note}
                  onChange={handleNoteChange}
                  placeholder="Add notes about attendance..."
                  className="w-full"
                  disabled={isLoading}
                  maxLength={200}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {attendanceData.note.length}/200 characters
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the attendance record for{" "}
              {student.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSave}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

EditIndividualStudentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  student: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    studentId: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
  }).isRequired,
  attendance: PropTypes.shape({
    status: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  batch: PropTypes.oneOfType([
    PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        subjectId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  ]).isRequired,
};
