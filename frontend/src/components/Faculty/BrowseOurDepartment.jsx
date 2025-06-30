"use client";
import Departments from "@/components/Faculty/Departments";
import CustomHeading from "@/components/Heading/CustomHeading";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { FaChartLine, FaFlask, FaGraduationCap } from "react-icons/fa";

const BrowseOurDepartment = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

  const departmentsData = [
    {
      id: 1,
      title: "Primary Classes",
      grades: "Grades 5 to 10",
      subjects: ["Mathematics", "Science", "English"],
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      description:
        "Building strong foundations in core subjects with personalized attention",
      icon: FaGraduationCap,
      hoverColor: "hover:bg-blue-100",
    },
    {
      id: 2,
      title: "Science Stream",
      grades: "Grades 11 and 12",
      subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      description:
        "Advanced scientific education preparing students for competitive exams",
      icon: FaFlask,
      hoverColor: "hover:bg-green-100",
    },
    {
      id: 3,
      title: "Commerce Stream",
      grades: "Grades 11 and 12",
      subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics"],
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      description:
        "Comprehensive business education with practical applications",
      icon: FaChartLine,
      hoverColor: "hover:bg-purple-100",
    },
  ];

  const filteredDepartments = useMemo(() => {
    return departmentsData.filter((dept) => {
      const matchesSearch =
        dept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.subjects.some((subject) =>
          subject.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesGrade = !selectedGrade || dept.grades === selectedGrade;
      return matchesSearch && matchesGrade;
    });
  }, [searchQuery, selectedGrade]);

  const uniqueGrades = useMemo(() => {
    return [...new Set(departmentsData.map((dept) => dept.grades))];
  }, []);

  return (
    <section
      aria-labelledby="department-heading"
      className="py-12 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <CustomHeading
            title="Browse by Department"
            padding="py-14"
            borderColour="border-white"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-2xl mx-auto mb-12 space-y-4 md:pt-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search departments or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
              aria-label="Search departments"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedGrade("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  !selectedGrade
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              aria-pressed={!selectedGrade}
            >
              All Grades
            </button>
            {uniqueGrades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    selectedGrade === grade
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                aria-pressed={selectedGrade === grade}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            className="grid md:grid-cols-3 gap-8 px-4 md:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredDepartments.map((data, index) => (
              <motion.div
                key={data.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="transform transition-all duration-300"
              >
                <Departments {...data} searchQuery={searchQuery} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredDepartments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">
              No departments found matching your search criteria.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BrowseOurDepartment;
