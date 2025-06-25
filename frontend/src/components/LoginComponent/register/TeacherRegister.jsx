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
          "Enter a valid 10-digit parent's contact number";
    }

    if (currentStep === 3) {
      if (!formData.joiningYear.match(/^\d{4}$/))
        newErrors.joiningYear = "Enter a valid year";
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

    // Create a copy of formData without confirmPassword and agree fields
    const { confirmPassword, agree, ...submitData } = formData;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AXIOS_TEACHER_URL}/register`,
        submitData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(response.data.message || "Registered successfully.");
      if (response) {
        router.push("/login/teacher");
      }
    } catch (error) {
      console.error("API Request Failed:", error);
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  const steps = [
    [
      <div key="name-field" className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <Input
          name="name"
          placeholder="Enter your full name"
          onChange={handleChange}
          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
      </div>,
      <div key="email-field" className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
      </div>,
    ],
    [
      <div key="password-field" className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <Input
          type="password"
          name="password"
          placeholder="Create a password"
          onChange={handleChange}
          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
          minLength={8}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}
      </div>,
      <div key="confirmPassword-field" className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          onChange={handleChange}
          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
          minLength={8}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
        )}
      </div>,
    ],
    [
      <div key="contact-field" className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Contact Number
        </label>
        <Input
          type="tel"
          name="contact"
          placeholder="Enter your contact number"
          onChange={handleChange}
          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
          pattern="\d{10}"
        />
        {errors.contact && (
          <p className="text-red-500 text-xs">{errors.contact}</p>
        )}
      </div>,
      <div key="alternateContact-field" className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Alternate Contact
        </label>
        <Input
          type="tel"
          name="alternateContact"
          placeholder="Enter alternate contact"
          onChange={handleChange}
          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
          pattern="\d{10}"
        />
        {errors.alternateContact && (
          <p className="text-red-500 text-xs">{errors.alternateContact}</p>
        )}
      </div>,
    ],
    [
      <div key="joiningYear-field" className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Joining Year
        </label>
        <Input
          type="number"
          name="joiningYear"
          placeholder="Enter joining year (e.g., 2024)"
          onChange={handleChange}
          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
          pattern="\d{4}"
        />
        {errors.joiningYear && (
          <p className="text-red-500 text-xs">{errors.joiningYear}</p>
        )}
      </div>,
      <div key="address-field" className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <Textarea
          name="address"
          placeholder="Enter your complete address"
          onChange={handleChange}
          className="min-h-[80px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {errors.address && (
          <p className="text-red-500 text-xs">{errors.address}</p>
        )}
      </div>,
      <div key="checkbox" className="flex items-start space-x-3 pt-2">
        <Checkbox
          name="agree"
          onChange={handleChange}
          onCheckedChange={handleCheckboxChange}
          className="mt-1"
        />
        <label className="text-sm text-gray-600 leading-relaxed">
          I agree to the{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800 underline">
            Privacy Policy
          </a>
        </label>
      </div>,
      errors.agree && (
        <p key="agree-error" className="text-red-500 text-xs">
          {errors.agree}
        </p>
      ),
    ],
  ];

  const stepTitles = [
    "Personal Information",
    "Account Security",
    "Contact Details",
    "Additional Information",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index <= step ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                    index <= step
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-400 border-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                {index < stepTitles.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      index < step ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            {stepTitles[step]}
          </h3>
        </div>

        {/* Form Card */}
        <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Teacher Registration
              </h1>
              <p className="text-gray-600">
                Join our teaching community in just a few steps
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {steps[step].map((field) => field)}
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
                    ← Previous
                  </Button>
                )}
                {step < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white ml-auto"
                  >
                    Next →
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white ml-auto"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
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
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default TeacherRegister;
