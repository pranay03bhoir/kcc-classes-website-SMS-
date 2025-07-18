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
import api, { removeTeacherFromSubject } from "@/utils/axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaSync,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const RemoveTeacherFromCourse = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [removalResult, setRemovalResult] = useState(null); // To store backend response

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
  console.log("Teachers:", teachers);
  console.log("Subjects:", subjects);

  // Filter teachers to only those assigned to the selected subject
  const teachersForSubject = selectedSubject
    ? teachers.filter((t) => {
        const subject = subjects.find((s) => s._id === selectedSubject);
        // Defensive: ensure subject.teachers is an array of strings
        const subjectTeacherIds = Array.isArray(subject?.teachers)
          ? subject.teachers.map((id) => String(id))
          : [];
        return subjectTeacherIds.includes(String(t._id));
      })
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject || selectedTeachers.length === 0) {
      toast.error("Please select a subject and at least one teacher to remove");
      return;
    }
    setLoading(true);
    try {
      const res = await removeTeacherFromSubject(selectedSubject, selectedTeachers);
      setSuccess(true);
      setRemovalResult(res.data); // Store backend response
      toast.success("Teacher(s) removed from subject successfully");
    } catch (e) {
      toast.error(
        e?.response?.data?.message || "Failed to remove teacher(s) from subject"
      );
    } finally {
      setLoading(false);
    }
  };
  console.log("Selected Subject:", selectedSubject);
  console.log("Selected Teachers:", selectedTeachers);

  const handleReset = () => {
    setSelectedSubject("");
    setSelectedTeachers([]);
    setSuccess(false);
    setSubjectSearch("");
    setTeacherSearch("");
    setRemovalResult(null);
  };

  // For displaying selected subject in the trigger
  const selectedSubjectObj = subjects.find((s) => s._id === selectedSubject);
  const selectedSubjectLabel = selectedSubjectObj
    ? selectedSubjectObj.name
    : "Select subject";

  // Filtered subjects for search
  const filteredSubjects = subjectSearch
    ? subjects.filter((subject) =>
        subject.name.toLowerCase().includes(subjectSearch.toLowerCase())
      )
    : subjects;

  // For displaying selected teachers in the trigger
  const selectedTeacherNames = teachers
    .filter((t) => selectedTeachers.includes(t._id))
    .map((t) => t.name)
    .join(", ");

  // Filtered teachers for search
  const filteredTeachers = teacherSearch
    ? teachersForSubject.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
          teacher.email.toLowerCase().includes(teacherSearch.toLowerCase())
      )
    : teachersForSubject;

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
              Remove Teacher(s) from Subject
            </CardTitle>
            <CardDescription className="text-gray-500 text-xs sm:text-base">
              Select a subject and remove one or more teachers from it.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 w-full">
              <FaCheckCircle className="text-green-500 text-4xl sm:text-5xl mb-4 animate-bounce" />
              <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-2">
                Success!
              </h3>
              <p className="text-gray-600 mb-2 text-center text-sm sm:text-base">
                Teacher removal operation completed.
              </p>
              {/* Feedback summary */}
              <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4 w-full max-w-md">
                <div className="mb-2">
                  <span className="font-semibold text-green-800">Subject:</span> <br />
                  <span className="text-green-900">{selectedSubjectObj ? selectedSubjectObj.name : "-"}</span>
                </div>
                {removalResult && (
                  <>
                    {removalResult.removed && removalResult.removed.length > 0 && (
                      <div className="mb-2">
                        <span className="font-semibold text-green-700">Removed:</span>
                        <ul className="list-disc list-inside text-green-700 text-sm">
                          {removalResult.removed.map((id) => {
                            const t = teachers.find((x) => String(x._id) === String(id));
                            return <li key={id}>{t ? `${t.name} (${t.email})` : id}</li>;
                          })}
                        </ul>
                      </div>
                    )}
                    {removalResult.notFound && removalResult.notFound.length > 0 && (
                      <div className="mb-2">
                        <span className="font-semibold text-red-600">Not Found:</span>
                        <ul className="list-disc list-inside text-red-600 text-sm">
                          {removalResult.notFound.map((id) => {
                            const t = teachers.find((x) => String(x._id) === String(id));
                            return <li key={id}>{t ? `${t.name} (${t.email})` : id}</li>;
                          })}
                        </ul>
                      </div>
                    )}
                    {removalResult.notAssociated && removalResult.notAssociated.length > 0 && (
                      <div className="mb-2">
                        <span className="font-semibold text-yellow-600">Not Associated with Subject:</span>
                        <ul className="list-disc list-inside text-yellow-600 text-sm">
                          {removalResult.notAssociated.map((id) => {
                            const t = teachers.find((x) => String(x._id) === String(id));
                            return <li key={id}>{t ? `${t.name} (${t.email})` : id}</li>;
                          })}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              <Button
                onClick={handleReset}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <FaSync /> Remove Another
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 sm:gap-8 md:flex-row md:gap-8 items-stretch md:items-end justify-between w-full mt-2"
            >
              <div className="flex-1 min-w-0 mb-4 md:mb-0">
                <label className="mb-1 text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FaBookOpen className="text-purple-400" /> Subject
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
                        !selectedSubject && "text-muted-foreground"
                      )}
                    >
                      {selectedSubjectLabel}
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
                                setSelectedSubject(subject._id);
                                setSubjectDropdownOpen(false);
                                setSelectedTeachers([]); // Reset teachers when subject changes
                              }}
                              className="cursor-pointer"
                            >
                              {subject.name}
                              {selectedSubject === subject._id && (
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
                  <FaChalkboardTeacher className="text-blue-400" /> Teachers
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
                        !selectedTeachers.length && "text-muted-foreground"
                      )}
                    >
                      {selectedTeachers.length > 0
                        ? selectedTeacherNames
                        : "Select teachers"}
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
                          {filteredTeachers.length === 0 && selectedSubject && (
                            <div className="p-4 text-gray-400 text-center text-sm">
                              No teachers assigned to this subject.
                            </div>
                          )}
                          {filteredTeachers.map((teacher) => (
                            <CommandItem
                              key={teacher._id}
                              onSelect={() => {
                                setSelectedTeachers((prev) =>
                                  prev.includes(teacher._id)
                                    ? prev.filter((id) => id !== teacher._id)
                                    : [...prev, teacher._id]
                                );
                              }}
                              className="cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedTeachers.includes(teacher._id)}
                                tabIndex={-1}
                                className="mr-2"
                                aria-label={teacher.name}
                                readOnly
                              />
                              {teacher.name}{" "}
                              <span className="text-xs text-gray-400">
                                ({teacher.email})
                              </span>
                              {selectedTeachers.includes(teacher._id) && (
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
                  {loading ? "Removing..." : "Remove Teacher(s)"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="h-11 sm:h-12 w-1/2 md:w-auto border-gray-300 text-gray-600 hover:bg-gray-100 text-sm sm:text-base"
                  disabled={
                    loading ||
                    (!selectedSubject && selectedTeachers.length === 0)
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

export default RemoveTeacherFromCourse;
