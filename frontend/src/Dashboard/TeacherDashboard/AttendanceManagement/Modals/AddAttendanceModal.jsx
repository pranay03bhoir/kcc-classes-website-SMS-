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
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function MarkAttendanceModal({
  open,
  onClose,
  students,
  setStudents,
  onSaveAttendance,
  batch,
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

  // ✅ Initialize attendanceData for each student
  useEffect(() => {
    if (Array.isArray(students) && students.length > 0) {
      const subjectId = Array.isArray(batch)
        ? batch[0]?.subjectId
        : batch?.subjectId;

      if (!subjectId) {
        toast.error("No subject ID found in batch data");
        return;
      }

      const initialized = students.map((student) => ({
        student: student._id,
        subject: subjectId,
        status: "",
        note: "",
      }));
      setAttendanceData(initialized);
      setHasUnsavedChanges(false);
    } else {
      setAttendanceData([]);
    }
  }, [students, batch]);

  // ✅ Update attendance summary whenever attendance data changes
  useEffect(() => {
    const summary = attendanceData.reduce(
      (acc, curr) => {
        if (curr.status) {
          acc[curr.status.toLowerCase()] =
            (acc[curr.status.toLowerCase()] || 0) + 1;
        }
        return acc;
      },
      { present: 0, absent: 0, late: 0, other: 0 }
    );
    setAttendanceSummary(summary);
  }, [attendanceData]);

  // ✅ Handle status change per student
  const handleStatusChange = (index, value) => {
    setAttendanceData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status: value,
      };
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  // ✅ Handle note change per student
  const handleNoteChange = (index, e) => {
    const { value } = e.target;
    setAttendanceData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        note: value,
      };
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
      if (e.key === "ArrowDown" && index < students.length - 1) {
        e.preventDefault();
        document.querySelector(`[data-student-index="${index + 1}"]`)?.focus();
      } else if (e.key === "ArrowUp" && index > 0) {
        e.preventDefault();
        document.querySelector(`[data-student-index="${index - 1}"]`)?.focus();
      }
    },
    [students.length]
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
    const entriesToSubmit = attendanceData.filter(
      (entry) => entry.status && entry.student && entry.subject
    );

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
            {new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </DialogTitle>
          <DialogDescription>
            Mark attendance for {students.length} students
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
                        {Array.isArray(batch) ? (
                          batch.map((b, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-1 whitespace-nowrap"
                            >
                              {b.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-1 whitespace-nowrap">
                            {batch?.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
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
