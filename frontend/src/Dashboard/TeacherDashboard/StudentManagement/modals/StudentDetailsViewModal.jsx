"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

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
      <DialogContent className="max-w-xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Student Details
          </DialogTitle>
        </DialogHeader>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4">
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
          <div className="text-center sm:text-left">
            <p className="text-base sm:text-lg font-semibold">{student.name}</p>
            <p className="text-xs sm:text-sm text-gray-500">
              ID: {student.studentId}
            </p>
          </div>
        </div>

        {/* Student Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700 mb-4">
          <div>
            <p className="font-medium">Email</p>
            <p className="break-all">{student.email}</p>
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
          <div className="col-span-1 sm:col-span-2">
            <p className="font-medium">Address</p>
            <p className="break-words">{student.address}</p>
          </div>
        </div>

        {/* Recent Scores */}
        <div className="mb-4">
          <p className="font-medium mb-2">Recent Scores</p>
          {student.scores && student.scores.length > 0 ? (
            <div className="rounded-md p-2 sm:p-3 text-xs sm:text-sm max-h-40 overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 font-semibold text-gray-600 border-b pb-1 mb-1">
                <span>Exam</span>
                {student.scores[0].subject && <span>Subject</span>}
                <span>Date</span>
                <span>Score</span>
              </div>
              {student.scores.map((score, idx) => {
                // Color logic for progress bar
                let barColor = "bg-green-500";
                if (score.score < 50) barColor = "bg-red-500";
                else if (score.score < 75) barColor = "bg-yellow-400";
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-4 gap-2 items-center py-1 border-b last:border-b-0"
                  >
                    <span>{score.examType}</span>
                    {score.subject.name && <span>{score.subject.name}</span>}
                    <span>{score.date.split("T")[0]}</span>
                    <span className="flex flex-col gap-1">
                      <span className="font-medium">{score.score}/100</span>
                      <div className="w-24">
                        <Progress value={score.score} className={barColor} />
                      </div>
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-400 italic p-2">No scores available.</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button onClick={onEdit} className="w-full sm:w-auto">
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
