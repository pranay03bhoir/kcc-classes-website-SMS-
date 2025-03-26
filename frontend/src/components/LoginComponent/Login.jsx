"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
// import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleRememberMeCheckBox = () => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: !prev.rememberMe,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const myURL = "http://localhost:5000/api/students/login";
      const response = await axios.post(myURL, formData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(response.data.message || "Login successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
    console.log(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200">
      <Card className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md relative z-10">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4">
            Welcome back
          </h2>
          <p className="text-center text-gray-500 mb-2">
            Sign in with your email
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox
                  name="rememberMe"
                  onChange={handleChange}
                  onCheckedChange={handleRememberMeCheckBox}
                />
                <label className="text-gray-600">Keep me signed in</label>
              </div>
              <a href="#" className="text-blue-600">
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg"
            >
              Sign In
              <ToastContainer position={`top-center`} />
            </Button>
          </form>
        </CardContent>
      </Card>
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center rounded-l-2xl"
        style={{ backgroundImage: "url('/path-to-your-background-image.jpg')" }}
      ></div>
    </div>
  );
}
