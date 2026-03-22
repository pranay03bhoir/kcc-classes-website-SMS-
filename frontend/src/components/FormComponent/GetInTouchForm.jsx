"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitStudentRegistration } from "@/api/registration";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Save,
} from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// Common Indian cities for autocomplete
const INDIAN_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
];

// Common school names for autocomplete
const COMMON_SCHOOLS = [
  "Delhi Public School",
  "Kendriya Vidyalaya",
  "Navodaya Vidyalaya",
  "Army Public School",
  "Air Force School",
  "Sacred Heart",
  "St. Joseph's",
  "St. Xavier's",
  "Modern School",
  "Springdales",
];

const RegistrationForm = () => {
  // Form state with regular useState
  const [formData, setFormData] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("registrationForm");
      return saved
        ? JSON.parse(saved)
        : {
            firstName: "",
            lastName: "",
            dob: "",
            gender: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            pin: "",
            currentClass: "",
            school: "",
            subjects: [],
            batch: "",
            additionalInfo: "",
            agree: false,
          };
    }
    return {
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pin: "",
      currentClass: "",
      school: "",
      subjects: [],
      batch: "",
      additionalInfo: "",
      agree: false,
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [schoolSuggestions, setSchoolSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Calculate form completion percentage
  const calculateProgress = useCallback(() => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "pin",
      "currentClass",
      "school",
      "batch",
      "subjects",
    ];
    const completedFields = requiredFields.filter((field) => {
      if (field === "subjects") return formData[field].length > 0;
      return formData[field] && formData[field].trim() !== "";
    });
    return (completedFields.length / requiredFields.length) * 100;
  }, [formData]);

  const progress = calculateProgress();

  // Debounced city and school search
  const debouncedCitySearch = useDebounce((value) => {
    if (value.length > 1) {
      const filtered = INDIAN_CITIES.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase()),
      );
      setCitySuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
  }, 300);

  const debouncedSchoolSearch = useDebounce((value) => {
    if (value.length > 1) {
      const filtered = COMMON_SCHOOLS.filter((school) =>
        school.toLowerCase().includes(value.toLowerCase()),
      );
      setSchoolSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSchoolSuggestions([]);
      setShowSuggestions(false);
    }
  }, 300);

  // Save to localStorage periodically
  useEffect(() => {
    const saveToLocalStorage = () => {
      if (progress > 0) {
        localStorage.setItem("registrationForm", JSON.stringify(formData));
      }
    };

    const interval = setInterval(saveToLocalStorage, 2000); // Save every 2 seconds
    return () => clearInterval(interval);
  }, [formData, progress]);

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Please enter a valid email address";
      case "phone":
        return /^[0-9]{10}$/.test(value.replace(/\D/g, ""))
          ? ""
          : "Please enter a valid 10-digit phone number";
      case "pin":
        return /^[0-9]{6}$/.test(value)
          ? ""
          : "Please enter a valid 6-digit PIN code";
      case "firstName":
      case "lastName":
        return value.length < 2
          ? "Name must be at least 2 characters long"
          : "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const next = {
      firstName: validateField("firstName", formData.firstName) || "",
      lastName: validateField("lastName", formData.lastName) || "",
      email: validateField("email", formData.email) || "",
      phone: validateField("phone", formData.phone) || "",
      pin: validateField("pin", formData.pin) || "",
      address: !formData.address?.trim() ? "Address is required" : "",
      city: !formData.city?.trim() ? "City is required" : "",
      currentClass: !formData.currentClass?.trim()
        ? "Please select your class"
        : "",
      school: !formData.school?.trim() ? "School is required" : "",
      subjects: !formData.subjects?.length
        ? "Select at least one subject"
        : "",
      batch: !formData.batch?.trim() ? "Please select a batch" : "",
      agree: !formData.agree
        ? "You must agree to the terms and conditions"
        : "",
    };
    setErrors((prev) => ({ ...prev, ...next }));
    return !Object.values(next).some(Boolean);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Update form data first
    if (type === "checkbox") {
      if (name === "subjects") {
        setFormData((prev) => ({
          ...prev,
          subjects: checked
            ? [...prev.subjects, value]
            : prev.subjects.filter((subj) => subj !== value),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (name === "phone") {
      // Handle phone number formatting
      const cleaned = value.replace(/\D/g, "");
      const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      // Handle all other input changes
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Handle city and school autocomplete
    if (name === "city") {
      debouncedCitySearch(value);
    } else if (name === "school") {
      debouncedSchoolSearch(value);
    }

    // Validate field after update
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSuggestionClick = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setShowSuggestions(false);
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pin: "",
      currentClass: "",
      school: "",
      subjects: [],
      batch: "",
      additionalInfo: "",
      agree: false,
    });
    setErrors({});
    setCurrentStep(1);
    localStorage.removeItem("registrationForm");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await submitStudentRegistration(formData);
      toast.success(
        data?.message || "Registration successful! We'll contact you soon.",
      );
      resetForm();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({
    name,
    label,
    type = "text",
    required = true,
    maxLength,
    ...props
  }) => (
    <div className="relative">
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={`${label}${required ? "*" : ""}`}
        onChange={handleChange}
        value={formData[name]}
        maxLength={maxLength}
        className={`peer ${errors[name] ? "border-red-500" : ""}`}
        aria-invalid={errors[name] ? "true" : "false"}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <p
          id={`${name}-error`}
          className="text-red-500 text-sm mt-1"
          role="alert"
        >
          {errors[name]}
        </p>
      )}
      {name === "city" && showSuggestions && citySuggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
          {citySuggestions.map((city) => (
            <li
              key={city}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick("city", city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
      {name === "school" && showSuggestions && schoolSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
          {schoolSuggestions.map((school) => (
            <li
              key={school}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick("school", school)}
            >
              {school}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="max-w-xl w-full mx-auto px-2 sm:px-4 md:px-0">
      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 sm:mb-2 gap-1 sm:gap-0">
          <span className="text-xs sm:text-sm text-gray-600">
            Form Progress
          </span>
          <span className="text-xs sm:text-sm font-medium text-purple-600">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4 sm:mb-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden xs:inline">Previous</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={nextStep}
          disabled={currentStep === 5}
          className="flex items-center w-full sm:w-auto"
        >
          <span className="hidden xs:inline">Next</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-2 sm:p-4 md:p-6 rounded-lg shadow-lg space-y-4 sm:space-y-6"
        noValidate
      >
        {/* Form Header with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Student Registration
          </h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center w-full sm:w-auto"
            >
              {isPreviewMode ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  <span className="hidden xs:inline">Edit Mode</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="hidden xs:inline">Preview</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.setItem(
                  "registrationForm",
                  JSON.stringify(formData),
                );
                toast.success("Draft saved successfully");
              }}
              className="flex items-center w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              <span className="hidden xs:inline">Save Draft</span>
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div
          className={`space-y-4 sm:space-y-6 ${
            isPreviewMode ? "pointer-events-none opacity-75" : ""
          }`}
        >
          {/* Student Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-purple-700 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs sm:text-sm">
                  1
                </span>
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                <div className="relative">
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First Name*"
                    onChange={handleChange}
                    value={formData.firstName}
                    maxLength={50}
                    autoComplete="given-name"
                    className={`peer ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    aria-invalid={errors.firstName ? "true" : "false"}
                    aria-describedby={
                      errors.firstName ? "firstName-error" : undefined
                    }
                  />
                  {errors.firstName && (
                    <p
                      id="firstName-error"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                    >
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last Name*"
                    onChange={handleChange}
                    value={formData.lastName}
                    maxLength={50}
                    autoComplete="family-name"
                    className={`peer ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    aria-invalid={errors.lastName ? "true" : "false"}
                    aria-describedby={
                      errors.lastName ? "lastName-error" : undefined
                    }
                  />
                  {errors.lastName && (
                    <p
                      id="lastName-error"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                    >
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                <div className="relative">
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    placeholder="Date of Birth"
                    onChange={handleChange}
                    value={formData.dob}
                    max="2010-12-31"
                    className={`peer ${errors.dob ? "border-red-500" : ""}`}
                    aria-invalid={errors.dob ? "true" : "false"}
                    aria-describedby={errors.dob ? "dob-error" : undefined}
                  />
                  {errors.dob && (
                    <p
                      id="dob-error"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                    >
                      {errors.dob}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Select
                    name="gender"
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                    value={formData.gender}
                  >
                    <SelectTrigger
                      className={errors.gender ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1" role="alert">
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-purple-700 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs sm:text-sm">
                  2
                </span>
                Contact Information
              </h3>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address*"
                  onChange={handleChange}
                  value={formData.email}
                  maxLength={100}
                  autoComplete="email"
                  className={`peer ${errors.email ? "border-red-500" : ""}`}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-red-500 text-sm mt-1"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="relative">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone Number*"
                  onChange={handleChange}
                  value={formData.phone}
                  maxLength={12}
                  autoComplete="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  className={`peer ${errors.phone ? "border-red-500" : ""}`}
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p
                    id="phone-error"
                    className="text-red-500 text-sm mt-1"
                    role="alert"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
              <div className="relative">
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Address*"
                  onChange={handleChange}
                  value={formData.address}
                  maxLength={200}
                  autoComplete="street-address"
                  className={`peer ${errors.address ? "border-red-500" : ""}`}
                  aria-invalid={errors.address ? "true" : "false"}
                  aria-describedby={
                    errors.address ? "address-error" : undefined
                  }
                />
                {errors.address && (
                  <p
                    id="address-error"
                    className="text-red-500 text-sm mt-1"
                    role="alert"
                  >
                    {errors.address}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                <div className="relative">
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="City*"
                    onChange={handleChange}
                    value={formData.city}
                    maxLength={50}
                    autoComplete="address-level2"
                    className={`peer ${errors.city ? "border-red-500" : ""}`}
                    aria-invalid={errors.city ? "true" : "false"}
                    aria-describedby={errors.city ? "city-error" : undefined}
                  />
                  {errors.city && (
                    <p
                      id="city-error"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                    >
                      {errors.city}
                    </p>
                  )}
                  {showSuggestions && citySuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                      {citySuggestions.map((city) => (
                        <li
                          key={city}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSuggestionClick("city", city)}
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="pin"
                    name="pin"
                    type="text"
                    placeholder="PIN Code*"
                    onChange={handleChange}
                    value={formData.pin}
                    maxLength={6}
                    pattern="[0-9]{6}"
                    className={`peer ${errors.pin ? "border-red-500" : ""}`}
                    aria-invalid={errors.pin ? "true" : "false"}
                    aria-describedby={errors.pin ? "pin-error" : undefined}
                  />
                  {errors.pin && (
                    <p
                      id="pin-error"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                    >
                      {errors.pin}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Academic Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-purple-700 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs sm:text-sm">
                  3
                </span>
                Academic Information
              </h3>
              <div className="relative">
                <Select
                  name="currentClass"
                  onValueChange={(value) =>
                    handleSelectChange("currentClass", value)
                  }
                  value={formData.currentClass}
                >
                  <SelectTrigger
                    className={errors.currentClass ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select Class*" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 8 }, (_, i) => i + 5).map((cls) => (
                      <SelectItem key={cls} value={`Class ${cls}`}>
                        Class {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currentClass && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.currentClass}
                  </p>
                )}
              </div>
              <div className="relative">
                <Input
                  id="school"
                  name="school"
                  type="text"
                  placeholder="Current School*"
                  onChange={handleChange}
                  value={formData.school}
                  maxLength={100}
                  autoComplete="organization"
                  className={`peer ${errors.school ? "border-red-500" : ""}`}
                  aria-invalid={errors.school ? "true" : "false"}
                  aria-describedby={errors.school ? "school-error" : undefined}
                />
                {errors.school && (
                  <p
                    id="school-error"
                    className="text-red-500 text-sm mt-1"
                    role="alert"
                  >
                    {errors.school}
                  </p>
                )}
                {showSuggestions && schoolSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                    {schoolSuggestions.map((school) => (
                      <li
                        key={school}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick("school", school)}
                      >
                        {school}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Course Selection */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-purple-700 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs sm:text-sm">
                  4
                </span>
                Course Selection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                {[
                  "Mathematics",
                  "Science",
                  "Physics",
                  "Chemistry",
                  "Biology",
                  "Social Studies",
                  "English",
                  "Accountancy",
                  "Economics",
                  "Business Studies",
                ].map((subject) => (
                  <label
                    key={subject}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                  >
                    <Checkbox
                      name="subjects"
                      value={subject}
                      checked={formData.subjects.includes(subject)}
                      onCheckedChange={(checked) => {
                        setFormData((prev) => ({
                          ...prev,
                          subjects: checked
                            ? [...prev.subjects, subject]
                            : prev.subjects.filter((subj) => subj !== subject),
                        }));
                      }}
                      className={errors.subjects ? "border-red-500" : ""}
                    />
                    <span>{subject}</span>
                  </label>
                ))}
              </div>
              {errors.subjects && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.subjects}
                </p>
              )}

              <div className="relative">
                <Select
                  name="batch"
                  onValueChange={(value) => handleSelectChange("batch", value)}
                  value={formData.batch}
                >
                  <SelectTrigger
                    className={errors.batch ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select Preferred Batch*" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">
                      Morning (6 AM - 12 PM)
                    </SelectItem>
                    <SelectItem value="Afternoon">
                      Afternoon (12 PM - 5 PM)
                    </SelectItem>
                    <SelectItem value="Evening">
                      Evening (5 PM - 9 PM)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.batch && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {errors.batch}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-purple-700 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs sm:text-sm">
                  5
                </span>
                Additional Information
              </h3>
              <Textarea
                name="additionalInfo"
                placeholder="Any specific requirements or queries?"
                value={formData.additionalInfo}
                onChange={handleChange}
                className="resize-none"
                maxLength={500}
              />
              <div className="flex items-start space-x-2">
                <Checkbox
                  name="agree"
                  checked={formData.agree}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      agree: Boolean(checked),
                    }));
                    if (errors.agree) {
                      setErrors((prev) => ({ ...prev, agree: "" }));
                    }
                  }}
                  className={`mt-1 ${errors.agree ? "border-red-500" : ""}`}
                />
                <label className="text-sm">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  *
                </label>
              </div>
              {errors.agree && (
                <p className="text-red-500 text-sm" role="alert">
                  {errors.agree}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 sm:pt-6 border-t gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || isPreviewMode}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Registration →"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

RegistrationForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default RegistrationForm;
