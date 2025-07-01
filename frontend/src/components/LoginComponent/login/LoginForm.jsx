"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import apiA from "@/utils/axios";
import api from "@/utils/student-axios";
import apiT from "@/utils/teacher-axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  rememberMe: z.boolean().default(false),
});

export default function StudentLogin({ role }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [networkError, setNetworkError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const watchedEmail = watch("email");
  const watchedPassword = watch("password");

  // Auto-save email to localStorage if rememberMe is checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail && !watchedEmail) {
      setValue("email", savedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue, watchedEmail]);

  // Clear network error when user starts typing
  useEffect(() => {
    if (networkError && (watchedEmail || watchedPassword)) {
      setNetworkError("");
    }
  }, [watchedEmail, watchedPassword, networkError]);

  const onSubmit = async (data) => {
    if (isLoading) return;

    setIsLoading(true);
    setNetworkError("");
    setIsSuccess(false);

    const toastId = toast.loading("Signing you in...", {
      position: "top-center",
    });

    try {
      let response;
      const apiClient = {
        student: api,
        teacher: apiT,
        admin: apiA,
      }[role];

      if (!apiClient) {
        throw new Error("Invalid role specified");
      }

      // Add rate limiting for failed attempts
      if (attemptCount >= 5) {
        const timeToWait = Math.min(attemptCount * 30, 300); // Max 5 minutes
        throw new Error(
          `Too many failed attempts. Please wait ${timeToWait} seconds before trying again.`
        );
      }

      response = await apiClient.post(`/login/${role}`, data);

      // Save email if rememberMe is checked
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setIsSuccess(true);
      setAttemptCount(0);

      toast.update(toastId, {
        render: response.data.message || "Login successful! Redirecting...",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      const redirectMap = {
        student: "/studentdashboard",
        teacher: "/teacherDashboard",
        admin: "/admindashboard",
      };

      // Add a small delay for better UX
      setTimeout(() => {
        router.push(redirectMap[role] || "/");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);

      const errorMessage =
        err?.response?.data?.message ||
        (err.message === "Network Error"
          ? "Unable to connect to the server. Please check your internet connection and try again."
          : err.message ||
            "Login failed. Please check your credentials and try again.");

      setNetworkError(errorMessage);
      setAttemptCount((prev) => prev + 1);

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast.info("Password reset functionality coming soon!", {
      position: "top-center",
    });
  };

  const getRoleIcon = () => {
    switch (role) {
      case "student":
        return "🎓";
      case "teacher":
        return "👨‍🏫";
      case "admin":
        return "⚙️";
      default:
        return "👤";
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case "student":
        return "bg-blue-600 hover:bg-blue-700";
      case "teacher":
        return "bg-green-600 hover:bg-green-700";
      case "admin":
        return "bg-orange-600 hover:bg-orange-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case "student":
        return "Student";
      case "teacher":
        return "Teacher";
      case "admin":
        return "Administrator";
      default:
        return "User";
    }
  };

  const getRoleImage = () => {
    switch (role) {
      case "student":
        return "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      case "teacher":
        return "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
      case "admin":
        return "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
      default:
        return "https://images.unsplash.com/photo-1523240797355-3516d9a73c75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getRoleImage()}
            alt={`${getRoleTitle()} Login`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content overlay on image */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-light mb-4">Welcome to KCC Classes</h1>
            <p className="text-lg text-white/80 max-w-sm leading-relaxed">
              Sign in to access your {getRoleTitle().toLowerCase()} dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block text-center mb-12">
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {networkError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <FiAlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  {networkError}
                </AlertDescription>
              </Alert>
            )}

            {isSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <FiCheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Login successful! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={`h-12 border border-gray-300 focus:border-gray-900 focus:ring-0 transition-colors ${
                    errors.email ? "border-red-300" : ""
                  }`}
                  disabled={isLoading}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`h-12 pr-12 border border-gray-300 focus:border-gray-900 focus:ring-0 transition-colors ${
                      errors.password ? "border-red-300" : ""
                    }`}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    {...register("rememberMe")}
                    className="border-gray-300 text-gray-900 focus:ring-gray-900"
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !isValid || !isDirty}
                className={`w-full h-12 ${getRoleColor()} text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href={`/register/${role}-register`}
                  className="text-gray-900 hover:underline font-medium"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-lg shadow-lg"
      />
    </div>
  );
}
