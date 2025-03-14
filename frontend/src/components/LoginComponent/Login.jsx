"use client";
import { useState } from "react";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    let valid = true;
    let newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Logging in with:", { email, password, role });
      // Perform login request or redirect
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center">
          EduAccess Login
        </h2>
        <p className="text-gray-400 text-center mb-4">
          Access your personalized learning dashboard
        </p>

        {/* Toggle Button */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l-lg text-white ${
              role === "student" ? "bg-blue-600" : "bg-gray-600"
            }`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg text-white ${
              role === "teacher" ? "bg-green-600" : "bg-gray-600"
            }`}
            onClick={() => setRole("teacher")}
          >
            Teacher
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="mb-2">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center text-gray-400 text-sm mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="hover:underline">
              Forgot your password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            Sign in
          </button>
        </form>

        {/* Register Link */}
        <p className="text-gray-400 text-center mt-4">
          New student?{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Register here
          </a>
        </p>

        {/* Social Login */}
        <div className="flex justify-center gap-4 mt-4">
          <button className="text-gray-400 text-xl">
            <FaFacebook />
          </button>
          <button className="text-gray-400 text-xl">
            <FaGoogle />
          </button>
          <button className="text-gray-400 text-xl">
            <FaApple />
          </button>
        </div>

        <p className="text-gray-500 text-xs text-center mt-4">
          Secure login protected by 256-bit encryption.
        </p>
      </div>
    </div>
  );
}
