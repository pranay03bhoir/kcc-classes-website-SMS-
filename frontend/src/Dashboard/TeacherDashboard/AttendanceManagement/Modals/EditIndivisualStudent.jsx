"use client";
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
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function EditIndividualStudentModal({
  open,
  onClose,
  student,
  attendance,
  onSave,
  batch,
}) {
  const [attendanceData, setAttendanceData] = useState({
    status: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Initialize attendance data when modal opens
  useEffect(() => {
    if (attendance) {
      setAttendanceData({
        status: attendance.status || "",
        note: attendance.note || "",
        date: attendance.date
          ? format(new Date(attendance.date), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [attendance]);

  const handleStatusChange = (value) => {
    setAttendanceData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleNoteChange = (e) => {
    const { value } = e.target;
    setAttendanceData((prev) => ({
      ...prev,
      note: value,
    }));
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setAttendanceData((prev) => ({
      ...prev,
      date: value,
    }));
  };

  const handleSave = async () => {
    if (!attendanceData.status) {
      // You might want to add proper error handling/notification here
      console.error("Status is required");
      return;
    }

    try {
      await onSave({
        ...attendanceData,
        student: student._id,
        subject: Array.isArray(batch) ? batch[0]?.subjectId : batch?.subjectId,
      });
      onClose();
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Attendance Record
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Student Information */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 bg-gray-200 w-12 h-12 flex items-center justify-center rounded-full text-sm font-medium text-gray-700">
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={attendanceData.date}
                onChange={handleDateChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                value={attendanceData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <Input
                value={attendanceData.note}
                onChange={handleNoteChange}
                placeholder="Add notes about attendance..."
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
