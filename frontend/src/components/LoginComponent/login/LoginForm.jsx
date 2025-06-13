"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
// import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import apiA from "@/utils/axios";
import api from "@/utils/student-axios";
import apiT from "@/utils/teacher-axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    // ),
  rememberMe: z.boolean().default(false),
});

export default function StudentLogin({ role }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [networkError, setNetworkError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setNetworkError("");
    const toastId = toast.loading("Logging in...");

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

      response = await apiClient.post(`/login/${role}`, data);

      toast.update(toastId, {
        render: response.data.message || "Login successful",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      const redirectMap = {
        student: "/studentdashboard",
        teacher: "/teacherDashboard/students",
        admin: "/admindashboard",
      };

      router.push(redirectMap[role] || "/");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message ||
        (err.message === "Network Error"
          ? "Unable to connect to the server. Please check your internet connection."
          : "Login failed");

      setNetworkError(errorMessage);
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200">
      <Card className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md relative z-10">
        <CardContent>
          <h1 className="text-2xl font-semibold text-center mb-4">
            Welcome Back {role.charAt(0).toUpperCase() + role.slice(1)}
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Sign in to access your account
          </p>

          {networkError && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{networkError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...register("rememberMe")}
                  aria-label="Remember me"
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-gray-600 cursor-pointer"
                >
                  Keep me signed in
                </Label>
              </div>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="Forgot password"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div
        className="absolute right-0 top-0 bottom-0 w-full bg-cover bg-center opacity-50"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
        aria-hidden="true"
      />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
