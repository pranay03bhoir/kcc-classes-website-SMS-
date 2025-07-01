import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getTeacherDetails } from "@/utils/teacher-axios";
import { useEffect, useState } from "react";
import { FaLayerGroup, FaUserGraduate } from "react-icons/fa6";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const DEFAULT_PROFILE = "/images/default-profile.png";

const BatchDetailsModal = ({ batchId, onClose }) => {
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState({});

  useEffect(() => {
    const fetchBatchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTeacherDetails();
        const teacherData = res.data.teacher;
        const foundBatch = teacherData?.batches?.find(
          (b) => b._id === batchId || b.batchId === batchId
        );
        if (!foundBatch) {
          setError("Batch not found");
        } else {
          setBatch(foundBatch);
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to fetch batch details"
        );
      } finally {
        setLoading(false);
      }
    };
    if (batchId) fetchBatchDetails();
  }, [batchId]);

  if (!batchId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-2 p-2 sm:p-8 relative animate-fadeIn border border-blue-100 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-blue-600 text-2xl font-extrabold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col gap-1 sm:gap-2">
          <h3 className="text-lg sm:text-2xl font-extrabold mb-1 sm:mb-2 text-blue-700 flex items-center gap-2 sm:gap-3">
            <FaLayerGroup className="text-blue-400 text-xl sm:text-3xl" /> Batch
            Details
          </h3>
          <div className="border-b border-gray-200 mb-2 sm:mb-4" />
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[120px]">
            <LoadingSpinner size="md" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : (
          <>
            <div className="space-y-1 sm:space-y-2 text-gray-700 mb-4 sm:mb-6">
              <div>
                <span className="font-semibold">Name:</span> {batch.name}
              </div>
              <div>
                <span className="font-semibold">Timing:</span>{" "}
                {batch.timings || "-"}
              </div>
              <div>
                <span className="font-semibold">Subject:</span>{" "}
                {batch.subjectId?.name || "-"}
              </div>
              <div>
                <span className="font-semibold">Students:</span>{" "}
                {batch.studentIds?.length || 0}
              </div>
              <div>
                <span className="font-semibold">Batch ID:</span>{" "}
                {batch.batchId || batch._id}
              </div>
            </div>
            <div className="border-b border-gray-200 mb-2 sm:mb-4" />
            {/* Students Section */}
            <div className="mb-2">
              <h4 className="text-base sm:text-lg font-bold flex items-center gap-1 sm:gap-2 text-purple-700 mb-1 sm:mb-2">
                <FaUserGraduate className="text-purple-400 text-lg sm:text-xl" />{" "}
                Students
              </h4>
              {batch.studentIds && batch.studentIds.length > 0 ? (
                <div className="max-h-56 sm:max-h-72 overflow-y-auto divide-y divide-gray-100 rounded-md border border-gray-100 bg-gray-50">
                  {batch.studentIds.map((student) => {
                    const showFallback =
                      !student.profileImage ||
                      imgError[student._id || student.studentId];
                    return (
                      <div
                        key={student._id || student.studentId}
                        className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 p-2 sm:p-3 hover:bg-blue-50/40 transition-colors"
                      >
                        {showFallback ? (
                          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-blue-200 text-blue-700 font-bold text-base sm:text-lg border select-none">
                            {getInitials(student.name)}
                          </div>
                        ) : (
                          <img
                            src={student.profileImage}
                            alt={student.name}
                            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border"
                            onError={() =>
                              setImgError((prev) => ({
                                ...prev,
                                [student._id || student.studentId]: true,
                              }))
                            }
                          />
                        )}
                        <div className="flex-1 text-center sm:text-left">
                          <div className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">
                            {student.name}
                          </div>
                          <div className="text-xs text-gray-600 break-all">
                            {student.email}
                          </div>
                          <div className="text-xs text-gray-600 break-all">
                           Contact: {student.contact}
                          </div>
                          <div className="text-xs text-gray-600">
                            ID: {student.studentId}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-500 italic text-center py-4">
                  No students in this batch yet.
                </div>
              )}
            </div>
          </>
        )}
        <div className="mt-4 sm:mt-6 flex justify-end">
          <button
            className="px-4 sm:px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition-colors duration-150 text-sm sm:text-base"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsModal;
