import api from "@/utils/axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useBatchForm = (onSuccess) => {
  const [formData, setFormData] = useState({
    name: "",
    classStd: "",
    timings: "",
    subjectId: "",
    teacherId: "",
    studentIds: [],
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Batch name is required");
      return false;
    }
    if (!formData.classStd.trim()) {
      toast.error("Class standard is required");
      return false;
    }
    if (!formData.timings.trim()) {
      toast.error("Timings are required");
      return false;
    }
    if (!formData.subjectId) {
      toast.error("Subject is required");
      return false;
    }
    if (!formData.teacherId) {
      toast.error("Teacher is required");
      return false;
    }
    return true;
  };

  const handleCheckboxChange = (studentId) => {
    const newSelectedStudents = selectedStudents.includes(studentId)
      ? selectedStudents.filter((id) => id !== studentId)
      : [...selectedStudents, studentId];

    setSelectedStudents(newSelectedStudents);
    setFormData({ ...formData, studentIds: newSelectedStudents });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      classStd: "",
      timings: "",
      subjectId: "",
      teacherId: "",
      studentIds: [],
    });
    setSelectedStudents([]);
  };

  const handleCreateBatch = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const toastId = toast.loading("Creating batch...");

    try {
      const response = await api.post("/batch/create", formData);
      if (response.status === 200) {
        toast.update(toastId, {
          render: "Batch created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        resetForm();
        onSuccess?.();
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while creating batch";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBatch = async () => {
    if (!validateForm()) return;
    if (!formData._id) {
      toast.error("No batch selected for update");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Updating batch...");

    try {
      const response = await api.put(`/batch/update/${formData._id}`, formData);
      if (response.status === 200) {
        toast.update(toastId, {
          render: "Batch updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        resetForm();
        onSuccess?.();
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while updating batch";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    if (!batchId) {
      toast.error("No batch selected for deletion");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Deleting batch...");

    try {
      const response = await api.delete(`/batch/delete/${batchId}`);
      if (response.status === 200) {
        toast.update(toastId, {
          render: "Batch deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        onSuccess?.();
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while deleting batch";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBatch = (batch) => {
    setFormData({
      ...batch,
    });
    setSelectedStudents(batch.studentIds || []);
  };

  return {
    formData,
    setFormData,
    selectedStudents,
    isLoading,
    handleCheckboxChange,
    handleCreateBatch,
    handleUpdateBatch,
    handleDeleteBatch,
    handleEditBatch,
    resetForm,
  };
};
