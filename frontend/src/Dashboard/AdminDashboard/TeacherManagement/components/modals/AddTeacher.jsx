import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/utils/axios";
import { useState } from "react";

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
    // Prepare payload according to backend requirements
    const trimmedForm = {
      name: form.name.trim(),
      email: form.email.toLowerCase().trim(),
      password: form.password,
      contact: form.contact.trim(),
      alternateContact: form.alternateContact.trim(),
      address: form.address.trim(),
      joiningYear: form.joiningYear !== "" ? parseInt(form.joiningYear) : "",
      profileImage: form.profileImage.trim(),
    };
    // Remove optional fields if empty
    if (!trimmedForm.alternateContact) delete trimmedForm.alternateContact;
    if (!trimmedForm.profileImage) delete trimmedForm.profileImage;
    // Validate contact fields
    if (!/^[0-9]{10}$/.test(trimmedForm.contact)) {
      setError("Contact number must be a 10-digit number");
      setLoading(false);
      return;
    }
    if (
      trimmedForm.alternateContact &&
      !/^[0-9]{10}$/.test(trimmedForm.alternateContact)
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
    // Validate required fields
    if (
      !trimmedForm.name ||
      !trimmedForm.email ||
      !trimmedForm.password ||
      !trimmedForm.contact ||
      !trimmedForm.address ||
      !trimmedForm.joiningYear
    ) {
      setError(
        "All required fields (name, email, password, contact, address) must be provided"
      );
      setLoading(false);
      return;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedForm.email)) {
      setError("Please provide a valid email address");
      setLoading(false);
      return;
    }
    try {
      const res = await api.post("/create/teachers", trimmedForm);
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
    <div className="max-h-[70vh] overflow-y-auto px-2 sm:px-4 md:px-8 bg-white rounded-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        {error && (
          <Alert variant="destructive" className="mb-2 border-0 bg-red-50 text-red-700">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {/* Main Info Section */}
        <div className="rounded-xl bg-neutral-50 p-3 sm:p-4 flex flex-col gap-4">
          <h3 className="text-base font-semibold text-neutral-700 mb-1 pb-1 tracking-tight">
            Personal Information
          </h3>
          <div className="flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 items-stretch">
            <div className="flex-1 min-w-0 md:min-w-[180px] flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-600">Name</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
                className="bg-neutral-100 border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm placeholder:text-neutral-400"
                placeholder="Enter full name"
              />
            </div>
            <div className="flex-1 min-w-0 md:min-w-[180px] flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-600">Contact</label>
              <Input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                required
                className="bg-neutral-100 border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm placeholder:text-neutral-400"
                placeholder="10-digit number"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 items-stretch">
            <div className="flex-1 min-w-0 md:min-w-[180px] flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-600">Alternate Contact</label>
              <Input
                name="alternateContact"
                value={form.alternateContact}
                onChange={handleChange}
                className="bg-neutral-100 border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm placeholder:text-neutral-400"
                placeholder="10-digit number (optional)"
              />
            </div>
            <div className="flex-1 min-w-0 md:min-w-[180px] flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-600">Address</label>
              <Textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="min-h-[40px] bg-neutral-100 border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm placeholder:text-neutral-400"
                placeholder="Full address"
                rows={2}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 items-stretch">
            <div className="flex-1 min-w-0 md:min-w-[180px] flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-600">Joining Year</label>
              <Input
                name="joiningYear"
                type="number"
                value={form.joiningYear}
                onChange={handleChange}
                required
                min="2000"
                max={new Date().getFullYear() + 1}
                className="bg-neutral-100 border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm placeholder:text-neutral-400"
                placeholder="YYYY"
              />
            </div>
            <div className="flex-1 min-w-0 md:min-w-[180px] flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-600">Profile Image</label>
              <Input
                name="profileImage"
                value={form.profileImage}
                onChange={handleChange}
                className="bg-neutral-100 border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm placeholder:text-neutral-400"
                placeholder="Image URL (optional)"
              />
            </div>
          </div>
        </div>
        {/* Account Section */}
        <div className="rounded-xl bg-neutral-50 p-3 sm:p-4 flex flex-col gap-4">
          <h3 className="text-base font-semibold text-neutral-700 mb-1 pb-1 tracking-tight">
            Account & Access
          </h3>
          <div className="flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 items-stretch">
            <div className="flex-1 min-w-0 md:min-w-[180px] flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-600">Email</label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-neutral-100 border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm placeholder:text-neutral-400"
                placeholder="Email address"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 items-stretch">
            <div className="flex-1 min-w-0 md:min-w-[180px] flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-600">Password</label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="pr-10 bg-neutral-100 border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm placeholder:text-neutral-400"
                placeholder="Password"
              />
            </div>
          </div>
        </div>
        <div className="mt-2 flex flex-col sm:flex-row justify-end gap-2 w-full">
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[100px] bg-primary text-white hover:bg-primary/90 rounded-lg shadow-none font-medium text-sm px-3 py-2"
          >
            {loading ? "Adding..." : "Add Teacher"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 font-medium text-sm px-3 py-2 shadow-none"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTeacher;
