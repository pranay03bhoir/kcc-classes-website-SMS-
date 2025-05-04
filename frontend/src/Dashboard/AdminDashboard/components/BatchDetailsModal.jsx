import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BatchDetailsModal = ({
  open,
  onClose,
  batch,
  subjects = {},
  teachers = {},
  students = [],
}) => {
  if (!batch) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-500 to-green-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              {batch.name} - Details
            </DialogTitle>
          </DialogHeader>
          <p className="flex items-center gap-2 mt-2 text-sm">
            <CalendarIcon className="w-4 h-4" />
            <span>{batch.timings}</span>
          </p>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-5">
          {/* Class and Subject Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>
              <strong>Class:</strong> {batch.classStd}
            </p>
            <p>
              <strong>Subject:</strong> {subjects?.name || "Unknown"}
            </p>
            <p>
              <strong>Teacher:</strong> {teachers?.name || "Unknown"}
            </p>
          </div>

          {/* Student Avatars */}
          <div>
            <p className="font-semibold mb-2 flex items-center gap-2">
              <UsersIcon className="w-4 h-4" /> Students
            </p>
            <div className="flex items-center gap-2">
              {students.slice(0, 5).map((student) => (
                <Avatar key={student._id}>
                  <AvatarImage src={student?.profileImage} />
                  <AvatarFallback>{student?.name?.[0]}</AvatarFallback>
                </Avatar>
              ))}
              {students.length > 5 && (
                <span className="text-sm text-gray-500">
                  +{students.length - 5}
                </span>
              )}
            </div>
          </div>

          {/* Agenda Style */}
          <div>
            <p className="font-semibold mb-2">📌 Student List</p>
            <ul className="space-y-1 pl-5 list-disc text-sm text-gray-800">
              {students.map((student, index) => (
                <li key={index}>{student?.name || "Unknown"}</li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchDetailsModal;
