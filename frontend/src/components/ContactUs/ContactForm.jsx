"use client";

import { useState, useRef } from "react";
import { FaClock, FaFacebook, FaInstagram } from "react-icons/fa";
import { FaLocationArrow, FaPhone, FaXTwitter } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import CustomHeading from "@/components/Heading/CustomHeading";
import { MdEmail } from "react-icons/md";
import { motion, useInView } from "framer-motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "Other",
    grade: "Select Grade/Class",
    message: "",
    consent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Form submitted successfully!");
    // Here you can send formData to your backend API
  };

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div>
      <div className={`flex justify-center items-center`}>
        <CustomHeading
          title={`Get In Touch With Us`}
          padding={`py-14`}
          borderColour={`border-white`}
        />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-md rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Contact Info */}
        <div className="bg-gray-900 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <p className="mb-2">
            <strong className="flex gap-3 items-center">
              <FaLocationArrow className={`text-xl`} /> Address:
            </strong>
            Raghuvandana Apartment, near Shishu Mandir School,
            <br />
            opposite Abhinav college, Kotwal nagar, Aamrai, Karjat,
            <br />
            Maharashtra 410201
          </p>
          <p className="mb-2">
            <strong className="flex gap-3 items-center">
              <FaPhone /> Phone:
            </strong>
            +91 97650 22022
          </p>
          <p className="mb-2">
            <strong className="flex gap-3 items-center">
              <MdEmail /> Email:
            </strong>
            kccclasses.KCC@gmail.com
          </p>
          <p className="mb-4">
            <strong className="flex gap-3 items-center">
              <FaClock /> Business Hours:
            </strong>
            Monday-Friday: 9am-6pm
            <br />
            Saturday: 9am-5pm
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <h1>Connect With US</h1>
            </div>
            <div className="flex flex-row gap-4">
              <a href="#">
                <FaFacebook className={`text-2xl`} />
              </a>
              <a href="#">
                <FaXTwitter className={`text-2xl`} />
              </a>
              <a href="#">
                <FaInstagram className={`text-2xl`} />
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Your name"
              value={formData.fullName}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="tel"
              name="phone"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="Other">Other</option>
              <option value="Admission">Admission</option>
              <option value="Schedule">Schedule</option>
            </select>
          </div>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option defaultValue={`Select grade/class`}>
              Select grade/class
            </option>

            <optgroup label="Middle School">
              <option>Class 5</option>
              <option>Class 6</option>
              <option>Class 7</option>
              <option>Class 8</option>
            </optgroup>

            <optgroup label="High School">
              <option>Class 9</option>
              <option>Class 10</option>
            </optgroup>

            <optgroup label="Senior Secondary (Science)">
              <option>Class 11 - Science</option>
              <option>Class 12 - Science</option>
            </optgroup>

            <optgroup label="Senior Secondary (Commerce)">
              <option>Class 11 - Commerce</option>
              <option>Class 12 - Commerce</option>
            </optgroup>
          </select>
          <textarea
            name="message"
            placeholder="Tell us about your requirements or questions"
            value={formData.message}
            onChange={handleChange}
            className="border rounded p-2 w-full h-32"
          ></textarea>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1"
              required
            />
            <span>
              I agree to the{" "}
              <a href="#" className="text-blue-600 underline">
                privacy policy
              </a>{" "}
              and consent to being contacted.
            </span>
          </label>
          <button
            type="submit"
            className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700"
          >
            Submit Inquiry
          </button>
          <ToastContainer position={`top-center`} />
        </form>
      </motion.div>
    </div>
  );
}
