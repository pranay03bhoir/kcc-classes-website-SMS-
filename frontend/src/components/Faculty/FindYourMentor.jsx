"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
const FindYourMentor = () => {
  const [mentors, setMentors] = useState("");
  return (
    <div className="flex flex-col items-center space-y-6 py-10 w-full">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-900">Find Your Mentor</h2>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by name, subject, or expertise..."
          className="pl-12"
          value={mentors}
          onChange={(e) => {
            setMentors(e.target.value);
          }}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4">
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="math">Mathematics</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
            <SelectItem value="chemistry">Chemistry</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="biology">Biology</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="commerce">Commerce</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
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
        {[
          {
            id: 1,
            name: "Physics Experts",
            color: "bg-blue-100 text-blue-700",
            hoverColor: "hover:bg-blue-400 hover:text-white",
          },
          {
            id: 2,
            name: "Chemistry Specialists",
            color: "bg-green-100 text-green-700",
            hoverColor: "hover:bg-green-400 hover:text-white",
          },
          {
            id: 3,
            name: "Commerce Faculty",
            color: "bg-purple-100 text-purple-700",
            hoverColor: "hover:bg-purple-400 hover:text-white",
          },
          {
            id: 4,
            name: "Mathematics Tutors",
            color: "bg-red-100 text-red-700",
            hoverColor: "hover:bg-red-400 hover:text-white",
          },
        ].map((category) => (
          <Button
            key={category.id}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${category.color} ${category.hoverColor}`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Search Info */}
      <div className="text-gray-500 bg-gray-100 rounded-md px-6 py-3 text-center">
        Enter your search criteria above to find the perfect mentor for your
        academic journey.
      </div>
      <div>
        <h1>You are searching for {mentors}</h1>
      </div>
    </div>
  );
};

export default FindYourMentor;
