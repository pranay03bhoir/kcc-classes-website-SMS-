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

export default function StudentRegister() {
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
          "Enter a valid 10-digit parent's contact number";
    }

    if (currentStep === 3) {
      if (!formData.admissionYear.match(/^\d{4}$/))
        newErrors.admissionYear = "Enter a valid year";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.agree) newErrors.agree = "You must agree to the terms";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    if (!validateStep(step)) return;
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
    const toastId = toast.loading("Registering...");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/student/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.update(toastId, {
        render: response.data.message || "Registered successfully.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      if (response) {
        router.push("/login/student");
      }
    } catch (error) {
      console.error("API Request Failed:", error);
      toast.update(toastId, {
        render: error.response?.data?.message || "Registration failed.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const steps = [
    [
      <div key="step1" className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <Input
            name="name"
            placeholder="Enter your full name"
            onChange={handleChange}
            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>,
    ],
    [
      <div key="step2" className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <Input
            type="password"
            name="password"
            placeholder="Create a password"
            onChange={handleChange}
            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
            minLength={8}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            onChange={handleChange}
            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
            minLength={8}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>,
    ],
    [
      <div key="step3" className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number
          </label>
          <Input
            type="tel"
            name="contact"
            placeholder="Enter your contact number"
            onChange={handleChange}
            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
            pattern="\d{10}"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent's Contact
          </label>
          <Input
            type="tel"
            name="parentsContact"
            placeholder="Enter parent's contact number"
            onChange={handleChange}
            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
            pattern="\d{10}"
          />
          {errors.parentsContact && (
            <p className="text-red-500 text-sm mt-1">{errors.parentsContact}</p>
          )}
        </div>
      </div>,
    ],
    [
      <div key="step4" className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admission Year
          </label>
          <Input
            type="number"
            name="admissionYear"
            placeholder="Enter admission year (e.g., 2024)"
            onChange={handleChange}
            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
            pattern="\d{4}"
          />
          {errors.admissionYear && (
            <p className="text-red-500 text-sm mt-1">{errors.admissionYear}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <Textarea
            name="address"
            placeholder="Enter your complete address"
            onChange={handleChange}
            className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
            required
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
        <div className="flex items-start space-x-3 pt-2">
          <Checkbox
            name="agree"
            onChange={handleChange}
            onCheckedChange={handleCheckboxChange}
            className="mt-1"
          />
          <label className="text-sm text-gray-600 leading-relaxed">
            I agree to the{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Terms of Service
            </a>
            ,{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Privacy Policy
            </a>
            , and acknowledge the fee structure.
          </label>
        </div>
        {errors.agree && <p className="text-red-500 text-sm">{errors.agree}</p>}
      </div>,
    ],
  ];

  const stepTitles = [
    "Personal Information",
    "Account Security",
    "Contact Details",
    "Additional Information",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Student Registration
              </h1>
              <p className="text-gray-600">
                Step {step + 1} of {steps.length}: {stepTitles[step]}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= step
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {steps[step]}
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {step > 0 && (
                  <Button
                    type="button"
                    onClick={handlePrev}
                    variant="outline"
                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </Button>
                )}
                {step < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white ml-auto"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login/student"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <ToastContainer
        position="top-center"
        toastClassName="rounded-lg shadow-lg"
        progressClassName="bg-blue-600"
      />
    </div>
  );
}
