"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { PasswordInput } from "@/components/ui/password-input";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function RegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    parentsContact: "",
    address: "",
    admissionYear: "",
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
      if (!formData.parentsContact.match(/^\d{10}$/))
        newErrors.parentsContact =
          "Enter a valid 10-digit parent’s contact number";
    }

    if (currentStep === 3) {
      if (!formData.admissionYear.match(/^\d{4}$/))
        newErrors.admissionYear = "Enter a valid year";
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
        "http://localhost:5000/api/students/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        },
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
        key="parentsContact"
        type="tel"
        name="parentsContact"
        placeholder="Parent's Contact"
        onChange={handleChange}
        required
        pattern="\d{10}"
      />,
      errors.parentsContact && (
        <p key="parentsContact-error" className="text-red-500 text-sm">
          {errors.parentsContact}
        </p>
      ),
    ],
    [
      <Input
        key="admissionYear"
        type="number"
        name="admissionYear"
        placeholder="Admission Year"
        onChange={handleChange}
        required
        pattern="\d{4}"
      />,
      errors.admissionYear && (
        <p key="admissionYear-error" className="text-red-500 text-sm">
          {errors.admissionYear}
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
            Terms, Privacy Policy
          </a>
          , and Fees.
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
      <Card className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
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
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
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
    </div>
  );
}
