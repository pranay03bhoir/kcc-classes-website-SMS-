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
import { useEffect, useState } from "react";

export default function MarkAttendanceModal({
  open,
  onClose,
  students,
  setStudents,
  onSaveAttendance,
  batch,
}) {
  const [attendanceData, setAttendanceData] = useState([]);

  // ✅ Initialize attendanceData for each student
  useEffect(() => {
    if (Array.isArray(students) && students.length > 0) {
      // Get the first batch's subjectId since we're marking attendance for one subject at a time
      const subjectId = Array.isArray(batch)
        ? batch[0]?.subjectId
        : batch?.subjectId;

      if (!subjectId) {
        console.error("No subject ID found in batch data");
        return;
      }

      const initialized = students.map((student) => ({
        student: student._id,
        subject: subjectId,
        status: "",
        note: "",
      }));
      setAttendanceData(initialized);
    } else {
      setAttendanceData([]);
    }
  }, [students, batch]);

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
  };

  // ✅ Save attendance
  const handleSave = async () => {
    let hasError = false;
    const entriesToSubmit = attendanceData.filter(
      (entry) => entry.status && entry.student && entry.subject
    );

    if (entriesToSubmit.length === 0) {
      console.error("No valid attendance entries to submit");
      return;
    }

    for (const entry of entriesToSubmit) {
      try {
        console.log("Submitting attendance for:", {
          student: entry.student,
          subject: entry.subject,
          status: entry.status,
          note: entry.note,
        });

        await onSaveAttendance(entry);
      } catch (error) {
        hasError = true;
        console.error(
          "Error submitting attendance:",
          entry,
          error?.response?.data
        );
      }
    }

    if (!hasError) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
        </DialogHeader>

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
                  <tr key={student._id} className="hover:bg-gray-50">
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
                      >
                        <SelectTrigger className="w-[120px] text-sm">
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
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Attendance</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
