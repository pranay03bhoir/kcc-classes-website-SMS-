"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function StudentDetailsViewModal({
  open,
  onOpenChange,
  student,
  onEdit,
  batchList,
}) {
  if (!student) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      className=" bg-black/30 backdrop-blur-sm"
    >
      <DialogContent className="max-w-xl p-6">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        {/* Header Section */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-medium text-gray-700">
            {/* <img
              className="w-full h-full rounded-full object-cover"
              alt="Profile"
              src={student.profileImage}
            /> */}
            {/* Placeholder for profile image */}
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
            <p className="text-lg font-semibold">{student.name}</p>
            <p className="text-sm text-gray-500">ID: {student.studentId}</p>
          </div>
        </div>

        {/* Student Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
          <div>
            <p className="font-medium">Email</p>
            <p>{student.email}</p>
          </div>
          <div>
            <p className="font-medium">Phone</p>
            <p>{student.contact}</p>
          </div>
          <div>
            <p className="font-medium">Batch</p>
            <Badge
              variant="outline"
              className="bg-purple-100 text-purple-700 text-xs"
            >
              {batchList.map((batch) => batch.name).join(", ")}
            </Badge>
          </div>
          <div>
            <p className="font-medium">Attendance</p>
            <p
              className={`px-2 py-1 rounded-full text-xs text-center ${
                student.attendance?.[student.attendance.length - 1]?.status ===
                "Absent"
                  ? "bg-red-100/50 text-red-800"
                  : student.attendance?.[student.attendance.length - 1]
                      ?.status === "Late"
                  ? "bg-yellow-100/50 text-yellow-800"
                  : student.attendance?.[student.attendance.length - 1]
                      ?.status === "Present"
                  ? "bg-green-100/50 text-green-800"
                  : "bg-gray-100/50 text-gray-800"
              }`}
            >
              {student && student.attendance ? (
                <>
                  {student.attendance?.[student.attendance.length - 1]?.status}{" "}
                  Today
                  <span className="text-xs ms-1 text-gray-500">
                    (
                    {student.attendance.length > 1
                      ? `${student.attendance.length} Days`
                      : `${student.attendance.length} Day`}{" "}
                    ) attended
                  </span>
                </>
              ) : (
                <span>Loading student data...</span>
              )}
            </p>
          </div>
          <div>
            <p className="font-medium">Average Score</p>
            <p>{student.averageScore}</p>
          </div>
          <div>
            <p className="font-medium">Joined Date</p>
            <p>
              {new Date(student.createdAt).toLocaleString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
          </div>
          <div className="col-span-2">
            <p className="font-medium">Address</p>
            <p>{student.address}</p>
          </div>
        </div>

        {/* Recent Scores */}
        <div className="mb-4">
          <p className="font-medium mb-2">Recent Scores</p>
          <div className="bg-gray-50 rounded-md p-3 text-sm">
            {/* {student.scores.map((score, idx) => (
              <div
                key={idx}
                className="flex justify-between py-1 border-b last:border-b-0"
              >
                <span>{score.title}</span>
                <span>{score.value}/100</span>
              </div>
            ))} */}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onEdit}>Edit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
