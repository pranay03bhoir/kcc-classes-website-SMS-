"use client";

import { submitContactInquiry } from "@/api/contact";
import CustomHeading from "@/components/Heading/CustomHeading";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { FaClock, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaLocationArrow, FaPhone, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import * as z from "zod";

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
  subject: z.string().min(1, "Please select a subject"),
  grade: z.string().min(1, "Please select a grade"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms"),
});

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "Other",
      grade: "",
      consent: false,
    },
  });

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const onSubmit = async (data) => {
    try {
      const res = await submitContactInquiry(data);
      toast.success(
        res?.message || "Message sent successfully! We'll get back to you soon.",
      );
      reset();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to send message. Please try again.";
      toast.error(msg);
    }
  };

  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaXTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="flex justify-center items-center mb-28">
        <CustomHeading
          title="Get In Touch With Us"
          padding="py-14"
          borderColour="border-red-500"
        />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-100"
      >
        {/* Contact Info */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-1 bg-red-500 rounded-full"></span>
            Contact Information
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-red-500/10 rounded-lg">
                <FaLocationArrow className="text-xl text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-gray-300 leading-relaxed">
                  Raghuvandana Apartment, near Shishu Mandir School,
                  <br />
                  opposite Abhinav college, Kotwal nagar, Aamrai, Karjat,
                  <br />
                  Maharashtra 410201
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-red-500/10 rounded-lg">
                <FaPhone className="text-xl text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <a
                  href="tel:+919765022022"
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  +91 97650 22022
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-red-500/10 rounded-lg">
                <MdEmail className="text-xl text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <a
                  href="mailto:kccclasses.KCC@gmail.com"
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  kccclasses.KCC@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-red-500/10 rounded-lg">
                <FaClock className="text-xl text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Business Hours</h3>
                <p className="text-gray-300">
                  Monday-Friday: 9am-6pm
                  <br />
                  Saturday: 9am-5pm
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2 bg-gray-800 hover:bg-red-500 rounded-lg transition-colors duration-300"
                  aria-label={label}
                >
                  <Icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                {...register("fullName")}
                placeholder="Your name"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.fullName ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                {...register("phone")}
                type="tel"
                placeholder="Your phone number"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.phone ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <select
                {...register("subject")}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.subject ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
              >
                <option value="Other">Other</option>
                <option value="Admission">Admission</option>
                <option value="Schedule">Schedule</option>
                <option value="Fees">Fees</option>
                <option value="Curriculum">Curriculum</option>
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.subject.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <select
              {...register("grade")}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.grade ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
            >
              <option value="">Select grade/class</option>
              <optgroup label="Middle School">
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
              </optgroup>
              <optgroup label="High School">
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
              </optgroup>
              <optgroup label="Senior Secondary (Science)">
                <option value="Class 11 - Science">Class 11 - Science</option>
                <option value="Class 12 - Science">Class 12 - Science</option>
              </optgroup>
              <optgroup label="Senior Secondary (Commerce)">
                <option value="Class 11 - Commerce">Class 11 - Commerce</option>
                <option value="Class 12 - Commerce">Class 12 - Commerce</option>
              </optgroup>
            </select>
            {errors.grade && (
              <p className="mt-1 text-sm text-red-500">
                {errors.grade.message}
              </p>
            )}
          </div>

          <div>
            <textarea
              {...register("message")}
              placeholder="Tell us about your requirements or questions"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.message ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors min-h-[120px]`}
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-3">
            <input
              {...register("consent", { value: true })}
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
            />
            <label className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-red-500 hover:text-red-600 underline">
                privacy policy
              </a>{" "}
              and consent to being contacted.
            </label>
          </div>
          {errors.consent && (
            <p className="text-sm text-red-500">{errors.consent.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 hover:shadow-lg"
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </motion.div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
