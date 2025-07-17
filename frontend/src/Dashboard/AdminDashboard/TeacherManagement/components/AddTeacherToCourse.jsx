"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import api, { addTeacherToSubject } from "@/utils/axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaSync,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const AddTeacherToCourse = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, subjectsRes] = await Promise.all([
          api.get("/teachers"),
          api.get("/subjects"),
        ]);
        setTeachers(teachersRes.data.teachers || []);
        setSubjects(subjectsRes.data.subjects || []);
      } catch (e) {
        toast.error("Failed to load teachers or subjects");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacher || selectedSubjects.length === 0) {
      toast.error("Please select a teacher and at least one subject");
      return;
    }
    setLoading(true);
    try {
      await addTeacherToSubject(selectedTeacher, selectedSubjects);
      setSuccess(true);

      toast.success("Teacher added to subject(s) successfully");
    } catch (e) {
      toast.error(
        e?.response?.data?.message || "Failed to add teacher to subject(s)"
      );
    } finally {
      setLoading(false);
    }
  };
  // console.log("Sending to backend", {
  //   teacherId: selectedTeacher,
  //   subjects: selectedSubjects,
  // });

  const handleReset = () => {
    setSelectedTeacher("");
    setSelectedSubjects([]);
    setSuccess(false);
    setSubjectSearch("");
    setTeacherSearch("");
  };

  // For displaying selected subjects in the trigger
  const selectedSubjectNames = subjects
    .filter((s) => selectedSubjects.includes(s._id))
    .map((s) => s.name)
    .join(", ");

  // Filtered subjects for search
  const filteredSubjects = subjectSearch
    ? subjects.filter((subject) =>
        subject.name.toLowerCase().includes(subjectSearch.toLowerCase())
      )
    : subjects;

  // For displaying selected teacher in the trigger
  const selectedTeacherObj = teachers.find((t) => t._id === selectedTeacher);
  const selectedTeacherLabel = selectedTeacherObj
    ? `${selectedTeacherObj.name} (${selectedTeacherObj.email})`
    : "Select teacher";

  // Filtered teachers for search
  const filteredTeachers = teacherSearch
    ? teachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
          teacher.email.toLowerCase().includes(teacherSearch.toLowerCase())
      )
    : teachers;

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-purple-50 py-4 px-2 sm:px-4 md:px-8">
      <Card className="w-full max-w-lg sm:max-w-xl md:max-w-3xl shadow-xl border-0 bg-white/90 backdrop-blur-md px-2 sm:px-6 md:px-10">
        <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 border-b-0 pb-2 px-0">
          <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
            <FaChalkboardTeacher className="text-blue-600 text-xl sm:text-2xl" />
          </div>
          <div className="flex-1 min-w-0">
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <CardTitle className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
              Assign Teacher to Subjects
            </CardTitle>
            <CardDescription className="text-gray-500 text-xs sm:text-base">
              Select a teacher and assign them to one or more subjects.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <FaCheckCircle className="text-green-500 text-4xl sm:text-5xl mb-4 animate-bounce" />
              <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-2">
                Success!
              </h3>
              <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
                Teacher has been assigned to the selected subject(s).
              </p>
              <Button
                onClick={handleReset}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <FaSync /> Assign Another
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 sm:gap-8 md:flex-row md:gap-8 items-stretch md:items-end justify-between w-full mt-2"
            >
              <div className="flex-1 min-w-0 mb-4 md:mb-0">
                <label className="mb-1 text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FaChalkboardTeacher className="text-blue-400" /> Teacher
                </label>
                <Popover
                  open={teacherDropdownOpen}
                  onOpenChange={setTeacherDropdownOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={teacherDropdownOpen}
                      className={cn(
                        "w-full justify-between h-11 sm:h-12 border-gray-200 bg-white shadow-sm text-left text-sm sm:text-base",
                        !selectedTeacher && "text-muted-foreground"
                      )}
                    >
                      {selectedTeacherLabel}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full min-w-[220px] max-w-[320px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search teachers..."
                        value={teacherSearch}
                        onValueChange={setTeacherSearch}
                        className="h-10"
                      />
                      <CommandList>
                        <CommandEmpty>No teachers found.</CommandEmpty>
                        <CommandGroup>
                          {filteredTeachers.map((teacher) => (
                            <CommandItem
                              key={teacher._id}
                              onSelect={() => {
                                setSelectedTeacher(teacher._id);
                                setTeacherDropdownOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              {teacher.name} {" "}
                              <span className="text-xs text-gray-400">
                                ({teacher.email})
                              </span>
                              {selectedTeacher === teacher._id && (
                                <Check className="ml-auto h-4 w-4 text-primary" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <span className="text-xs text-gray-400 mt-1 block">
                  Required
                </span>
              </div>
              <div className="flex-1 min-w-0 mb-4 md:mb-0">
                <label className="mb-1 text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FaBookOpen className="text-purple-400" /> Subjects
                </label>
                <Popover
                  open={subjectDropdownOpen}
                  onOpenChange={setSubjectDropdownOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={subjectDropdownOpen}
                      className={cn(
                        "w-full justify-between h-11 sm:h-12 border-gray-200 bg-white shadow-sm text-left text-sm sm:text-base",
                        !selectedSubjects.length && "text-muted-foreground"
                      )}
                    >
                      {selectedSubjects.length > 0
                        ? selectedSubjectNames
                        : "Select subjects"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full min-w-[220px] max-w-[320px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search subjects..."
                        value={subjectSearch}
                        onValueChange={setSubjectSearch}
                        className="h-10"
                      />
                      <CommandList>
                        <CommandEmpty>No subjects found.</CommandEmpty>
                        <CommandGroup>
                          {filteredSubjects.map((subject) => (
                            <CommandItem
                              key={subject._id}
                              onSelect={() => {
                                setSelectedSubjects((prev) =>
                                  prev.includes(subject._id)
                                    ? prev.filter((id) => id !== subject._id)
                                    : [...prev, subject._id]
                                );
                              }}
                              className="cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedSubjects.includes(subject._id)}
                                tabIndex={-1}
                                className="mr-2"
                                aria-label={subject.name}
                                readOnly
                              />
                              {subject.name}
                              {selectedSubjects.includes(subject._id) && (
                                <Check className="ml-auto h-4 w-4 text-primary" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <span className="text-xs text-gray-400 mt-1 block">
                  Select one or more. Required.
                </span>
              </div>
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 sm:h-12 w-1/2 md:w-auto px-4 sm:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 shadow-lg font-semibold text-sm sm:text-base transition-all"
                >
                  {loading ? "Assigning..." : "Assign Teacher"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="h-11 sm:h-12 w-1/2 md:w-auto border-gray-300 text-gray-600 hover:bg-gray-100 text-sm sm:text-base"
                  disabled={
                    loading ||
                    (!selectedTeacher && selectedSubjects.length === 0)
                  }
                >
                  Reset
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTeacherToCourse;
