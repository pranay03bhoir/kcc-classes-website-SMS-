"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SaveConfirmationModal from "./SaveConfirmationModal";
export default function EditStudentModal({
  isOpen,
  onClose,
  student,
  onSave,
  batchList,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    batches: "",
    contact: "",
    address: "",
  });

  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        batches: student.batches || "",
        contact: student.contact || "",
        address: student.address || "",
      });
    }

    // const fetchBatches = async () => {
    //   try {
    //     const response = await api.get("get/batches"); // ✅ Added await
    //     setBatchList(response.data.batches);
    //   } catch (error) {
    //     console.error("Error fetching batches:", error);
    //   }
    // };
    // fetchBatches();
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // const payload = {
    //   ...formData,
    //   batches: selectedBatch,
    // };

    onSave({ ...formData });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Edit Student</h2>

            {/* Full Name */}
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mb-3"
              type="text"
            />

            {/* Email (read-only) */}
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={formData.email}
              disabled
              className="w-full border rounded-md p-2 mb-3 bg-gray-100"
              type="email"
            />

            {/* Batch */}
            <label className="block text-sm font-medium mb-1">Batch</label>
            <select
              name="batches"
              value={formData.batches}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mb-3"
            >
              <option value="">Select Batch</option>
              {batchList.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </select>

            {/* Phone Number */}
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mb-3"
              type="text"
            />

            {/* Address */}
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mb-4"
              rows="2"
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setConfirmSaveOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </motion.div>
          <SaveConfirmationModal
            isOpen={confirmSaveOpen}
            onCancel={() => setConfirmSaveOpen(false)}
            onConfirm={() => {
              setConfirmSaveOpen(false);
              handleSubmit();
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
