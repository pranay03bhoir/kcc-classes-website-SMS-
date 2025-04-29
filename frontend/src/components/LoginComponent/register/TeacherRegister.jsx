"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
const TeacherRegister = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    alternateContact: "",
    address: "",
    joiningYear: "",
    agree: false,
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const validateStep = (currentStep) => {
    let newErrors = {};

    if (currentStep === 0) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        newErrors.email = "Invalid email";
    }

    if (currentStep === 1) {
      if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      if (formData.confirmPassword.length < 8)
        newErrors.confirmPassword = "Password must be at least 8 characters";
      if (formData.confirmPassword.trim() !== formData.password.trim())
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (currentStep === 2) {
      if (!formData.contact.match(/^\d{10}$/))
        newErrors.contact = "Enter a valid 10-digit contact number";
      if (!formData.alternateContact.match(/^\d{10}$/))
        newErrors.alternateContact =
          "Enter a valid 10-digit parent’s contact number";
    }

    if (currentStep === 3) {
      if (!formData.joiningYear.match(/^\d{4}$/))
        newErrors.joiningYear = "Enter a valid year";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.agree) newErrors.agree = "You must agree to the terms";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Proceed only if no errors
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      agree: !prev.agree,
    }));
  };
  const handleNext = () => {
    if (!validateStep(step)) return; // Prevent navigation if validation fails
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) {
      console.error("Validation failed! Form not submitted.");
      return;
    }

    console.log("Validation passed. Submitting form...");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/teacher/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // console.log("API Response:", response.data);
      toast.success(response.data.message || "Registered successfully.");
      if (response) {
        router.push("/login");
      }
    } catch (error) {
      console.error("API Request Failed:", error);
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  const steps = [
    [
      <Input
        key="name"
        name="name"
        placeholder="Your Name"
        onChange={handleChange}
        required
      />,
      errors.name && (
        <p key="name-error" className="text-red-500 text-sm">
          {errors.name}
        </p>
      ),
      <Input
        key="email"
        type="email"
        name="email"
        placeholder="Your Email"
        onChange={handleChange}
        required
      />,
      errors.email && (
        <p key="email-error" className="text-red-500 text-sm">
          {errors.email}
        </p>
      ),
    ],
    [
      <Input
        key="password"
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
        minLength={8}
      />,
      errors.password && (
        <p key="password-error" className="text-red-500 text-sm">
          {errors.password}
        </p>
      ),
      <Input
        key="confirmPassword"
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        onChange={handleChange}
        required
        minLength={8}
      />,
      errors.confirmPassword && (
        <p key="confirmPassword-error" className="text-red-500 text-sm">
          {errors.confirmPassword}
        </p>
      ),
    ],
    [
      <Input
        key="contact"
        type="tel"
        name="contact"
        placeholder="Your Contact"
        onChange={handleChange}
        required
        pattern="\d{10}"
      />,
      errors.contact && (
        <p key="contact-error" className="text-red-500 text-sm">
          {errors.contact}
        </p>
      ),
      <Input
        key="alternateContact"
        type="tel"
        name="alternateContact"
        placeholder="Alternate Contact"
        onChange={handleChange}
        required
        pattern="\d{10}"
      />,
      errors.alternateContact && (
        <p key="alternateContact-error" className="text-red-500 text-sm">
          {errors.alternateContact}
        </p>
      ),
    ],
    [
      <Input
        key="joiningYear"
        type="number"
        name="joiningYear"
        placeholder="Joining Year"
        onChange={handleChange}
        required
        pattern="\d{4}"
      />,
      errors.joiningYear && (
        <p key="joiningYear-error" className="text-red-500 text-sm">
          {errors.joiningYear}
        </p>
      ),
      <Textarea
        key="address"
        name="address"
        placeholder="Address"
        onChange={handleChange}
        required
      />,
      errors.address && (
        <p key="address-error" className="text-red-500 text-sm">
          {errors.address}
        </p>
      ),
      <div key="checkbox" className="flex items-center space-x-2">
        <Checkbox
          name="agree"
          onChange={handleChange}
          onCheckedChange={handleCheckboxChange}
        />
        <label className="text-sm">
          I agree to the{" "}
          <a href="#" className="text-blue-600">
            Terms, Privacy Policy.
          </a>
        </label>
      </div>,
      errors.agree && (
        <p key="agree-error" className="text-red-500 text-sm">
          {errors.agree}
        </p>
      ),
    ],
  ];
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200">
      <Card className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md z-10">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4">
            Sign Up As Teacher
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              {steps[step].map((field) => field)}
            </motion.div>
            <div className="flex justify-between">
              {step > 0 && (
                <Button
                  onClick={handlePrev}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Back
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-900 text-white px-4 py-2 rounded-lg"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Submit <ToastContainer position={`top-center`} />
                </Button>
              )}
            </div>
          </form>
          <p className="text-sm text-center mt-4">
            Have an account?{" "}
            <Link href="/login" className="text-blue-600">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
      <div
        className="absolute right-0 top-0 bottom-0 w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1683121152928-787ececd7359?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      ></div>
      <ToastContainer position={`top-center`} />
    </div>
  );
};

export default TeacherRegister;
