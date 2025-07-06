"use client";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FaBook,
  FaCalculator,
  FaChartBar,
  FaClock,
  FaFlask,
  FaGlobe,
  FaGraduationCap,
  FaUserTie,
} from "react-icons/fa";

export default function SubjectList({ student }) {
  // Mock batch data - in real implementation, this would come from the student's batches
  // The student prop should contain the populated batches with subject and teacher information
  const batches = student?.batches || [
    {
      _id: "1",
      batchId: "BTH-10-Morning-0001",
      name: "Advanced Mathematics",
      classStd: "10th Standard",
      timings: "Morning (8:00 AM - 10:00 AM)",
      subject: {
        name: "Mathematics",
        icon: <FaCalculator className="h-6 w-6" />,
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      teacher: {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@kcc.edu",
      },
      progress: 92,
      grade: "A+",
    },
    {
      _id: "2",
      batchId: "BTH-10-Afternoon-0002",
      name: "Physics Fundamentals",
      classStd: "10th Standard",
      timings: "Afternoon (2:00 PM - 4:00 PM)",
      subject: {
        name: "Physics",
        icon: <FaFlask className="h-6 w-6" />,
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      teacher: {
        name: "Prof. Michael Chen",
        email: "michael.chen@kcc.edu",
      },
      progress: 88,
      grade: "A",
    },
    {
      _id: "3",
      batchId: "BTH-10-Evening-0003",
      name: "English Literature",
      classStd: "10th Standard",
      timings: "Evening (6:00 PM - 8:00 PM)",
      subject: {
        name: "English Literature",
        icon: <FaBook className="h-6 w-6" />,
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
      teacher: {
        name: "Ms. Emily Davis",
        email: "emily.davis@kcc.edu",
      },
      progress: 85,
      grade: "A-",
    },
    {
      _id: "4",
      batchId: "BTH-10-Morning-0004",
      name: "World History",
      classStd: "10th Standard",
      timings: "Morning (10:00 AM - 12:00 PM)",
      subject: {
        name: "World History",
        icon: <FaGlobe className="h-6 w-6" />,
        color: "from-orange-500 to-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      },
      teacher: {
        name: "Dr. Robert Wilson",
        email: "robert.wilson@kcc.edu",
      },
      progress: 78,
      grade: "B+",
    },
  ];

  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "text-green-600";
    if (grade.startsWith("B")) return "text-blue-600";
    if (grade.startsWith("C")) return "text-yellow-600";
    return "text-red-600";
  };

  const getSubjectIcon = (subjectName) => {
    const iconMap = {
      Mathematics: <FaCalculator className="h-6 w-6" />,
      Physics: <FaFlask className="h-6 w-6" />,
      "English Literature": <FaBook className="h-6 w-6" />,
      "World History": <FaGlobe className="h-6 w-6" />,
      Chemistry: <FaFlask className="h-6 w-6" />,
      Biology: <FaFlask className="h-6 w-6" />,
      "Computer Science": <FaCalculator className="h-6 w-6" />,
    };
    return iconMap[subjectName] || <FaBook className="h-6 w-6" />;
  };

  const getSubjectColors = (subjectName) => {
    const colorMap = {
      Mathematics: {
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      Physics: {
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      "English Literature": {
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
      "World History": {
        color: "from-orange-500 to-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      },
      Chemistry: {
        color: "from-red-500 to-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
      Biology: {
        color: "from-teal-500 to-teal-600",
        bgColor: "bg-teal-50",
        borderColor: "border-teal-200",
      },
      "Computer Science": {
        color: "from-indigo-500 to-indigo-600",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
      },
    };
    return (
      colorMap[subjectName] || {
        color: "from-gray-500 to-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
    );
  };

  return (
    <div className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
            <FaGraduationCap className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">
            Enrolled Batches
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batches.map((batch, idx) => {
            const subjectColors = getSubjectColors(
              batch.subject?.name || batch.subjectId?.name || batch.subjectId
            );
            const subjectIcon = getSubjectIcon(
              batch.subject?.name || batch.subjectId?.name || batch.subjectId
            );

            return (
              <div
                key={batch._id || idx}
                className={`p-4 rounded-lg border ${subjectColors.bgColor} ${subjectColors.borderColor} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${subjectColors.color}`}
                    >
                      <div className="text-white">{subjectIcon}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {batch.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Subject:{" "}
                        {batch.subject?.name ||
                          batch.subjectId?.name ||
                          "Subject TBD"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Teacher:{" "}
                        {batch.teacher?.name ||
                          batch.teacherId?.name ||
                          "Teacher TBD"}
                      </p>
                    </div>
                  </div>
                  {/* <div className="text-right">
                    <span
                      className={`text-lg font-bold ${getGradeColor(
                        batch.grade || "N/A"
                      )}`}
                    >
                      {batch.grade || "N/A"}
                    </span>
                  </div> */}
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaClock className="h-4 w-4" />
                    <span>{batch.timings}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaUserTie className="h-4 w-4" />
                    <span>{batch.classStd}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    ID: {batch.batchId}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Academic Summary */}
        {/* <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <FaChartBar className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-gray-700">
                  Average Grade
                </span>
              </div>
              <p className="text-xl font-bold text-teal-600">
                {batches.length > 0
                  ? batches.reduce((acc, batch) => {
                      const gradeValue =
                        batch.grade === "A+"
                          ? 4.3
                          : batch.grade === "A"
                          ? 4.0
                          : batch.grade === "A-"
                          ? 3.7
                          : batch.grade === "B+"
                          ? 3.3
                          : batch.grade === "B"
                          ? 3.0
                          : batch.grade === "B-"
                          ? 2.7
                          : batch.grade === "C+"
                          ? 2.3
                          : batch.grade === "C"
                          ? 2.0
                          : 0;
                      return acc + gradeValue;
                    }, 0) /
                      batches.length >
                    3.7
                    ? "A-"
                    : "B+"
                  : "N/A"}
              </p>
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-gray-700">
                Total Batches
              </span>
              <p className="text-xl font-bold text-teal-600">
                {batches.length}
              </p>
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-gray-700">
                High Performers
              </span>
              <p className="text-xl font-bold text-teal-600">
                {
                  batches.filter(
                    (batch) => batch.grade && batch.grade.startsWith("A")
                  ).length
                }
              </p>
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-gray-700">
                Avg Progress
              </span>
              <p className="text-xl font-bold text-teal-600">
                {batches.length > 0
                  ? Math.round(
                      batches.reduce(
                        (acc, batch) => acc + (batch.progress || 0),
                        0
                      ) / batches.length
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div> */}
      </CardContent>
    </div>
  );
}
