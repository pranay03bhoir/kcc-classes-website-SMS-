"use client";

import { getPublicFaculty } from "@/api/faculty";
import CustomHeading from "@/components/Heading/CustomHeading";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

function avatarUrl(name, image) {
  const trimmed = typeof image === "string" ? image.trim() : "";
  if (trimmed) return trimmed;
  const q = encodeURIComponent(name || "Faculty");
  return `https://ui-avatars.com/api/?name=${q}&size=128&background=fef2f2&color=b91c1c`;
}

const OurFaculty = () => {
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getPublicFaculty();
        if (!cancelled) {
          setFacultyMembers(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.data?.message ||
              "Could not load faculty. Please try again later.",
          );
          setFacultyMembers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4 bg-white">
      {/* Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex items-center justify-center w-full mb-10"
      >
        <CustomHeading
          title="Meet Our Faculty"
          padding="py-8"
          borderColour="border-red-600 rounded-full"
        />
      </motion.div>

      {loading && (
        <p className="text-center text-gray-500 py-12">Loading faculty…</p>
      )}

      {error && !loading && (
        <p className="text-center text-red-600 py-8 max-w-md mx-auto">
          {error}
        </p>
      )}

      {!loading && !error && facultyMembers.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          No faculty profiles are available yet. Please check back soon.
        </p>
      )}

      {/* Faculty Cards Grid */}
      {!loading && facultyMembers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:pt-12">
          {facultyMembers.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-white border border-gray-200 rounded-lg flex flex-col items-center p-6 min-h-[370px]"
            >
              <img
                src={avatarUrl(faculty.name, faculty.image)}
                alt={`${faculty.name} - ${faculty.subject} teacher`}
                className="w-24 h-24 object-cover rounded-full mb-4 border border-gray-200"
              />

              <div className="text-center w-full">
                <FaChalkboardTeacher className="text-xl text-red-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {faculty.name}
                </h3>
                <p className="text-gray-500 text-xs mb-2">
                  {faculty.description}
                </p>

                <ul className="text-xs text-gray-400 mb-2 space-y-1">
                  {(faculty.achievements || []).map((achievement, idx) => (
                    <li key={idx} className="flex items-center justify-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2 shrink-0" />
                      <span className="text-left">{achievement}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-center space-x-3 mt-2">
                  {faculty.social?.linkedin ? (
                    <a
                      href={faculty.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-red-600"
                    >
                      <FaLinkedin className="w-4 h-4" />
                    </a>
                  ) : null}
                  {faculty.social?.twitter ? (
                    <a
                      href={faculty.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-red-600"
                    >
                      <FaTwitter className="w-4 h-4" />
                    </a>
                  ) : null}
                  {faculty.social?.email ? (
                    <a
                      href={`mailto:${faculty.social.email}`}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <FaEnvelope className="w-4 h-4" />
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">
                {faculty.subject}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CTA Button */}
      <div className="pt-12 w-full flex justify-center items-center text-center">
        <Button
          variant="outline"
          className="rounded-full h-11 px-6 border-red-600 text-red-700 font-medium text-base shadow-none hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
          onClick={() => (window.location.href = "/faculty")}
        >
          Meet our full faculty
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
};

export default OurFaculty;
