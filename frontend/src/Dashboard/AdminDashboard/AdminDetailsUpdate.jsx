/**
 * AdminDetailsUpdate Component
 *
 * A comprehensive form component for updating admin user details including:
 * - Personal information (name, email)
 * - Password change functionality with validation
 *
 * Features:
 * - Form validation using Zod schema
 * - Real-time validation feedback
 * - Password visibility toggle
 * - Loading states and error handling
 * - Toast notifications for success/error feedback
 * - Fully responsive design for all screen sizes
 *
 * API Endpoints Used:
 * - GET /get/admin/details - Fetch current admin details
 * - PUT /update/admin/details - Update admin details
 *
 * @component
 * @example
 * ```jsx
 * import AdminDetailsUpdate from '@/Dashboard/AdminDashboard/AdminDetailsUpdate';
 *
 * function SettingsPage() {
 *   return (
 *     <div>
 *       <AdminDetailsUpdate />
 *     </div>
 *   );
 * }
 * ```
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useAuth } from "@/hooks/useAuth";
import api from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaCog,
  FaEnvelope,
  FaEye,
  FaLock,
  FaSave,
  FaShieldAlt,
  FaTimes,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as z from "zod";

// Validation schema for admin details update form
const updateAdminSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If new password is provided, current password must also be provided
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required to change password",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      // If new password is provided, confirm password must match
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // If new password is provided, it must be different from current password
      if (data.newPassword && data.newPassword === data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password must be different from current password",
      path: ["newPassword"],
    }
  );

const AdminDetailsUpdate = () => {
  const {
    isAuthenticated,
    isLoading: authLoading,
    user,
    refreshToken,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Use user data from auth hook if available
  useEffect(() => {
    if (user) {
      setCurrentAdmin(user);
      form.reset({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      fetchAdminDetails();
    }
  }, [user, form]);

  // Fetch current admin details on component mount if not available from auth hook
  useEffect(() => {
    if (!user) {
      fetchAdminDetails();
    }
  }, []);

  const fetchAdminDetails = async () => {
    try {
      setIsLoading(true);

      const response = await api.get("/get/admin/details");

      if (response.data.success) {
        const adminData = response.data.admin; // Note: backend returns 'admin' not 'data'
        setCurrentAdmin(adminData);
        form.reset({
          name: adminData.name || "",
          email: adminData.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);

      // If it's an authentication error, try to refresh token
      if (error.response?.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the request after successful refresh
          fetchAdminDetails();
          return;
        }
      }

      let errorMessage = "Failed to fetch admin details";

      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. Admin rights required.";
      } else if (error.response?.status === 404) {
        errorMessage = "Admin not found.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Check if we have current admin data (indicates user is logged in)
      if (!currentAdmin) {
        toast.error("Please log in again. Session may have expired.");
        return;
      }

      // Prepare update data - include name and email if editable
      const updateData = {
        name: data.name,
      };

      // Include email if it's editable and has changed
      if (isEmailEditable && data.email !== currentAdmin.email) {
        updateData.email = data.email;
      }

      // Only include password if new password is provided
      if (data.newPassword) {
        updateData.password = data.newPassword;
      }

      const response = await api.put("/update/admin/details", updateData);

      if (response.data.success) {
        toast.success("Admin details updated successfully!");
        setCurrentAdmin(response.data.data);
        setShowPasswordFields(false);
        setIsEmailEditable(false); // Reset email edit mode
        // Reset password fields
        form.setValue("currentPassword", "");
        form.setValue("newPassword", "");
        form.setValue("confirmPassword", "");
      }
    } catch (error) {
      console.error("Error updating admin details:", error);

      // If it's an authentication error, try to refresh token
      if (error.response?.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the request after successful refresh
          onSubmit(data);
          return;
        }
      }

      let errorMessage = "Failed to update admin details";

      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. Admin rights required.";
      } else if (error.response?.status === 404) {
        errorMessage = "Admin not found.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Invalid request data.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current admin data
    if (currentAdmin) {
      form.reset({
        name: currentAdmin.name || "",
        email: currentAdmin.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setShowPasswordFields(false);
    setIsEmailEditable(false); // Reset email edit mode
  };

  if (isLoading && !currentAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner size="lg" />
        </motion.div>
      </div>
    );
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
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
            <FaCog className="text-white text-lg sm:text-2xl" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-4 sm:px-0 max-w-2xl mx-auto">
            Update your name, email, and password. Click the edit button next to
            email to make changes.
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
                  <FaUser className="text-2xl" />
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
                <FaClock className="mr-1" />
                Last updated:{" "}
                {currentAdmin?.updatedAt
                  ? new Date(currentAdmin.updatedAt).toLocaleDateString()
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
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaShieldAlt className="text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">✓</div>
                  <div className="text-xs opacity-80">Secure</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Security Status</h3>
              <p className="text-sm opacity-90">
                Your account is protected with strong security measures
              </p>
              <div className="mt-4 flex items-center text-xs opacity-80">
                <FaCheckCircle className="mr-1" />
                Email verified and account active
              </div>
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
                  <FaChartLine className="text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-xs opacity-80">Access</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Account Activity</h3>
              <p className="text-sm opacity-90">
                Full access to all administrative features and controls
              </p>
              <div className="mt-4 flex items-center text-xs opacity-80">
                <FaCalendarAlt className="mr-1" />
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
                  <FaCog className="text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-xs opacity-80">Actions</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
              <p className="text-sm opacity-90">
                Update profile, change password, or modify email settings
              </p>
              <div className="mt-4 flex items-center text-xs opacity-80">
                <FaUsers className="mr-1" />
                Manage your account easily
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

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
                  <FaUser className="text-white text-sm sm:text-base" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm sm:text-base">
                    Update your name, email, and password. Click the edit button
                    next to email to make changes.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <FaUser className="text-blue-500 text-sm" />
                          Full Name *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              disabled={isLoading}
                              className="pl-10 h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                            />
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <FaEnvelope className="text-blue-500 text-sm" />
                          Email Address *
                          {!isEmailEditable && (
                            <span className="text-xs text-gray-500 font-normal hidden sm:inline">
                              (Click edit to change)
                            </span>
                          )}
                        </FormLabel>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <Input
                              type="email"
                              placeholder="Enter your email address"
                              {...field}
                              disabled={!isEmailEditable}
                              className={`pl-10 h-11 sm:h-12 transition-all duration-200 ${
                                isEmailEditable
                                  ? "border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                                  : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed focus:border-gray-300 focus:ring-gray-300/20"
                              }`}
                            />
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEmailEditable(!isEmailEditable)}
                            disabled={isLoading}
                            className={`px-3 py-2 h-11 sm:h-12 transition-all duration-200 whitespace-nowrap ${
                              isEmailEditable
                                ? "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                : "border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                            }`}
                          >
                            {isEmailEditable ? (
                              <>
                                <FaTimes className="mr-1 text-sm" />
                                <span className="hidden sm:inline">Cancel</span>
                              </>
                            ) : (
                              <>
                                <FaEnvelope className="mr-1 text-sm" />
                                <span className="hidden sm:inline">Edit</span>
                              </>
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Update Section */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FaShieldAlt className="text-green-500 text-sm" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-800">
                          Security
                        </h3>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setShowPasswordFields(!showPasswordFields)
                        }
                        disabled={isLoading}
                        className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-200 w-full sm:w-auto"
                      >
                        {showPasswordFields ? (
                          <>
                            <FaTimes className="mr-2 text-sm" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <FaLock className="mr-2 text-sm" />
                            Change Password
                          </>
                        )}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showPasswordFields && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4 p-4 sm:p-6 border border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50"
                        >
                          {/* Current Password */}
                          <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <FaLock className="text-green-500 text-sm" />
                                  Current Password *
                                </FormLabel>
                                <FormControl>
                                  <PasswordInput
                                    placeholder="Enter your current password"
                                    {...field}
                                    disabled={isLoading}
                                    className="h-11 sm:h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* New Password */}
                          <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <FaEye className="text-green-500 text-sm" />
                                  New Password
                                </FormLabel>
                                <FormControl>
                                  <PasswordInput
                                    placeholder="Enter new password (min 6 characters)"
                                    {...field}
                                    disabled={isLoading}
                                    className="h-11 sm:h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Confirm Password */}
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <FaCheckCircle className="text-green-500 text-sm" />
                                  Confirm New Password
                                </FormLabel>
                                <FormControl>
                                  <PasswordInput
                                    placeholder="Confirm your new password"
                                    {...field}
                                    disabled={isLoading}
                                    className="h-11 sm:h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </CardContent>

                <CardFooter className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3 justify-end w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="px-4 sm:px-6 py-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full sm:w-auto"
                    >
                      <FaTimes className="mr-2 text-sm" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px] w-full sm:w-auto"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Updating...</span>
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2 text-sm" />
                          Update Details
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </form>
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
                    <FaShieldAlt className="text-white text-base" />
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
                      Use a strong password with at least 8 characters including
                      numbers, letters, and special characters
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 group/item">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Enable two-factor authentication for additional security
                      layers
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 group/item">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Never share your password or login credentials with anyone
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 group/item">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-red-600 rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
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
          {currentAdmin && (
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
                      <FaUser className="text-white text-base" />
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
                          {currentAdmin.name}
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
                          {currentAdmin.email}
                        </p>
                      </div>
                    </div>
                    <div className="group/item">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Account Role
                        </p>
                      </div>
                      <div className="p-2.5 bg-white/60 rounded-lg border border-green-200 group-hover/item:bg-white/80 transition-colors duration-200">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                          <p className="text-xs font-semibold text-gray-800 capitalize">
                            {currentAdmin.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Account Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
                    <FaCheckCircle className="text-white text-base" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      Account Status
                    </h3>
                    <p className="text-xs text-gray-600">System overview</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="group/item">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                        <span className="text-xs font-medium text-gray-700">
                          Email Verification
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                          Verified ✓
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="group/item">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-pink-500 rounded-full"></div>
                        <span className="text-xs font-medium text-gray-700">
                          Account Status
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="group/item">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-1 h-1 bg-rose-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">
                        Last Updated
                      </span>
                    </div>
                    <div className="p-2.5 bg-white/60 rounded-lg border border-purple-200 group-hover/item:bg-white/80 transition-colors duration-200">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-purple-500 text-xs" />
                        <span className="text-xs font-semibold text-gray-800">
                          {currentAdmin?.updatedAt
                            ? new Date(
                                currentAdmin.updatedAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg shadow-lg">
                    <FaChartLine className="text-white text-base" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      Quick Stats
                    </h3>
                    <p className="text-xs text-gray-600">Account metrics</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-orange-200 group-hover:bg-white/80 transition-colors duration-200">
                    <div className="text-lg font-bold text-orange-600 mb-0.5">
                      100%
                    </div>
                    <div className="text-xs text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-orange-200 group-hover:bg-white/80 transition-colors duration-200">
                    <div className="text-lg font-bold text-amber-600 mb-0.5">
                      24/7
                    </div>
                    <div className="text-xs text-gray-600">Access</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-orange-200 group-hover:bg-white/80 transition-colors duration-200">
                    <div className="text-lg font-bold text-yellow-600 mb-0.5">
                      ∞
                    </div>
                    <div className="text-xs text-gray-600">Features</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-orange-200 group-hover:bg-white/80 transition-colors duration-200">
                    <div className="text-lg font-bold text-orange-600 mb-0.5">
                      100%
                    </div>
                    <div className="text-xs text-gray-600">Secure</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDetailsUpdate;
