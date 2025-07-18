"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addTopperStudent } from "@/utils/axios";
import { Check, ChevronsUpDown, PlusCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import GetAllToppers from "./GetAllToppers";
import Sidebar from "./SideBar";

const DEFAULT_EXAM_TYPES = [
  "Midterm",
  "Final",
  "Quiz",
  "Assignment",
  "Board",
  "JEE",
  "NEET",
  "JEE Mains",
  "JEE Advanced",
  "MH CET",
  "NEET UG",
  "NEET UA",
  "NEET PG",
];

const AddTopperStudent = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm();
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [examTypes, setExamTypes] = useState(DEFAULT_EXAM_TYPES);
  const [openExamType, setOpenExamType] = useState(false);
  const [searchExamType, setSearchExamType] = useState("");
  const selectedExamType = watch("examType") || "";

  // For dynamic otherAchievements
  const [otherAchievementsFields, setOtherAchievementsFields] = useState([""]);

  // Keep form value in sync with dynamic fields
  const handleOtherAchievementChange = (idx, value) => {
    const updated = [...otherAchievementsFields];
    updated[idx] = value;
    setOtherAchievementsFields(updated);
    setValue(
      "otherAchievements",
      updated.filter((v) => v.trim() !== "")
    );
  };

  const handleAddAchievementField = () => {
    setOtherAchievementsFields((prev) => [...prev, ""]);
  };

  const handleRemoveAchievementField = (idx) => {
    if (otherAchievementsFields.length === 1) return;
    const updated = otherAchievementsFields.filter((_, i) => i !== idx);
    setOtherAchievementsFields(updated);
    setValue(
      "otherAchievements",
      updated.filter((v) => v.trim() !== "")
    );
  };

  // On reset, clear dynamic fields
  const wrappedReset = (...args) => {
    reset(...args);
    setOtherAchievementsFields([""]);
  };

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMsg("");
    try {
      data.year = Number(data.year);
      await addTopperStudent(data);
      setSuccessMsg("Topper added successfully!");
      wrappedReset();
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Failed to add topper. Please try again."
      );
    }
  };

  // Handler to add custom exam type
  const handleAddCustomExamType = (customType) => {
    if (!customType) return;
    if (!examTypes.includes(customType)) {
      setExamTypes((prev) => [...prev, customType]);
    }
    setValue("examType", customType, { shouldValidate: true });
    setOpenExamType(false);
    setSearchExamType("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-black dark:via-slate-900 dark:to-black">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto ">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl bg-white/90 dark:bg-black/60 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-2 text-center text-slate-800 dark:text-slate-100">
            Add Topper Student
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-base">
            Fill in the details below to highlight a student's achievement.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label
                htmlFor="studentName"
                className="md:col-span-1 font-medium text-slate-700 dark:text-slate-200"
              >
                Student Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentName"
                placeholder="Enter student name"
                {...register("studentName", {
                  required: "Student name is required",
                })}
                aria-invalid={!!errors.studentName}
                className="md:col-span-3 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
              />
            </div>
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label
                htmlFor="examType"
                className="md:col-span-1 font-medium text-slate-700 dark:text-slate-200"
              >
                Exam Type<span className="text-red-500">*</span>
              </Label>
              <div className="md:col-span-3">
                <Popover open={openExamType} onOpenChange={setOpenExamType}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={openExamType}
                      className="w-full justify-between"
                    >
                      {selectedExamType ? (
                        <span>{selectedExamType}</span>
                      ) : (
                        <span className="text-muted-foreground">
                          Select or add exam type...
                        </span>
                      )}
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[350px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search or add exam type..."
                        value={searchExamType}
                        onValueChange={setSearchExamType}
                        autoFocus
                      />
                      <CommandList>
                        <CommandEmpty>
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full flex items-center gap-2 justify-start px-2 py-2"
                            onClick={() =>
                              handleAddCustomExamType(searchExamType.trim())
                            }
                            disabled={!searchExamType.trim()}
                          >
                            <PlusCircle className="h-4 w-4 text-blue-500" />
                            <span>Add "{searchExamType.trim()}"</span>
                          </Button>
                        </CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-[200px]">
                            {examTypes.map((type) => (
                              <CommandItem
                                key={type}
                                value={type}
                                onSelect={() => {
                                  setValue("examType", type, {
                                    shouldValidate: true,
                                  });
                                  setOpenExamType(false);
                                  setSearchExamType("");
                                }}
                                className="flex items-center gap-2"
                              >
                                <Check
                                  className={
                                    selectedExamType === type
                                      ? "h-4 w-4 text-blue-600 opacity-100"
                                      : "h-4 w-4 opacity-0"
                                  }
                                />
                                <span>{type}</span>
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  {...register("examType", {
                    required: "Exam type is required",
                  })}
                />
                {errors.examType && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.examType.message}
                  </div>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label
                htmlFor="score"
                className="md:col-span-1 font-medium text-slate-700 dark:text-slate-200"
              >
                Score<span className="text-red-500">*</span>
              </Label>
              <Input
                id="score"
                placeholder="e.g. 95% or 98/100"
                {...register("score", { required: "Score is required" })}
                aria-invalid={!!errors.score}
                className="md:col-span-3 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
              />
            </div>
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label
                htmlFor="year"
                className="md:col-span-1 font-medium text-slate-700 dark:text-slate-200"
              >
                Year<span className="text-red-500">*</span>
              </Label>
              <Input
                id="year"
                type="number"
                placeholder="e.g. 2024"
                {...register("year", {
                  required: "Year is required",
                  min: { value: 2000, message: "Year must be >= 2000" },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: `Year must be <= ${new Date().getFullYear() + 1}`,
                  },
                })}
                aria-invalid={!!errors.year}
                className="md:col-span-3 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
              />
            </div>
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label
                htmlFor="profileImage"
                className="md:col-span-1 font-medium text-slate-700 dark:text-slate-200"
              >
                Profile Image URL
              </Label>
              <Input
                id="profileImage"
                placeholder="Optional: Image URL"
                {...register("profileImage")}
                className="md:col-span-3 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
              />
            </div>
            <div className="grid md:grid-cols-4 items-center gap-4">
              <Label
                htmlFor="otherAchievements"
                className="md:col-span-1 font-medium text-slate-700 dark:text-slate-200"
              >
                Other Achievements
              </Label>
              <div className="md:col-span-3 flex flex-col gap-2">
                {otherAchievementsFields.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      id={`otherAchievements-${idx}`}
                      placeholder="Optional: Other achievement"
                      value={val}
                      onChange={(e) =>
                        handleOtherAchievementChange(idx, e.target.value)
                      }
                      className="flex-1 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
                    />
                    {otherAchievementsFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievementField(idx)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove achievement"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    )}
                    {idx === otherAchievementsFields.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAddAchievementField}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Add achievement"
                      >
                        <PlusCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <input type="hidden" {...register("otherAchievements")} />
              </div>
            </div>
            {/* Feedback Messages */}
            {serverError && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-4 py-3 text-red-700 dark:text-red-200 text-center text-sm">
                {serverError}
              </div>
            )}
            {successMsg && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-4 py-3 text-green-700 dark:text-green-200 text-center text-sm">
                {successMsg}
              </div>
            )}
            <div className="flex justify-center mt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-1/2 py-3 text-lg font-semibold shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white dark:from-blue-600 dark:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-900 transition"
              >
                {isSubmitting ? "Adding..." : "Add Topper"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <div className="w-full max-w-2xl mx-auto px-4 py-8 overflow-y-auto">
        <GetAllToppers />
      </div>
    </div>
  );
};

export default AddTopperStudent;
