import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import api from "@/utils/axios";
import React, { useState as useReactState, useState } from "react";

const EditTeacherDetails = ({ open, onClose, teacher, onSuccess }) => {
  const [form, setForm] = useState({
    name: teacher?.name || "",
    email: teacher?.email || "",
    password: "",
    contact: teacher?.contact || "",
    alternateContact: teacher?.alternateContact || "",
    address: teacher?.address || "",
    joiningYear: teacher?.joiningYear || "",
    profileImage: teacher?.profileImage || "",
    isVerified: teacher?.isVerified || false,
    role: teacher?.role || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailEnabled, setEmailEnabled] = useReactState(false);
  const [roleEnabled, setRoleEnabled] = useReactState(false);
  const [showPassword, setShowPassword] = useReactState(false);

  React.useEffect(() => {
    setForm({
      name: teacher?.name || "",
      email: teacher?.email || "",
      password: "",
      contact: teacher?.contact || "",
      alternateContact: teacher?.alternateContact || "",
      address: teacher?.address || "",
      joiningYear: teacher?.joiningYear || "",
      profileImage: teacher?.profileImage || "",
      isVerified: teacher?.isVerified || false,
      role: teacher?.role || "",
    });
    setError(null);
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateContact = (value) => /^[0-9]{10}$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Trim all string fields
    const trimmedForm = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      contact: form.contact.trim(),
      alternateContact: form.alternateContact.trim(),
      address: form.address.trim(),
      profileImage: form.profileImage.trim(),
      role: form.role.trim(),
      joiningYear: form.joiningYear !== "" ? Number(form.joiningYear) : "",
    };
    // Validate contact fields
    if (!validateContact(trimmedForm.contact)) {
      setError("Contact number must be a 10-digit number");
      setLoading(false);
      return;
    }
    if (
      trimmedForm.alternateContact &&
      !validateContact(trimmedForm.alternateContact)
    ) {
      setError("Alternate contact number must be a 10-digit number");
      setLoading(false);
      return;
    }
    // Validate joiningYear
    const currentYear = new Date().getFullYear();
    if (
      trimmedForm.joiningYear &&
      (typeof trimmedForm.joiningYear !== "number" ||
        trimmedForm.joiningYear < 2000 ||
        trimmedForm.joiningYear > currentYear + 1)
    ) {
      setError(`Joining year must be between 2000 and ${currentYear + 1}`);
      setLoading(false);
      return;
    }
    try {
      const payload = { ...trimmedForm };
      if (!payload.password) delete payload.password;
      const res = await api.put(`/teachers/update/${teacher._id}`, payload);
      if (res.data.success) {
        onSuccess && onSuccess();
        onClose && onClose();
      } else {
        setError(res.data.message || "Failed to update teacher");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating teacher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-2xl rounded-2xl border border-slate-200">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-slate-800">Edit Teacher</DialogTitle>
        <DialogDescription className="text-slate-500">
          Update details for <span className="font-semibold text-primary">{teacher?.name}</span>
        </DialogDescription>
      </DialogHeader>
      <div className="overflow-y-auto flex-1 py-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* Main Info Section */}
          <div className="rounded-xl border bg-white/80 shadow-sm p-6 flex flex-col gap-6">
            <h3 className="text-base font-medium text-slate-700 mb-2 border-b border-slate-100 pb-2">Personal Information</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex-1 min-w-[320px] flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Name</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoFocus
                  className="flex-1 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                  placeholder="Enter full name"
                />
              </div>
              <div className="flex-1 min-w-[320px] flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Contact</label>
                <Input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                  placeholder="10-digit number"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex-1 min-w-[320px] flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Alternate Contact</label>
                <Input
                  name="alternateContact"
                  value={form.alternateContact}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                  placeholder="10-digit number (optional)"
                />
              </div>
              <div className="flex-1 min-w-[320px] flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Address</label>
                <Textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="flex-1 min-h-[48px] bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                  placeholder="Full address"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex-1 min-w-[320px] flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Joining Year</label>
                <Input
                  name="joiningYear"
                  type="number"
                  value={form.joiningYear}
                  onChange={handleChange}
                  required
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  className="flex-1 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                  placeholder="YYYY"
                />
              </div>
              <div className="flex-1 min-w-[320px] flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Profile Image</label>
                <Input
                  name="profileImage"
                  value={form.profileImage}
                  onChange={handleChange}
                  className="flex-1 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                  placeholder="Image URL (optional)"
                />
              </div>
            </div>
          </div>
          {/* Account Section */}
          <div className="rounded-xl border bg-white/80 shadow-sm p-6 flex flex-col gap-6">
            <h3 className="text-base font-medium text-slate-700 mb-2 border-b border-slate-100 pb-2">Account & Access</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex-1 min-w-[400px] flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Email</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={() => setEmailEnabled((v) => !v)}
                    className="accent-primary h-5 w-5 rounded-full border-2 border-primary bg-white transition-colors duration-150 focus:ring-2 focus:ring-primary/40"
                    id="toggle-email"
                  />
                  <span className="text-xs text-gray-400">Enable</span>
                </div>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={!emailEnabled}
                  className="flex-1 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                  placeholder="Email address"
                />
              </div>
              <div className="flex-1 min-w-[400px] flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Role <span className="text-xs text-gray-400">(optional)</span></label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={roleEnabled}
                    onChange={() => setRoleEnabled((v) => !v)}
                    className="accent-primary h-5 w-5 rounded-full border-2 border-primary bg-white transition-colors duration-150 focus:ring-2 focus:ring-primary/40"
                    id="toggle-role"
                  />
                  <span className="text-xs text-gray-400">Enable</span>
                </div>
                <Input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={!roleEnabled}
                  className="flex-1 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                  placeholder="Role (optional)"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex-1 min-w-[320px] flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Password <span className="text-xs text-gray-400">(leave blank to keep unchanged)</span></label>
                <div className="relative flex-1">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="pr-10 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                    placeholder="New password (optional)"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
              </div>
              <div className="flex-1 min-w-[320px] flex items-center gap-4 mt-2">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={form.isVerified}
                  onChange={handleChange}
                  id="isVerified"
                  className="accent-primary h-5 w-5 rounded-full border-2 border-primary bg-white transition-colors duration-150 focus:ring-2 focus:ring-primary/40"
                />
                <label htmlFor="isVerified" className="text-sm font-medium text-slate-700">
                  Verified
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button type="submit" disabled={loading} className="min-w-[120px] bg-primary text-white hover:bg-primary/90 rounded-lg shadow-sm">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose} className="rounded-lg">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  );
};

export default EditTeacherDetails;
