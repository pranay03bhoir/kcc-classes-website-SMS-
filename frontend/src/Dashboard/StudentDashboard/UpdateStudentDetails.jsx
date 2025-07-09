"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import api from "@/utils/student-axios";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "./SideBar";

const STD_OPTIONS = [
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Science",
  "11th Commerce",
  "12th Science",
  "12th Commerce",
  "Other",
];

const UpdateStudentDetails = () => {
  const { user, isLoading, checkAuthStatus } = useStudentAuth();
  const [form, setForm] = useState({
    name: "",
    password: "",
    contact: "",
    parentsContact: [""],
    address: "",
    profileImage: "",
    currentStd: "",
  });
  const [original, setOriginal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [imgError, setImgError] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [customStd, setCustomStd] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      const initial = {
        name: user.name || "",
        password: "",
        contact: user.contact || "",
        parentsContact: user.parentsContact?.length
          ? user.parentsContact
          : [""],
        address: user.address || "",
        profileImage: user.profileImage || "",
        currentStd: user.currentStd || "",
      };
      setForm(initial);
      setOriginal(initial);
      setCustomStd("");
      setImgError(false);
      setAvatarLoaded(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "profileImage") {
      setImgError(false);
      setAvatarLoaded(false);
    }
  };

  const handleParentContactChange = (idx, value) => {
    setForm((prev) => {
      const updated = [...prev.parentsContact];
      updated[idx] = value;
      return { ...prev, parentsContact: updated };
    });
  };

  const addParentContact = () => {
    setForm((prev) => ({
      ...prev,
      parentsContact: [...prev.parentsContact, ""],
    }));
  };

  const removeParentContact = (idx) => {
    setForm((prev) => {
      const updated = prev.parentsContact.filter((_, i) => i !== idx);
      return { ...prev, parentsContact: updated.length ? updated : [""] };
    });
  };

  const handleStdChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setCustomStd("");
      setForm((prev) => ({ ...prev, currentStd: "" }));
    } else {
      setCustomStd("");
      setForm((prev) => ({ ...prev, currentStd: value }));
    }
  };

  const handleCustomStd = (e) => {
    setCustomStd(e.target.value);
    setForm((prev) => ({ ...prev, currentStd: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmUpdate = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    setMessage("");
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const res = await api.put("/update", payload);
      if (res.data.success) {
          toast.success(res.data.message || "Profile updated successfully.");
        setMessage({ type: "success", text: "Profile updated successfully." });
        checkAuthStatus();
      } else {
        setMessage({
          type: "error",
          text: res.data.message || "Update failed.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message || "An error occurred. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (original) {
      setForm({ ...original, password: "" });
      setCustomStd("");
      setImgError(false);
      setAvatarLoaded(false);
      setMessage("");
    }
  };

  // Skeleton loader for avatar and form
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-lg p-8 animate-pulse">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="size-20 rounded-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="mt-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }
  if (!user) return <div>Not authenticated.</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar student={user} />
      <main className="flex-1 flex items-center justify-center p-2 md:p-4 ml-0 md:ml-14">
        <Card className="w-full max-w-5xl rounded-xl bg-white flex flex-col md:flex-row overflow-hidden border border-gray-200">
          {/* Left column: Avatar and basic info */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 md:p-10 gap-4 border-b md:border-b-0 md:border-r border-gray-100 bg-white">
            <div className="relative group">
              <Avatar
                className={`size-24 md:size-32 mb-2 border border-gray-200 transition-transform duration-300 group-hover:scale-105 ${
                  !avatarLoaded ? "opacity-50" : ""
                }`}
              >
                <AvatarImage
                  src={form.profileImage}
                  alt={form.name}
                  onError={() => setImgError(true)}
                  onLoad={() => setAvatarLoaded(true)}
                  className="object-cover"
                />
                <AvatarFallback>{form.name?.[0] || "S"}</AvatarFallback>
              </Avatar>
              {imgError && (
                <span className="absolute left-1/2 -bottom-4 -translate-x-1/2 text-xs text-red-500">
                  Image not found
                </span>
              )}
            </div>
            <CardTitle className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-1">
              {form.name || "Update Profile"}
            </CardTitle>
            <span className="text-xs md:text-sm text-gray-400 text-center">
              Update your details
            </span>
          </div>
          {/* Right column: Form fields */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-white">
            <form
              onSubmit={handleSubmit}
              className="space-y-8 w-full max-w-2xl mx-auto"
            >
              {/* Personal Info Section */}
              <div>
                <h2 className="text-base font-medium text-gray-700 mb-3">
                  Personal Info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="mb-1 text-gray-600 text-sm"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="mt-1 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="password"
                      className="mb-1 text-gray-600 text-sm"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      placeholder="Leave blank to keep unchanged"
                      className="mt-1 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label
                      htmlFor="address"
                      className="mb-1 text-gray-600 text-sm"
                    >
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      placeholder="Your address"
                      className="mt-1 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label
                      htmlFor="profileImage"
                      className="mb-1 text-gray-600 text-sm"
                    >
                      Profile Image URL
                    </Label>
                    <Input
                      id="profileImage"
                      type="text"
                      name="profileImage"
                      value={form.profileImage}
                      onChange={handleChange}
                      placeholder="Paste image URL for your profile"
                      className="mt-1 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label
                      htmlFor="currentStd"
                      className="mb-1 text-gray-600 text-sm"
                    >
                      Current Standard
                    </Label>
                    <div className="flex flex-col md:flex-row gap-2">
                      <select
                        id="currentStd"
                        name="currentStd"
                        value={
                          STD_OPTIONS.includes(form.currentStd)
                            ? form.currentStd
                            : "Other"
                        }
                        onChange={handleStdChange}
                        className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded px-2 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
                      >
                        {STD_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {(!STD_OPTIONS.includes(form.currentStd) ||
                        customStd !== "") && (
                        <Input
                          type="text"
                          value={customStd}
                          onChange={handleCustomStd}
                          placeholder="Enter your standard"
                          className="bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
              {/* Contact Details Section */}
              <div>
                <h2 className="text-base font-medium text-gray-700 mb-3">
                  Contact Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="contact"
                      className="mb-1 text-gray-600 text-sm"
                    >
                      Contact
                    </Label>
                    <Input
                      id="contact"
                      type="text"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                      required
                      placeholder="Your contact number"
                      className="mt-1 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-600 text-sm">
                      Parent(s) Contact
                    </Label>
                    <div className="space-y-2">
                      {form.parentsContact.map((val, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            type="text"
                            value={val}
                            onChange={(e) =>
                              handleParentContactChange(idx, e.target.value)
                            }
                            required
                            placeholder={`Parent Contact #${idx + 1}`}
                            className="flex-1 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
                          />
                          {form.parentsContact.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeParentContact(idx)}
                              className="rounded-full px-3 py-1 text-xs text-white  border-none"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addParentContact}
                        className="rounded-full px-3 py-1 text-xs border-gray-200 text-gray-700 hover:bg-gray-100"
                      >
                        Add Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {message && (
                <Alert
                  variant={
                    message.type === "success" ? "default" : "destructive"
                  }
                  className={`mt-4 flex items-center gap-2 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-100 text-green-700"
                      : "bg-red-50 border border-red-100 text-red-700"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="text-green-500" size={20} />
                  ) : (
                    <AlertTriangle className="text-red-500" size={20} />
                  )}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-row justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="py-2 text-base font-medium rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 min-w-[100px]"
                  onClick={handleReset}
                  disabled={submitting}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="py-2 text-base font-medium rounded-full bg-gray-800 hover:bg-gray-900 text-white transition min-w-[120px] border-none"
                  disabled={submitting}
                >
                  {submitting ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </main>
      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmUpdate}
        title="Confirm Update"
        description="Are you sure you want to update your profile details?"
        confirmText="Yes, update"
        cancelText="Cancel"
        variant="default"
      />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default UpdateStudentDetails;
