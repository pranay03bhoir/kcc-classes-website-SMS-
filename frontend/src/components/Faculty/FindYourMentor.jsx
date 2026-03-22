"use client";

import { getPublicFaculty } from "@/api/faculty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function avatarUrl(name, image) {
  const trimmed = typeof image === "string" ? image.trim() : "";
  if (trimmed) return trimmed;
  const q = encodeURIComponent(name || "Faculty");
  return `https://ui-avatars.com/api/?name=${q}&size=128&background=fef2f2&color=b91c1c`;
}

const categories = [
  {
    id: 1,
    name: "Physics Experts",
    subject: "physics",
    color: "bg-blue-100 text-blue-700",
    hoverColor: "hover:bg-blue-400 hover:text-white",
  },
  {
    id: 2,
    name: "Chemistry Specialists",
    subject: "chemistry",
    color: "bg-green-100 text-green-700",
    hoverColor: "hover:bg-green-400 hover:text-white",
  },
  {
    id: 3,
    name: "Commerce Faculty",
    subject: "commerce",
    color: "bg-purple-100 text-purple-700",
    hoverColor: "hover:bg-purple-400 hover:text-white",
  },
  {
    id: 4,
    name: "Mathematics Tutors",
    subject: "math",
    color: "bg-red-100 text-red-700",
    hoverColor: "hover:bg-red-400 hover:text-white",
  },
];

const FindYourMentor = () => {
  const [mentorsData, setMentorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all subjects");
  const [selectedGrade, setSelectedGrade] = useState("all grades");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const list = await getPublicFaculty();
        if (!cancelled) {
          setMentorsData(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        if (!cancelled) {
          setFetchError(
            e.response?.data?.message ||
              "Could not load mentors. Please try again later.",
          );
          setMentorsData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredMentors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mentorsData.filter((mentor) => {
      const subjectSlugs = mentor.subjectSlugs || [];
      const gradeBands = mentor.gradeBands || [];
      const expertise = mentor.expertise || mentor.subjects || [];

      const matchesSearch =
        !q ||
        mentor.name.toLowerCase().includes(q) ||
        (Array.isArray(expertise) &&
          expertise.some((exp) => exp.toLowerCase().includes(q))) ||
        (Array.isArray(mentor.subjects) &&
          mentor.subjects.some((s) => s.toLowerCase().includes(q)));

      const matchesSubject =
        !selectedSubject ||
        selectedSubject === "all subjects" ||
        subjectSlugs.includes(selectedSubject);

      const matchesGrade =
        !selectedGrade ||
        selectedGrade === "all grades" ||
        gradeBands.length === 0 ||
        gradeBands.includes(selectedGrade);

      const matchesCategory =
        !selectedCategory ||
        subjectSlugs.includes(selectedCategory.subject);

      return matchesSearch && matchesSubject && matchesGrade && matchesCategory;
    });
  }, [
    mentorsData,
    searchQuery,
    selectedSubject,
    selectedGrade,
    selectedCategory,
  ]);

  return (
    <div className="flex flex-col items-center space-y-6 py-10 w-full max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-900">Find Your Mentor</h2>
      <p className="text-gray-600 text-center max-w-2xl">
        Connect with experienced educators who can guide you through your
        academic journey
      </p>

      {fetchError && (
        <p className="text-center text-red-600 text-sm max-w-lg">{fetchError}</p>
      )}

      {/* Search Bar */}
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by name, subject, or expertise..."
          className="pl-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4">
        <Select
          value={selectedSubject}
          onValueChange={setSelectedSubject}
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all subjects">All Subjects</SelectItem>
            <SelectItem value="math">Mathematics</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
            <SelectItem value="chemistry">Chemistry</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="biology">Biology</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="commerce">Commerce</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedGrade}
          onValueChange={setSelectedGrade}
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all grades">All Grades</SelectItem>
            <SelectItem value="5-10">Grades 5-10</SelectItem>
            <SelectItem value="11-12 science">
              Grades 11-12 (Science)
            </SelectItem>
            <SelectItem value="11-12 commerce">
              Grades 11-12 (Commerce)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            type="button"
            disabled={loading}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory?.id === category.id
                ? category.hoverColor.replace("hover:", "")
                : category.color
            } ${category.hoverColor}`}
            onClick={() =>
              setSelectedCategory(
                selectedCategory?.id === category.id ? null : category,
              )
            }
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="w-full space-y-4">
        {loading && (
          <p className="text-center text-gray-500 py-8">Loading mentors…</p>
        )}

        {!loading && filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => {
              const expertise =
                mentor.expertise?.length > 0
                  ? mentor.expertise
                  : mentor.subjects || [];
              const rating =
                typeof mentor.rating === "number" ? mentor.rating : null;
              const batches =
                typeof mentor.batchCount === "number" ? mentor.batchCount : 0;
              const email = mentor.social?.email;

              return (
                <div
                  key={mentor.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={avatarUrl(mentor.name, mentor.image)}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{mentor.name}</h3>
                      <p className="text-gray-600 text-sm">{mentor.subject}</p>
                      <div className="flex items-center space-x-2 mt-1 flex-wrap">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm">
                          {rating != null ? rating : "—"}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm">
                          {batches > 0
                            ? `${batches} batch${batches === 1 ? "" : "es"}`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium text-sm text-gray-700">
                      Expertise:
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {expertise.length > 0 ? (
                        expertise.map((skill, index) => (
                          <span
                            key={`${mentor.id}-exp-${index}`}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">
                          Subjects not assigned yet
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    asChild={Boolean(email)}
                    disabled={!email}
                  >
                    {email ? (
                      <a href={`mailto:${email}`}>Contact Mentor</a>
                    ) : (
                      <span>Contact Mentor</span>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : null}

        {!loading && !fetchError && mentorsData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No faculty profiles available yet. Please check back soon.
            </p>
          </div>
        )}

        {!loading &&
          mentorsData.length > 0 &&
          filteredMentors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No mentors found matching your criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default FindYourMentor;
