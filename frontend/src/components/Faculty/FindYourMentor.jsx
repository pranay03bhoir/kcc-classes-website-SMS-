"use client";
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
import { useMemo, useState } from "react";

const FindYourMentor = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Mock data for mentors
  const mentorsData = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      subject: "physics",
      grade: "11-12 science",
      expertise: ["Quantum Physics", "Mechanics"],
      rating: 4.8,
      students: 120,
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      subject: "chemistry",
      grade: "11-12 science",
      expertise: ["Organic Chemistry", "Biochemistry"],
      rating: 4.9,
      students: 95,
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Dr. Emily Brown",
      subject: "commerce",
      grade: "11-12 commerce",
      expertise: ["Accounting", "Business Studies"],
      rating: 4.7,
      students: 150,
      image: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      name: "Prof. David Wilson",
      subject: "math",
      grade: "5-10",
      expertise: ["Algebra", "Geometry"],
      rating: 4.9,
      students: 200,
      image: "https://i.pravatar.cc/150?img=4",
    },
  ];

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

  const filteredMentors = useMemo(() => {
    return mentorsData.filter((mentor) => {
      const matchesSearch =
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise.some((exp) =>
          exp.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesSubject =
        !selectedSubject || mentor.subject === selectedSubject;
      const matchesGrade = !selectedGrade || mentor.grade === selectedGrade;
      const matchesCategory =
        !selectedCategory || mentor.subject === selectedCategory.subject;

      return matchesSearch && matchesSubject && matchesGrade && matchesCategory;
    });
  }, [searchQuery, selectedSubject, selectedGrade, selectedCategory]);

  return (
    <div className="flex flex-col items-center space-y-6 py-10 w-full max-w-6xl mx-auto px-4">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900">Find Your Mentor</h2>
      <p className="text-gray-600 text-center max-w-2xl">
        Connect with experienced educators who can guide you through your
        academic journey
      </p>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by name, subject, or expertise..."
          className="pl-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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

        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory?.id === category.id
                ? category.hoverColor.replace("hover:", "")
                : category.color
            } ${category.hoverColor}`}
            onClick={() =>
              setSelectedCategory(
                selectedCategory?.id === category.id ? null : category
              )
            }
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="w-full space-y-4">
        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{mentor.name}</h3>
                    <p className="text-gray-600 capitalize">{mentor.subject}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm">{mentor.rating}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm">
                        {mentor.students} students
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-sm text-gray-700">
                    Expertise:
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mentor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <Button className="w-full mt-4">Contact Mentor</Button>
              </div>
            ))}
          </div>
        ) : (
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
