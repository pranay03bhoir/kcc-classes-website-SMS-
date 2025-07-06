"use client";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FaCalendar,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

export default function AttendanceTable({ student }) {
  // Use student attendance data if available, otherwise use empty array
  const attendance = student?.attendance || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Present":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <FaCheckCircle className="h-3 w-3" />
            Present
          </span>
        );
      case "Absent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            <FaTimesCircle className="h-3 w-3" />
            Absent
          </span>
        );
      case "Late":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            <FaClock className="h-3 w-3" />
            Late
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            {status || "Other"}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;
  const lateCount = attendance.filter((a) => a.status === "Late").length;
  const totalCount = attendance.length;
  const attendancePercentage =
    totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
            <FaCalendar className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">
            Attendance Record
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Attendance Summary */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{presentCount}</p>
            <p className="text-xs text-gray-600">Present</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            <p className="text-xs text-gray-600">Absent</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
            <p className="text-xs text-gray-600">Late</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {attendancePercentage}%
            </p>
            <p className="text-xs text-gray-600">Attendance</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {attendance.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Subject
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((entry, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-800">
                      {formatDate(entry.date)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {entry.subject?.name || entry.subject || "N/A"}
                    </TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center">
              <FaCalendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                No attendance records found
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Your attendance data will appear here once recorded
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {attendance.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Attendance Rate
              </span>
              <span className="text-sm font-bold text-gray-800">
                {attendancePercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  attendancePercentage >= 90
                    ? "bg-green-500"
                    : attendancePercentage >= 80
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
