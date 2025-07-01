"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import {
  getTeacherDetails,
  resendVerificationEmail,
  updateTeacherDetails,
} from "@/utils/teacher-axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calendar, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as z from "zod";
import Sidebar from "./SideBar";

const initialState = {
  name: "",
  email: "",
  contact: "",
  alternateContact: "",
  address: "",
  profileImage: "",
};

const initialPasswordState = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// Validation schema
const teacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  contact: z.string().min(8, "Contact must be at least 8 digits"),
  alternateContact: z
    .string()
    .min(8, "Alternate contact must be at least 8 digits"),
  address: z.string().min(2, "Address is required"),
  profileImage: z.string().optional(),
});

export default function TeacherDetailsUpdate() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user: teacher, isLoading: authLoading } = useTeacherAuth();
  const [passwordFields, setPasswordFields] = useState(initialPasswordState);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [isEmailDisabled, setIsEmailDisabled] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const formHook = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: initialState,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getTeacherDetails();
        if (res.data && res.data.teacher) {
          setForm(res.data.teacher);
          formHook.reset({
            ...res.data.teacher,
          });
        }
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch teacher details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [formHook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    formHook.reset({ ...form, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccordionChange = (value) => {
    setShowPasswordSection(value.includes("password-section"));
    if (!value.includes("password-section")) {
      setPasswordFields(initialPasswordState);
    }
  };

  const handleFormSubmit = (data) => {
    setPendingFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    setShowConfirmModal(false);
    if (pendingFormData) {
      await handleSubmit(pendingFormData);
      setPendingFormData(null);
    }
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const payload = { ...data };

      // Password logic
      if (showPasswordSection) {
        if (
          !passwordFields.oldPassword ||
          !passwordFields.newPassword ||
          !passwordFields.confirmPassword
        ) {
          setError("Please fill all password fields.");
          setLoading(false);
          return;
        }
        if (passwordFields.newPassword !== passwordFields.confirmPassword) {
          setError("New password and confirm password do not match.");
          setLoading(false);
          return;
        }
        // Include both password and oldPassword in the payload for backend validation
        payload.password = passwordFields.newPassword;
        payload.oldPassword = passwordFields.oldPassword;
      }
      const res = await updateTeacherDetails(payload);
      setSuccess(res.data?.message || "Details updated successfully.");
      setForm({ ...form, ...payload });
      formHook.reset({ ...form, password: "" });
      setPasswordFields(initialPasswordState);
      setShowPasswordSection(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update details.");
    } finally {
      setLoading(false);
    }
  };

  const resendVerficationEmail = async () => {
    try {
      // Assuming you have an API endpoint to resend the verification email
      const response = await resendVerificationEmail({ email: form.email });
      if (!response.data.success) {
        return setError(
          response.data.message || "Failed to resend verification email."
        );
      }
      // If successful, update the state to show success message
      if (response.data.success) {
        setSuccess(
          response.data.message || "Verification email sent successfully."
        );
        setError("");
        console.log("Verification email sent successfully.");
        return;
      }
      // If the email is already verified, show a success message
        if (form.isVerified) {
          setSuccess("Your email is already verified.");
          setError("");
          console.log("Your email is already verified.");
          return;
        }
    } catch (error) {
      console.log("Error resending verification email:", error);
      setError("Failed to resend verification email.");
    }
  };

  return (
    <div className="flex md:ms-16">
      <Sidebar teacher={teacher} />
      <div className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <ToastContainer
          position="top-right"
          toastStyle={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        />
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3 sm:mb-4"
            >
              <User className="text-white text-lg sm:text-2xl" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Teacher Account Settings
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-4 sm:px-0 max-w-2xl mx-auto">
              Update your personal details and password. Keep your profile up to
              date for a better experience.
            </p>
          </div>
        </motion.div>
        {/* Summary Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Profile Overview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <User className="text-2xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">1</div>
                    <div className="text-xs opacity-80">Active Profile</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Profile Overview</h3>
                <p className="text-sm opacity-90">
                  Manage your personal information and account settings
                </p>
                <div className="mt-4 flex items-center text-xs opacity-80">
                  <Calendar className="mr-1" />
                  Last updated:{" "}
                  {form.updatedAt
                    ? new Date(form.updatedAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </div>
              </div>
            </motion.div>
            {/* Security Status Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                {form.isVerified ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Lock className="text-2xl" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">✓</div>
                        <div className="text-xs opacity-80">Secure</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Security Status
                    </h3>
                    <p className="text-sm opacity-90">
                      Your account is protected with strong security measures
                    </p>
                    <div className="mt-4 flex items-center text-xs opacity-80">
                      <Mail className="mr-1" />
                      Email verified and account active
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg p-4 text-center animate-pulse">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold">
                        Account Not Verified
                      </span>
                    </div>
                    <div className="text-xs mb-3">
                      Your email address has not been verified yet. Please check
                      your inbox (and spam folder) for a verification link.
                      <br />
                      If you did not receive the email, you can resend the
                      verification link below.
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-yellow-400 text-yellow-700 hover:bg-yellow-200"
                      onClick={() => {
                        resendVerficationEmail();
                      }}
                    >
                      Resend Verification Email
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
            {/* Account Activity Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Phone className="text-2xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-xs opacity-80">Access</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Account Activity</h3>
                <p className="text-sm opacity-90">
                  Full access to all teaching features and controls
                </p>
                <div className="mt-4 flex items-center text-xs opacity-80">
                  <Calendar className="mr-1" />
                  Always available for management
                </div>
              </div>
            </motion.div>
            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <User className="text-2xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">3</div>
                    <div className="text-xs opacity-80">Actions</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                <p className="text-sm opacity-90">
                  Update profile, change password, or modify contact settings
                </p>
                <div className="mt-4 flex items-center text-xs opacity-80">
                  <Phone className="mr-1" />
                  Manage your account easily
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content - Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="xl:col-span-3"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <User className="text-white text-sm sm:text-base" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm sm:text-base">
                      Update your name, email, and password. All fields are
                      required.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Form {...formHook}>
                <form
                  onSubmit={formHook.handleSubmit(handleFormSubmit)}
                  className="relative z-10"
                >
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <FormField
                          control={formHook.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <User className="w-4 h-4 opacity-70" /> Full
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Full Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="contact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <Phone className="w-4 h-4 opacity-70" /> Contact
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Contact Number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <MapPin className="w-4 h-4 opacity-70" />{" "}
                                Address
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="profileImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <User className="w-4 h-4 opacity-70" /> Profile
                                Image URL
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Profile Image URL"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-6">
                        <FormField
                          control={formHook.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <Mail className="w-4 h-4 opacity-70" /> Email
                              </FormLabel>
                              <div className="flex items-center gap-2">
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="Email"
                                    disabled={isEmailDisabled}
                                    {...field}
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setIsEmailDisabled((prev) => !prev)
                                  }
                                  className="ml-1"
                                >
                                  {isEmailDisabled ? "Edit" : "Lock"}
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formHook.control}
                          name="alternateContact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <Phone className="w-4 h-4 opacity-70" />{" "}
                                Alternate Contact
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Alternate Contact Number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    {/* Password Accordion */}
                    <Accordion
                      type="single"
                      collapsible
                      className="mt-8"
                      onValueChange={handleAccordionChange}
                    >
                      <AccordionItem value="password-section">
                        <AccordionTrigger className="text-blue-700 font-semibold text-lg rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-4 py-3 transition-all shadow-sm">
                          <Lock className="w-5 h-5 mr-2 text-blue-400" /> Change
                          Password
                        </AccordionTrigger>
                        <AccordionContent>
                          <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 gap-6 mt-4"
                          >
                            <div className="relative">
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                Old Password
                              </label>
                              <PasswordInput
                                name="oldPassword"
                                value={passwordFields.oldPassword}
                                onChange={handlePasswordChange}
                                placeholder="Old Password"
                                className="h-12 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm"
                              />
                            </div>
                            <div className="relative">
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                New Password
                              </label>
                              <PasswordInput
                                name="newPassword"
                                value={passwordFields.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="New Password"
                                className="h-12 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm"
                              />
                              <span className="text-xs text-gray-400 mt-1 block">
                                Min 8 characters, at least 1 number
                              </span>
                            </div>
                            <div className="relative">
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                Confirm Password
                              </label>
                              <PasswordInput
                                name="confirmPassword"
                                value={passwordFields.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="Confirm Password"
                                className="h-12 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm"
                              />
                            </div>
                          </motion.div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    {/* Animated error/success messages */}
                    <div className="min-h-[28px]">
                      {success && (
                        <div className="mt-4 text-green-600 text-sm font-semibold text-center animate-fade-in-down">
                          {success}
                        </div>
                      )}
                      {error && (
                        <div className="mt-4 text-red-600 text-sm font-semibold text-center animate-fade-in-down">
                          {error}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <Separator className="my-2 relative z-10" />
                  <CardFooter className="flex justify-end bg-gradient-to-r from-blue-100/60 to-pink-100/60 dark:from-blue-900/30 dark:to-pink-900/30 rounded-b-3xl p-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto px-8 py-2 text-lg font-semibold shadow-lg bg-gradient-to-tr from-blue-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {loading && <LoadingSpinner size="sm" className="mr-2" />}
                      Update Details
                    </Button>
                  </CardFooter>
                </form>
                {/* Confirmation Modal */}
                <ConfirmationDialog
                  isOpen={showConfirmModal}
                  onClose={() => setShowConfirmModal(false)}
                  onConfirm={handleConfirmUpdate}
                  title="Confirm Update"
                  description="Are you sure you want to update your details? This action cannot be undone."
                  confirmText="Yes, Update"
                  cancelText="Cancel"
                  variant="default"
                />
              </Form>
            </Card>
          </motion.div>
          {/* Right Column - Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-3 sm:space-y-4"
          >
            {/* Security Tips Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                      <Lock className="text-white text-base" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-800">
                        Security Tips
                      </h3>
                      <p className="text-xs text-gray-600">
                        Keep your account safe
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 group/item">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Use a strong password with at least 8 characters
                        including numbers, letters, and special characters
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 group/item">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Never share your password or login credentials with
                        anyone
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 group/item">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Regularly update your password and monitor account
                        activity
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Current Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                      <User className="text-white text-base" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-800">
                        Current Info
                      </h3>
                      <p className="text-xs text-gray-600">
                        Your account details
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="group/item">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Full Name
                        </p>
                      </div>
                      <div className="p-2.5 bg-white/60 rounded-lg border border-green-200 group-hover/item:bg-white/80 transition-colors duration-200">
                        <p className="text-xs font-semibold text-gray-800 break-words">
                          {form.name}
                        </p>
                      </div>
                    </div>
                    <div className="group/item">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Email Address
                        </p>
                      </div>
                      <div className="p-2.5 bg-white/60 rounded-lg border border-green-200 group-hover/item:bg-white/80 transition-colors duration-200">
                        <p className="text-xs font-semibold text-gray-800 break-all">
                          {form.email}
                        </p>
                      </div>
                    </div>
                    <div className="group/item">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Contact
                        </p>
                      </div>
                      <div className="p-2.5 bg-white/60 rounded-lg border border-green-200 group-hover/item:bg-white/80 transition-colors duration-200">
                        <p className="text-xs font-semibold text-gray-800 break-all">
                          {form.contact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
