import React from 'react'
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/utils/axios";

const AddTeacher = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    alternateContact: "",
    address: "",
    joiningYear: "",
    profileImage: "",
    isVerified: false,
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const res = await api.post("/teachers/register", trimmedForm);
      if (res.data.success) {
        onSuccess && onSuccess();
      } else {
        setError(res.data.message || "Failed to add teacher");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error adding teacher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxHeight: "90vh", overflowY: "auto" }}>
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
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="flex-1 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                placeholder="Email address"
              />
            </div>
            <div className="flex-1 min-w-[400px] flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Role <span className="text-xs text-gray-400">(optional)</span></label>
              <Input
                name="role"
                value={form.role}
                onChange={handleChange}
                className="flex-1 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                placeholder="Role (optional)"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex-1 min-w-[320px] flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Password</label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="pr-10 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                placeholder="Password"
              />
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
        <div className="mt-4 flex justify-end gap-2">
          <Button type="submit" disabled={loading} className="min-w-[120px] bg-primary text-white hover:bg-primary/90 rounded-lg shadow-sm">
            {loading ? "Adding..." : "Add Teacher"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="rounded-lg">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTeacher;