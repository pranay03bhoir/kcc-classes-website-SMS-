"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { FaEnvelope, FaIdCard, FaUser } from "react-icons/fa";
import ViewModal from "./ViewModal";

// Helper function to safely convert values to strings
const safeToString = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "Loading...";
  }
  return String(value);
};

export default function ProfileCard({ student }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <FaUser className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">
            Student Profile
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FaUser className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Full Name</p>
              <p className="text-gray-800 font-semibold">
                {student?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FaEnvelope className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Email Address</p>
              <p className="text-gray-800 font-semibold">
                {student?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FaIdCard className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Enrollment No.
              </p>
              <p className="text-gray-800 font-semibold">
                {student?.studentId}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          onClick={() => setIsOpen(true)}
        >
          View Complete Profile
        </Button>
        <ViewModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          student={student}
        />
      </div>
    </div>
  );
}
