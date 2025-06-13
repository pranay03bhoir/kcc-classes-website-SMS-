"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function MarkAttendanceModal({
  open,
  onClose,
  students = [],
  setStudents,
  onSaveAttendance,
  batch,
  selectedDate,
}) {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    other: 0,
  });
  const [errors, setErrors] = useState({});

  // ✅ Initialize attendanceData for each student
  useEffect(() => {
    if (!Array.isArray(students) || students.length === 0) {
      setAttendanceData([]);
      return;
    }

    const initialized = students
      .map((student) => {
        // Get subject ID from student's batch if no batch is selected
        let subjectId;
        if (!batch) {
          // If no batch is selected, use the student's first batch subject
          const studentBatch = student.batches?.[0];
          subjectId = studentBatch?.subjectId?._id || studentBatch?.subjectId;
        } else {
          // If batch is selected, use that batch's subject
          subjectId = batch?.subjectId?._id || batch?.subjectId;
        }

        console.log("Student batch data:", student.batches);
        console.log("Selected batch:", batch);
        console.log("Extracted subject ID:", subjectId);

        if (!subjectId) {
          console.warn("No subject ID found for student:", student.name);
          return null;
        }

        const entry = {
          student: student._id,
          subject: subjectId,
          status: "",
          note: "",
        };
        console.log("Initialized entry:", entry);
        return entry;
      })
      .filter(Boolean); // Remove any null entries

    if (initialized.length === 0) {
      toast.error("No valid subject IDs found for the selected students");
      return;
    }

    setAttendanceData(initialized);
    setHasUnsavedChanges(false);
  }, [students, batch]);

  // ✅ Update attendance summary whenever attendance data changes
  useEffect(() => {
    if (!Array.isArray(attendanceData)) {
      setAttendanceSummary({
        present: 0,
        absent: 0,
        late: 0,
        other: 0,
      });
      return;
    }

    const summary = attendanceData.reduce(
      (acc, curr) => {
        if (curr && curr.status) {
          const status = curr.status.toLowerCase();
          if (
            status === "present" ||
            status === "absent" ||
            status === "late" ||
            status === "other"
          ) {
            acc[status] = (acc[status] || 0) + 1;
          }
        }
        return acc;
      },
      { present: 0, absent: 0, late: 0, other: 0 }
    );
    setAttendanceSummary(summary);
  }, [attendanceData]);

  // ✅ Validate attendance data
  const validateAttendanceData = useCallback(() => {
    const newErrors = {};
    let hasError = false;

    attendanceData.forEach((entry, index) => {
      if (!entry.status) {
        newErrors[`status_${index}`] = "Status is required";
        hasError = true;
      }
      if (!entry.student) {
        newErrors[`student_${index}`] = "Student information is missing";
        hasError = true;
      }
      if (!entry.subject) {
        newErrors[`subject_${index}`] = "Subject information is missing";
        hasError = true;
      }
    });

    setErrors(newErrors);
    return !hasError;
  }, [attendanceData]);

  // ✅ Handle status change per student
  const handleStatusChange = (index, value) => {
    console.log("Status changed:", { index, value });
    const student = students[index];
    const subjectId = !batch
      ? student.batches?.[0]?.subjectId?._id || student.batches?.[0]?.subjectId
      : batch?.subjectId?._id || batch?.subjectId;

    console.log("Current subject ID:", subjectId);

    setAttendanceData((prev) => {
      const updated = [...prev];
      const currentEntry = updated[index] || {};
      const newEntry = {
        ...currentEntry,
        student: student._id,
        subject: subjectId,
        status: value,
        note: currentEntry.note || "",
      };
      console.log("Updated entry:", newEntry);
      updated[index] = newEntry;
      return updated;
    });
    setHasUnsavedChanges(true);
    if (errors[`status_${index}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`status_${index}`];
        return newErrors;
      });
    }
  };

  // ✅ Handle note change per student
  const handleNoteChange = (index, e) => {
    const { value } = e.target;
    console.log("Note changed:", { index, value });
    const student = students[index];
    const subjectId = !batch
      ? student.batches?.[0]?.subjectId?._id || student.batches?.[0]?.subjectId
      : batch?.subjectId?._id || batch?.subjectId;

    setAttendanceData((prev) => {
      const updated = [...prev];
      const currentEntry = updated[index] || {};
      const newEntry = {
        ...currentEntry,
        student: student._id,
        subject: subjectId,
        status: currentEntry.status || "",
        note: value,
      };
      console.log("Updated entry:", newEntry);
      updated[index] = newEntry;
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  // ✅ Handle select all students
  const handleSelectAll = (status) => {
    setAttendanceData((prev) =>
      prev.map((entry) => ({
        ...entry,
        status: status,
      }))
    );
    setHasUnsavedChanges(true);
  };

  // ✅ Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e, index) => {
      if (!Array.isArray(students)) return;

      if (e.key === "ArrowDown" && index < students.length - 1) {
        e.preventDefault();
        document.querySelector(`[data-student-index="${index + 1}"]`)?.focus();
      } else if (e.key === "ArrowUp" && index > 0) {
        e.preventDefault();
        document.querySelector(`[data-student-index="${index - 1}"]`)?.focus();
      }
    },
    [students]
  );

  // ✅ Handle dialog close
  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  // ✅ Save attendance
  const handleSave = async () => {
    console.log("Save button clicked");
    console.log("Current attendance data:", attendanceData);
    console.log("Has unsaved changes:", hasUnsavedChanges);
    console.log("Is submitting:", isSubmitting);

    const entriesToSubmit = attendanceData.filter(
      (entry) => entry.status && entry.student && entry.subject
    );
    console.log("Entries to submit:", entriesToSubmit);

    if (entriesToSubmit.length === 0) {
      toast.error("Please mark attendance for at least one student");
      return;
    }

    setIsSubmitting(true);
    let hasError = false;

    try {
      for (const entry of entriesToSubmit) {
        try {
          await onSaveAttendance(entry);
        } catch (error) {
          hasError = true;
          toast.error(
            `Failed to save attendance for ${
              students.find((s) => s._id === entry.student)?.name || "student"
            }`
          );
          console.error(
            "Error submitting attendance:",
            entry,
            error?.response?.data
          );
        }
      }

      if (!hasError) {
        toast.success("Attendance saved successfully");
        setHasUnsavedChanges(false);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-[1200px] p-6 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">
            Mark Attendance -{" "}
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : new Date().toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
          </DialogTitle>
          <DialogDescription>
            {Array.isArray(students)
              ? `Mark attendance for ${students.length} students`
              : "No students selected"}
          </DialogDescription>
        </DialogHeader>

        {/* Attendance Summary */}
        <div className="grid grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" />
            <span>Present: {attendanceSummary.present}</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="text-red-600" />
            <span>Absent: {attendanceSummary.absent}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-yellow-600" />
            <span>Late: {attendanceSummary.late}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-gray-600" />
            <span>Other: {attendanceSummary.other}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSelectAll("Present")}
            className="text-green-600"
          >
            Mark All Present
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSelectAll("Absent")}
            className="text-red-600"
          >
            Mark All Absent
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4">
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 min-w-[250px]">STUDENT</th>
                  <th className="text-left py-3 px-4 min-w-[120px]">ID</th>
                  <th className="text-left py-3 px-4 min-w-[150px]">BATCH</th>
                  <th className="text-left py-3 px-4 min-w-[120px]">STATUS</th>
                  <th className="text-left py-3 px-4 min-w-[200px]">NOTES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50 focus-within:bg-gray-50"
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    data-student-index={index}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium text-gray-700">
                          {student.profileImage ? (
                            <img
                              src={student.profileImage}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500">
                              {student.name
                                .split(" ")
                                .splice(0, 3)
                                .map((word) => word[0].toUpperCase())
                                .join("")}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {student.studentId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-1 whitespace-nowrap">
                          {student.batches?.[student.batches?.length - 1]
                            ?.name ||
                            student.batches?.subjectId?.name ||
                            "No Batch"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <Select
                          value={attendanceData[index]?.status || ""}
                          onValueChange={(value) =>
                            handleStatusChange(index, value)
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger
                            className={`w-[120px] text-sm ${
                              attendanceData[index]?.status === "Present"
                                ? "border-green-500"
                                : attendanceData[index]?.status === "Absent"
                                ? "border-red-500"
                                : attendanceData[index]?.status === "Late"
                                ? "border-yellow-500"
                                : errors[`status_${index}`]
                                ? "border-red-500"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                            <SelectItem value="Late">Late</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors[`status_${index}`] && (
                          <p className="text-xs text-red-500">
                            {errors[`status_${index}`]}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        value={attendanceData[index]?.note || ""}
                        onChange={(e) => handleNoteChange(index, e)}
                        placeholder="Add notes..."
                        className="w-full text-sm"
                        disabled={isSubmitting}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {hasUnsavedChanges && (
          <Alert variant="warning" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes. Please save before closing.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting || !hasUnsavedChanges}
          >
            {isSubmitting ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

MarkAttendanceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  students: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      studentId: PropTypes.string.isRequired,
    })
  ),
  setStudents: PropTypes.func,
  onSaveAttendance: PropTypes.func.isRequired,
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
  ]),
  selectedDate: PropTypes.string,
};
