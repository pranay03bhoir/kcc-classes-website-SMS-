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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; // For address
import api from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEdit, FaPlus, FaSearch, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import * as z from "zod";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import ViewModal from "../ViewModal"; // Import the modal component

// Form validation schema
const studentSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  contact: z.string().regex(/^\d{10}$/, "Contact must be 10 digits"),
  parentsContact: z
    .array(z.string().regex(/^\d{10}$/, "Contact must be 10 digits"))
    .min(1, "At least one parent contact is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  currentStd: z.string().optional(),
  admissionYear: z
    .number()
    .min(2000, "Admission year must be 2000 or later")
    .max(
      new Date().getFullYear() + 1,
      `Admission year cannot be later than ${new Date().getFullYear() + 1}`
    ),
  profileImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  isVerified: z.boolean().default(false),
  isAdmitted: z.boolean().default(false),
});

const StudentManagement = ({ students }) => {
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedStudent, setSearchedStudent] = useState(students || []);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentIndex, setStudentIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("form");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      _id: "",
      name: "",
      email: "",
      password: "",
      contact: "",
      parentsContact: [""],
      address: "",
      currentStd: "",
      admissionYear: new Date().getFullYear(),
      profileImage: "",
      isVerified: false,
      isAdmitted: false,
    },
  });

  useEffect(() => {
    setSearchedStudent(students || []);
  }, [students]);

  const handleAddParentContact = () => {
    const currentParents = getValues("parentsContact");
    setValue("parentsContact", [...currentParents, ""]);
  };

  const handleRemoveParentContact = (index) => {
    const currentParents = getValues("parentsContact");
    if (currentParents.length <= 1) {
      toast.error("At least one parent contact is required");
      return;
    }
    const updatedParents = currentParents.filter((_, i) => i !== index);
    setValue("parentsContact", updatedParents);
  };

  const onSubmit = async (data) => {
    // Validate password for new students
    if (!data._id && (!data.password || data.password.trim() === "")) {
      toast.error("Password is required for new students");
      return;
    }

    // Validate password length if provided
    if (
      data.password &&
      data.password.trim() !== "" &&
      data.password.length < 6
    ) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading(
      data._id ? "Updating student..." : "Adding student..."
    );

    try {
      // Prepare student data according to backend requirements
      const studentData = {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        contact: data.contact.trim(),
        parentsContact: data.parentsContact.filter(
          (contact) => contact.trim() !== ""
        ),
        address: data.address.trim(),
        admissionYear: parseInt(data.admissionYear),
        role: "student",
        isVerified: data.isVerified,
        isAdmitted: data.isAdmitted,
      };

      // Add password only if provided (for updates) or always for new students
      if (data.password && data.password.trim()) {
        studentData.password = data.password;
      }

      // Add optional fields if provided
      if (data.currentStd && data.currentStd.trim()) {
        studentData.currentStd = data.currentStd.trim();
      }
      if (data.profileImage && data.profileImage.trim()) {
        studentData.profileImage = data.profileImage.trim();
      }

      let response;
      if (data._id) {
        // Update existing student
        response = await api.put(`/update/students/${data._id}`, studentData);
      } else {
        // Create new student
        response = await api.post("/create/students", studentData);
      }

      if (response.status === 200 || response.status === 201) {
        // Optimistic update
        const updatedStudents = data._id
          ? searchedStudent.map((s) =>
              s._id === data._id ? response.data.data || response.data : s
            )
          : [...searchedStudent, response.data.student || response.data];

        setSearchedStudent(updatedStudents);
        toast.update(toastId, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        reset({
          _id: "",
          name: "",
          email: "",
          password: "",
          contact: "",
          parentsContact: [""],
          address: "",
          currentStd: "",
          admissionYear: new Date().getFullYear(),
          profileImage: "",
          isVerified: false,
          isAdmitted: false,
        });
      }
    } catch (error) {
      console.error("Error submitting student:", error);
      const message =
        error.response?.data?.message || "Error submitting student";
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSearch = async (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim();
    setIsSearching(true);
    const toastId = toast.loading("Searching student...");

    try {
      if (trimmedSearchTerm === "") {
        setSearchedStudent(students || []);
        toast.update(toastId, {
          render: "Showing all students",
          type: "info",
          isLoading: false,
          autoClose: 2000,
        });
        return;
      }

      const response = await api.get(
        `/search/students?searchQuery=${trimmedSearchTerm}`
      );
      setSearchedStudent(response.data.students || []);
      toast.update(toastId, {
        render: response.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error searching student:", error);
      const message =
        error.response?.data?.message || "Error searching student";
      toast.update(toastId, {
        render: message,
        type: error.response?.status === 404 ? "info" : "error",
        isLoading: false,
        autoClose: 2000,
      });
      if (error.response?.status === 404) {
        setSearchedStudent([]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeleteStudent = async (index) => {
    setIsLoading(true);
    try {
      const studentId = searchedStudent[index]._id;
      const response = await api.delete(`/delete/students/${studentId}`);

      if (response.status === 200) {
        // Optimistic update
        setSearchedStudent(searchedStudent.filter((_, i) => i !== index));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      const message = error.response?.data?.message || "Error deleting student";
      toast.error(message);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditStudent = (index) => {
    const selected = searchedStudent[index];
    // Only set editable fields, exclude auto-generated and backend-managed fields
    const editableFields = [
      "_id",
      "name",
      "email",
      "contact",
      "parentsContact",
      "address",
      "currentStd",
      "admissionYear",
      "profileImage",
      "isVerified",
      "isAdmitted",
    ];

    editableFields.forEach((field) => {
      if (selected[field] !== undefined) {
        setValue(field, selected[field]);
      }
    });

    // Clear password field for editing
    setValue("password", "");

    setActiveTab("form"); // Switch to form tab
    formRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleViewStudent = (index) => {
    // Handle view action here
    setSelectedStudent(searchedStudent[index]);
    setIsViewModalOpen(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Important: prevent page reload
    handleStudentSearch(searchTerm); // Pass the current search term
  };

  return (
    <Card className="mb-6 border border-gray-200 bg-white">
      <CardHeader className="bg-white border-b border-gray-100 pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Student Management
        </CardTitle>
        <CardDescription className="text-gray-600">
          Add, update, or manage student information
        </CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 mx-4 mt-4 bg-gray-50 p-1 rounded-lg">
          <TabsTrigger
            value="form"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-md transition-all duration-200 text-sm font-medium"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Add/Edit Student
          </TabsTrigger>
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-md transition-all duration-200 text-sm font-medium"
          >
            <FaSearch className="mr-2 h-4 w-4" />
            Student List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <CardContent className="p-3 sm:p-6">
            <form
              ref={formRef}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Enter student's full name"
                        aria-invalid={errors.name ? "true" : "false"}
                        className={`w-full transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="student@example.com"
                        aria-invalid={errors.email ? "true" : "false"}
                        className={`w-full transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password{" "}
                        {getValues("_id") && "(Leave blank to keep current)"}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        {...register("password")}
                        placeholder={
                          getValues("_id")
                            ? "Leave blank to keep current password"
                            : "Enter password"
                        }
                        className="w-full transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="col-span-full my-2" />

                {/* Contact Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Contact Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label
                        htmlFor="contact"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Student Contact
                      </Label>
                      <Input
                        id="contact"
                        {...register("contact")}
                        placeholder="10-digit mobile number"
                        aria-invalid={errors.contact ? "true" : "false"}
                        className={`w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.contact
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.contact && (
                        <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          {errors.contact.message}
                        </p>
                      )}
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-2 sm:space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Parents' Contact
                      </Label>
                      <div className="space-y-3 sm:space-y-4">
                        {getValues("parentsContact").map((_, index) => (
                          <div
                            key={index}
                            className="flex gap-2 sm:gap-3 items-start"
                          >
                            <div className="flex-1">
                              <Input
                                {...register(`parentsContact.${index}`)}
                                placeholder={`Parent ${
                                  index + 1
                                } Contact Number`}
                                className={`w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.parentsContact?.[index]
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              {errors.parentsContact?.[index] && (
                                <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1 mt-1">
                                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                  {errors.parentsContact[index].message}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-1 sm:gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddParentContact}
                                className="h-9 w-9 sm:h-10 sm:w-10 bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hover:border-green-300 transition-all duration-200"
                              >
                                <FaPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveParentContact(index)
                                  }
                                  className="h-9 w-9 sm:h-10 sm:w-10 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                                >
                                  <FaTrashAlt className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.parentsContact &&
                        typeof errors.parentsContact === "object" &&
                        !Array.isArray(errors.parentsContact) && (
                          <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            {errors.parentsContact.message}
                          </p>
                        )}
                    </div>

                    <div className="col-span-full space-y-2 sm:space-y-3">
                      <Label
                        htmlFor="address"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        {...register("address")}
                        placeholder="Enter complete address"
                        rows={3}
                        className={`w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.address
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="col-span-full my-2" />

                {/* Academic Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Academic Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label
                        htmlFor="currentStd"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Current Standard
                      </Label>
                      <Input
                        id="currentStd"
                        {...register("currentStd")}
                        placeholder="e.g., Class 10"
                        aria-invalid={errors.currentStd ? "true" : "false"}
                        className={`w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.currentStd
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.currentStd && (
                        <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          {errors.currentStd.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label
                        htmlFor="admissionYear"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Admission Year
                      </Label>
                      <Input
                        id="admissionYear"
                        type="number"
                        {...register("admissionYear", { valueAsNumber: true })}
                        placeholder="e.g., 2024"
                        min="2000"
                        max={new Date().getFullYear() + 1}
                        aria-invalid={errors.admissionYear ? "true" : "false"}
                        className={`w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.admissionYear
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.admissionYear && (
                        <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          {errors.admissionYear.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label
                        htmlFor="profileImage"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Profile Image URL
                      </Label>
                      <Input
                        id="profileImage"
                        {...register("profileImage")}
                        placeholder="https://example.com/image.jpg"
                        aria-invalid={errors.profileImage ? "true" : "false"}
                        className={`w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.profileImage
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.profileImage && (
                        <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          {errors.profileImage.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Controller
                          name="isVerified"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="isVerified"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                          )}
                        />
                        <Label
                          htmlFor="isVerified"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Email Verified
                        </Label>
                      </div>
                      {errors.isVerified && (
                        <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          {errors.isVerified.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Controller
                          name="isAdmitted"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="isAdmitted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                          )}
                        />
                        <Label
                          htmlFor="isAdmitted"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Student Admitted
                        </Label>
                      </div>
                      {errors.isAdmitted && (
                        <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          {errors.isAdmitted.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="w-full md:w-auto min-w-[200px] h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {getValues("_id")
                            ? "Updating Student..."
                            : "Adding Student..."}
                        </>
                      ) : (
                        <>
                          {getValues("_id") ? (
                            <>
                              <FaEdit className="mr-2 h-4 w-4" />
                              Update Student
                            </>
                          ) : (
                            <>
                              <FaPlus className="mr-2 h-4 w-4" />
                              Add Student
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </TabsContent>

        <TabsContent value="list">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Student List
                  </h2>
                </div>
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex flex-col md:flex-row gap-3 w-full"
                >
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search by Student ID or Name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Search students"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    <FaSearch className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </form>
              </div>

              {searchedStudent.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Students Found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or add a new student to
                    get started.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {/* Mobile Card View */}
                  <div className="block md:hidden">
                    {searchedStudent.map((student, index) => (
                      <div
                        key={student._id || student.studentId}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-gray-500">
                              #{index + 1}
                            </p>
                            <p className="font-medium text-blue-600 text-sm">
                              {student.studentId}
                            </p>
                            <p className="font-medium text-gray-900">
                              {student.name}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewStudent(index)}
                              className="h-8 px-3 bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 text-xs"
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStudent(index)}
                              className="h-8 px-3 bg-green-50 border-green-200 text-green-600 hover:bg-green-100 text-xs"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setStudentIndex(index);
                                setIsDeleteModalOpen(true);
                              }}
                              disabled={isLoading}
                              className="h-8 px-3 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 text-xs"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="w-[100px] font-medium text-gray-700">
                            Sr.no
                          </TableHead>
                          <TableHead className="font-medium text-gray-700">
                            Student ID
                          </TableHead>
                          <TableHead className="font-medium text-gray-700">
                            Name
                          </TableHead>
                          <TableHead className="text-right font-medium text-gray-700">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchedStudent.map((student, index) => (
                          <TableRow
                            key={student._id || student.studentId}
                            className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
                          >
                            <TableCell className="font-medium text-gray-600">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium text-blue-600">
                              {student.studentId}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                              {student.name}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewStudent(index)}
                                  aria-label={`View details for ${student.name}`}
                                  className="h-8 px-3 bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                                >
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditStudent(index)}
                                  aria-label={`Edit ${student.name}`}
                                  className="h-8 px-3 bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setStudentIndex(index);
                                    setIsDeleteModalOpen(true);
                                  }}
                                  aria-label={`Delete ${student.name}`}
                                  disabled={isLoading}
                                  className="h-8 px-3 bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        student={selectedStudent}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteStudent(studentIndex)}
        itemType="Student"
        isLoading={isLoading}
      />
    </Card>
  );
};

export default StudentManagement;
