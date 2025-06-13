import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditBatchModal = ({
  open,
  onClose,
  batch,
  subjects,
  teachers,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    classStd: "",
    timings: "",
    subjectId: "",
    teacherId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (batch) {
      setFormData({
        name: batch.name || "",
        classStd: batch.classStd || "",
        timings: batch.timings || "",
        subjectId: batch.subjectId || "",
        teacherId: batch.teacherId || "",
      });
      setErrors({});
    }
  }, [batch]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Batch name is required";
    }
    if (!formData.classStd.trim()) {
      newErrors.classStd = "Class standard is required";
    }
    if (!formData.timings.trim()) {
      newErrors.timings = "Timings are required";
    }
    if (!formData.subjectId) {
      newErrors.subjectId = "Subject is required";
    }
    if (!formData.teacherId) {
      newErrors.teacherId = "Teacher is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update batch");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Batch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Batch Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter batch name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Class Standard</label>
            <Input
              value={formData.classStd}
              onChange={(e) =>
                setFormData({ ...formData, classStd: e.target.value })
              }
              placeholder="Enter class standard"
              className={errors.classStd ? "border-red-500" : ""}
            />
            {errors.classStd && (
              <p className="text-sm text-red-500">{errors.classStd}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Timings</label>
            <Input
              value={formData.timings}
              onChange={(e) =>
                setFormData({ ...formData, timings: e.target.value })
              }
              placeholder="Enter batch timings"
              className={errors.timings ? "border-red-500" : ""}
            />
            {errors.timings && (
              <p className="text-sm text-red-500">{errors.timings}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Select
              value={formData.subjectId}
              onValueChange={(value) =>
                setFormData({ ...formData, subjectId: value })
              }
            >
              <SelectTrigger
                className={errors.subjectId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject._id} value={subject._id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subjectId && (
              <p className="text-sm text-red-500">{errors.subjectId}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Teacher</label>
            <Select
              value={formData.teacherId}
              onValueChange={(value) =>
                setFormData({ ...formData, teacherId: value })
              }
            >
              <SelectTrigger
                className={errors.teacherId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teacherId && (
              <p className="text-sm text-red-500">{errors.teacherId}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditBatchModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  batch: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    classStd: PropTypes.string.isRequired,
    timings: PropTypes.string.isRequired,
    subjectId: PropTypes.string.isRequired,
    teacherId: PropTypes.string.isRequired,
  }),
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  teachers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditBatchModal;
