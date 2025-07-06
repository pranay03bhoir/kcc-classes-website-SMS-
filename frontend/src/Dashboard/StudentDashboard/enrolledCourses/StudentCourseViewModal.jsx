"use client";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Award,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  Clock4,
  FileText,
  GraduationCap,
  Mail,
  MinusCircle,
  Phone,
  Star,
  Target,
  TrendingUp,
  Users,
  Users2,
  XCircle,
} from "lucide-react";

const StudentCourseViewModal = ({ course, onClose }) => {
  if (!course) return null;

  const getCategoryColor = (category) => {
    const colors = {
      "Science Stream": "from-slate-600 to-slate-700",
      "Commerce Stream": "from-slate-600 to-slate-700",
      "High School": "from-slate-600 to-slate-700",
      "Middle School": "from-slate-600 to-slate-700",
      Science: "from-slate-600 to-slate-700",
      Mathematics: "from-slate-600 to-slate-700",
      English: "from-slate-600 to-slate-700",
      History: "from-slate-600 to-slate-700",
      Geography: "from-slate-600 to-slate-700",
      default: "from-slate-600 to-slate-700",
    };
    return colors[category] || colors.default;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Calculate attendance percentage from actual attendance data
  const calculateAttendancePercentage = () => {
    if (!course.attendance || course.attendance.length === 0) return 0;

    const totalClasses = course.attendance.length;
    const presentClasses = course.attendance.filter(
      (att) => att.status === "Present"
    ).length;
    return Math.round((presentClasses / totalClasses) * 100);
  };

  // Calculate average score from actual scores data
  const calculateAverageScore = () => {
    if (!course.scores || course.scores.length === 0) return 0;

    const totalScore = course.scores.reduce(
      (sum, score) => sum + score.score,
      0
    );
    return Math.round(totalScore / course.scores.length);
  };

  // Get teacher information from populated data
  const getTeacherInfo = () => {
    if (
      course.teachers &&
      Array.isArray(course.teachers) &&
      course.teachers.length > 0
    ) {
      return course.teachers;
    }
    return [];
  };

  // Get batch information from populated data
  const getBatchInfo = () => {
    if (
      course.batches &&
      Array.isArray(course.batches) &&
      course.batches.length > 0
    ) {
      return course.batches;
    }
    return [];
  };

  // Get attendance status icon
  const getAttendanceIcon = (status) => {
    switch (status) {
      case "Present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Late":
        return <MinusCircle className="w-4 h-4 text-yellow-600" />;
      case "Other":
        return <MinusCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <MinusCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get attendance status text
  const getAttendanceText = (status) => {
    switch (status) {
      case "Present":
        return "Present";
      case "Absent":
        return "Absent";
      case "Late":
        return "Late";
      case "Other":
        return "Other";
      default:
        return "Unknown";
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-6">
        <DialogHeader className="text-left">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-semibold text-slate-900 mb-2">
                {course.name}
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-base">
                {course.description}
              </DialogDescription>
            </div>
            <BookOpen className="w-6 h-6 text-slate-400" />
          </div>
        </DialogHeader>
      </div>

      <div className="p-6 space-y-6">
        {/* Course Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <GraduationCap className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Course Code</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 ml-6">{course.code}</p>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Award className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Category</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 ml-6">{course.category}</p>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Grade Level</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 ml-6">{course.gradeLevel}</p>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Duration</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 ml-6">{course.duration}</p>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Classes/Week</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 ml-6">
              {course.classesPerWeek || "Not specified"}
            </p>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Rating</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 ml-6">
              {course.rating ? `${course.rating}/5` : "Not rated"}
            </p>
          </div>
        </div>

        {/* Teachers Section */}
        <div className="border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Users className="w-4 h-4 text-slate-600 mr-2 flex-shrink-0" />
            Course Teachers
          </h3>
          {getTeacherInfo().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getTeacherInfo().map((teacher, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start space-x-3 mb-3">
                    {teacher.profileImage ? (
                      <img
                        src={teacher.profileImage}
                        alt={teacher.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-slate-600 font-medium text-sm">
                          {getInitials(teacher.name)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 truncate">
                        {teacher.name}
                      </h4>
                      <p className="text-sm text-slate-600">Teacher</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm ml-13">
                    {teacher.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-700 truncate">{teacher.email}</span>
                      </div>
                    )}
                    {teacher.contact && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-700">{teacher.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">Teachers will be assigned soon</p>
            </div>
          )}
        </div>

        {/* Batch Information */}
        {getBatchInfo().length > 0 && (
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Users2 className="w-4 h-4 text-slate-600 mr-2 flex-shrink-0" />
              Batch Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getBatchInfo().map((batch, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 truncate">
                        {batch.name}
                      </h4>
                      <p className="text-sm text-slate-600">
                        Batch ID: {batch.batchId}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded flex-shrink-0 ml-2">
                      {batch.classStd}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock4 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700">{batch.timings}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700">
                        Created: {new Date(batch.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tracking */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-slate-600 mr-2 flex-shrink-0" />
            Your Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white border border-slate-200 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {calculateAttendancePercentage()}%
              </div>
              <div className="text-sm text-slate-600 font-medium">Attendance</div>
              <div className="text-xs text-slate-500 mt-1">
                {course.attendance ? `${course.attendance.length} classes` : "No attendance data"}
              </div>
            </div>
            <div className="text-center p-4 bg-white border border-slate-200 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {calculateAverageScore()}%
              </div>
              <div className="text-sm text-slate-600 font-medium">Average Score</div>
              <div className="text-xs text-slate-500 mt-1">
                {course.scores ? `${course.scores.length} scores` : "No scores data"}
              </div>
            </div>
            <div className="text-center p-4 bg-white border border-slate-200 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {course.scores ? course.scores.length : 0}
              </div>
              <div className="text-sm text-slate-600 font-medium">Total Scores</div>
              <div className="text-xs text-slate-500 mt-1">
                {course.attendance ? `${course.attendance.length} attendance records` : "No attendance records"}
              </div>
            </div>
          </div>

          {/* Show message when no progress data is available */}
          {(!course.attendance || course.attendance.length === 0) &&
            (!course.scores || course.scores.length === 0) && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-amber-800 font-medium">No Progress Data Available</p>
                  <p className="text-amber-700 text-sm mt-1">
                    Attendance and score data will appear here once your teachers start recording them.
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Scores Section */}
        {course.scores && course.scores.length > 0 && (
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Award className="w-4 h-4 text-slate-600 mr-2 flex-shrink-0" />
              Your Scores
            </h3>
            <div className="space-y-3">
              {course.scores.map((score, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-slate-700 block">
                      {score.examType || `Score #${index + 1}`}
                    </span>
                    <p className="text-sm text-slate-600">
                      {new Date(score.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span className="text-lg font-bold text-slate-900">
                      {score.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Section */}
        {course.attendance && course.attendance.length > 0 && (
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Calendar className="w-4 h-4 text-slate-600 mr-2 flex-shrink-0" />
              Attendance Record
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {course.attendance.map((att, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getAttendanceIcon(att.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-slate-700 block">
                        {getAttendanceText(att.status)}
                      </span>
                      <p className="text-sm text-slate-600">
                        {new Date(att.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Schedule & Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schedule Section */}
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Calendar className="w-4 h-4 text-slate-600 mr-2 flex-shrink-0" />
              Course Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <span className="font-medium text-slate-700">Course Type</span>
                <span className="text-slate-900 text-right">{course.category}</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <span className="font-medium text-slate-700">Duration</span>
                <span className="text-slate-900 text-right">{course.duration}</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <span className="font-medium text-slate-700">Classes per Week</span>
                <span className="text-slate-900 text-right">
                  {course.classesPerWeek || "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <span className="font-medium text-slate-700">Grade Level</span>
                <span className="text-slate-900 text-right">{course.gradeLevel}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <FileText className="w-4 h-4 text-slate-600 mr-2 flex-shrink-0" />
              Additional Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <span className="font-medium text-slate-700">Course Code</span>
                <span className="text-slate-900 text-right">{course.code}</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <span className="font-medium text-slate-700">Created</span>
                <span className="text-slate-900 text-right">
                  {new Date(course.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <span className="font-medium text-slate-700">Last Updated</span>
                <span className="text-slate-900 text-right">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4 bg-slate-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-600">
            Last updated: {new Date(course.updatedAt).toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </DialogContent>
  );
};

export default StudentCourseViewModal;
