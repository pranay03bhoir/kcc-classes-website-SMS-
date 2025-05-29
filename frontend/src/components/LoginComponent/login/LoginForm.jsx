"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
// import { motion } from "framer-motion";
import apiA from "@/utils/axios";
import api from "@/utils/student-axios";
import apiT from "@/utils/teacher-axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
export default function StudentLogin({ role }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [useData, setUserData] = useState("");
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
    const toastId = toast.loading("Logging in...");
    let response;

    try {
      if (role === "student") {
        response = await api.post(`/login/${role}`, formData);
      } else if (role === "teacher") {
        response = await apiT.post(`/login/${role}`, formData);
      } else {
        response = await apiA.post(`/login/${role}`, formData);
      }

      const data = response.data;
      setUserData(data);

      toast.update(toastId, {
        render: data.message || "Login successful",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Dynamic dashboard redirection
      const redirectMap = {
        student: "/studentdashboard",
        teacher: "/teacherDashboard/students",
        admin: "/admindashboard",
      };

      router.push(redirectMap[role] || "/");
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: err?.response?.data?.message || "Login failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }

    // console.log(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200">
      <Card className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md relative z-10">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4">
            WELCOME BACK {role.toUpperCase()}
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
        className="absolute right-0 top-0 bottom-0 w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      ></div>
    </div>
  );
}
