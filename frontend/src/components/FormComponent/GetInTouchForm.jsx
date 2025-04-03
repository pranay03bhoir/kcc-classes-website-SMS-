"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      if (type === "checkbox" && name === "subjects") {
        return {
          ...prev,
          subjects: checked
            ? [...prev.subjects, value]
            : prev.subjects.filter((subj) => subj !== value),
        };
      }
      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">Registration Form</h2>

      {/* Student Information */}
      <div>
        <h3 className="text-lg font-semibold text-purple-700">
          1️⃣ Student Information
        </h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Input
            name="firstName"
            placeholder="First Name*"
            onChange={handleChange}
          />
          <Input
            name="lastName"
            placeholder="Last Name*"
            onChange={handleChange}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <Input
            type="date"
            name="dob"
            placeholder="Date of birth"
            onChange={handleChange}
            className={`flex justify-center items-center md:justify-start`}
          />
          <Select
            name="gender"
            onValueChange={(value) =>
              setFormData({ ...formData, gender: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-purple-700">
          2️⃣ Contact Information
        </h3>
        <Input
          type="email"
          name="email"
          placeholder="Email Address*"
          onChange={handleChange}
        />
        <Input
          type="tel"
          name="phone"
          placeholder="Phone Number*"
          className="mt-2"
          onChange={handleChange}
        />
        <Input
          type="text"
          name="address"
          placeholder="Address*"
          className="mt-2"
          onChange={handleChange}
        />
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Input
            type="text"
            name="city"
            placeholder="City*"
            onChange={handleChange}
          />
          <Input
            type="text"
            name="pin"
            placeholder="PIN Code*"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Academic Information */}
      <div>
        <h3 className="text-lg font-semibold text-purple-700">
          3️⃣ Academic Information
        </h3>
        <Select
          name="currentClass"
          onValueChange={(value) =>
            setFormData({ ...formData, currentClass: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 8 }, (_, i) => i + 5).map((cls) => (
              <SelectItem
                key={cls}
                value={`Class ${cls}`}
              >{`Class ${cls}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          name="school"
          placeholder="Current School*"
          className="mt-2"
          onChange={handleChange}
        />
      </div>

      {/* Course Selection */}
      <div>
        <h3 className="text-lg font-semibold text-purple-700">
          4️⃣ Course Selection
        </h3>
        <div className="grid grid-cols-2 gap-2">
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
            <label key={subject} className="flex items-center">
              <Checkbox
                name="subjects"
                value={subject}
                className="mr-2"
                onChange={handleChange}
              />{" "}
              {subject}
            </label>
          ))}
        </div>
        <div className={`pt-7`}>
          <Select
            name="batch"
            className="mt-10 "
            onValueChange={(value) =>
              setFormData({ ...formData, batch: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Preferred Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
              <SelectItem value="Evening">Evening</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-semibold text-purple-700">
          5️⃣ Additional Information
        </h3>
        <Textarea
          name="additionalInfo"
          placeholder="Any specific requirements or queries?"
          className="mt-2"
          onChange={handleChange}
        />
      </div>

      {/* Terms and Submit */}
      <div className="flex items-center">
        <Checkbox name="agree" onChange={handleChange} className="mr-2" />
        <span>
          I agree to the{" "}
          <a href="#" className="text-blue-600 underline">
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 underline">
            Privacy Policy
          </a>
          *
        </span>
      </div>

      <Button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
        Submit Registration →
      </Button>
    </form>
  );
};

export default RegistrationForm;
