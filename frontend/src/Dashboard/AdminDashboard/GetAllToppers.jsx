"use client";
import { useEffect, useState } from "react";
import { getAllToppers, deleteTopperStudent } from "../../utils/axios";

const GetAllToppers = () => {
  const [toppers, setToppers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTopper, setSelectedTopper] = useState(null);

  useEffect(() => {
    const fetchToppers = async () => {
      try {
        setLoading(true);
        const res = await getAllToppers();
        setToppers(res.data.toppers || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch toppers");
      } finally {
        setLoading(false);
      }
    };
    fetchToppers();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteTopperStudent(id);
      setToppers((prev) => prev.filter((t) => t._id !== id));
      setShowConfirm(false);
      setSelectedTopper(null);
    } catch (err) {
      setDeleteError("Failed to delete topper");
    } finally {
      setDeletingId(null);
    }
  };

  const openConfirm = (topper) => {
    setSelectedTopper(topper);
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setSelectedTopper(null);
  };

  if (loading) return <div>Loading toppers...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!toppers.length) return <div>No toppers found.</div>;

  return (
    <div className="flex flex-col items-center w-full">
      {deleteError && (
        <div className="text-red-500 mb-2">{deleteError}</div>
      )}
      {toppers.map((topper) => (
        <div
          key={topper._id}
          className="relative flex flex-row items-center gap-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg px-8 py-7 mb-8 min-w-[350px] max-w-2xl w-full border-2 border-transparent hover:border-blue-400 transition-all duration-200 group"
        >
          {/* Profile Image with ring */}
          {topper.profileImage ? (
            <div className="relative">
              <img
                src={topper.profileImage}
                alt={topper.studentName}
                className="w-24 h-24 rounded-full object-cover bg-gray-100 ring-4 ring-blue-200 group-hover:ring-blue-400 transition-all duration-200 shadow-md"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 text-4xl ring-4 ring-blue-100 group-hover:ring-blue-400 transition-all duration-200 shadow-md">
              <span>👤</span>
            </div>
          )}
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-3">
              <div className="font-semibold text-xl text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                {topper.studentName}
              </div>
              {/* Badge for exam type/year */}
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-blue-200">
                {topper.examType} {topper.year}
              </span>
            </div>
            <div className="text-green-700 font-bold text-lg">
              Score: <span className="text-green-900">{topper.score}</span>
            </div>
            {topper.otherAchievements &&
              topper.otherAchievements.length > 0 && (
                <div className="text-sm text-gray-700 mt-2">
                  <span className="font-semibold">Other Achievements:</span>
                  <ul className="list-disc ml-6 mt-1 space-y-1">
                    {topper.otherAchievements.map((ach, idx) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
          {/* Decorative Ribbon */}
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Topper
          </div>
          {/* Delete Button */}
          <button
            className="absolute top-3 right-24 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 rounded-full px-3 py-1 text-xs font-semibold shadow transition-all duration-150 border border-red-200"
            onClick={() => openConfirm(topper)}
            disabled={deletingId === topper._id}
          >
            {deletingId === topper._id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
      {/* Confirmation Dialog */}
      {showConfirm && selectedTopper && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-w-[300px]">
            <div className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</div>
            <div className="mb-6 text-gray-600 text-center">
              Are you sure you want to delete <span className="font-bold">{selectedTopper.studentName}</span> ({selectedTopper.examType} {selectedTopper.year})?
            </div>
            <div className="flex gap-4">
              <button
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
                onClick={closeConfirm}
                disabled={deletingId === selectedTopper._id}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition font-semibold"
                onClick={() => handleDelete(selectedTopper._id)}
                disabled={deletingId === selectedTopper._id}
              >
                {deletingId === selectedTopper._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllToppers;
