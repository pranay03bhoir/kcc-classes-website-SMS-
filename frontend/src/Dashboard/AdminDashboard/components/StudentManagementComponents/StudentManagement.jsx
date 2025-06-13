"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { AlertCircle, Info, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaPlus, FaSearch, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import * as z from "zod";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import ViewModal from "../ViewModal"; // Import the modal component

// Form validation schema
const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  contact: z.string().regex(/^\d{10}$/, "Contact must be 10 digits"),
  parentsContact: z
    .array(z.string().regex(/^\d{10}$/, "Contact must be 10 digits"))
    .min(1, "At least one parent contact is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  currentStd: z.string().min(1, "Current standard is required"),
  admissionYear: z
    .number()
    .min(2000)
    .max(new Date().getFullYear() + 1),
  profileImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
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
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contact: "",
      parentsContact: [""],
      address: "",
      currentStd: "",
      admissionYear: new Date().getFullYear(),
      profileImage: "",
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
    setIsLoading(true);
    const toastId = toast.loading(
      data._id ? "Updating student..." : "Adding student..."
    );

    try {
      let response;
      if (data._id) {
        response = await api.put(`/update/students/${data._id}`, data);
      } else {
        response = await api.post("/create/students", data);
      }

      if (response.status === 200) {
        // Optimistic update
        const updatedStudents = data._id
          ? searchedStudent.map((s) => (s._id === data._id ? response.data : s))
          : [...searchedStudent, response.data];

        setSearchedStudent(updatedStudents);
        toast.update(toastId, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        reset();
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

    try {
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
      const studentId = students[index]._id;
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
    const selected = students[index];
    Object.entries(selected).forEach(([key, value]) => {
      setValue(key, value);
    });
    setActiveTab("form"); // Switch to form tab
    formRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleViewStudent = (index) => {
    // Handle view action here
    setSelectedStudent(students[index]);
    setIsViewModalOpen(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Important: prevent page reload
    handleStudentSearch(searchTerm); // Pass the current search term
  };

  return (
    <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Student Management</CardTitle>
        <CardDescription>
          Add, update, or manage student information in the system
        </CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="form">Add/Edit Student</TabsTrigger>
          <TabsTrigger value="list">Student List</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Information Section */}
                <div className="col-span-full">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Enter student's full name"
                        aria-invalid={errors.name ? "true" : "false"}
                        className={`w-full ${
                          errors.name ? "border-red-500 focus:ring-red-500" : ""
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
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="student@example.com"
                        aria-invalid={errors.email ? "true" : "false"}
                        className={`w-full ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : ""
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
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        {...register("password")}
                        placeholder="Enter password"
                        aria-invalid={errors.password ? "true" : "false"}
                        className={`w-full ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="col-span-full my-2" />

                {/* Contact Information Section */}
                <div className="col-span-full">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-sm font-medium">
                        Student Contact
                      </Label>
                      <Input
                        id="contact"
                        {...register("contact")}
                        placeholder="10-digit mobile number"
                        aria-invalid={errors.contact ? "true" : "false"}
                        className={`w-full ${
                          errors.contact
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      {errors.contact && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.contact.message}
                        </p>
                      )}
                    </div>

                    <div className="col-span-full lg:col-span-2 space-y-2">
                      <Label className="text-sm font-medium">
                        Parents' Contact
                      </Label>
                      <div className="space-y-3">
                        {getValues("parentsContact").map((_, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <Input
                                {...register(`parentsContact.${index}`)}
                                placeholder={`Parent ${
                                  index + 1
                                } Contact Number`}
                                className={`w-full ${
                                  errors.parentsContact?.[index]
                                    ? "border-red-500 focus:ring-red-500"
                                    : ""
                                }`}
                              />
                              {errors.parentsContact?.[index] && (
                                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                                  <AlertCircle className="h-4 w-4" />
                                  {errors.parentsContact[index].message}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddParentContact}
                                className="h-10"
                              >
                                <FaPlus className="h-4 w-4" />
                              </Button>
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveParentContact(index)
                                  }
                                  className="h-10 text-red-500 hover:text-red-600"
                                >
                                  <FaTrashAlt className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.parentsContact &&
                        typeof errors.parentsContact === "object" &&
                        !Array.isArray(errors.parentsContact) && (
                          <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.parentsContact.message}
                          </p>
                        )}
                    </div>

                    <div className="col-span-full space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        {...register("address")}
                        placeholder="Enter complete address"
                        rows={3}
                        className={`w-full ${
                          errors.address
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="col-span-full my-2" />

                {/* Academic Information Section */}
                <div className="col-span-full">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentStd"
                        className="text-sm font-medium"
                      >
                        Current Standard
                      </Label>
                      <Input
                        id="currentStd"
                        {...register("currentStd")}
                        placeholder="e.g., Class 10"
                        aria-invalid={errors.currentStd ? "true" : "false"}
                        className={`w-full ${
                          errors.currentStd
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      {errors.currentStd && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.currentStd.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="admissionYear"
                        className="text-sm font-medium"
                      >
                        Admission Year
                      </Label>
                      <Input
                        id="admissionYear"
                        type="number"
                        {...register("admissionYear", { valueAsNumber: true })}
                        placeholder="YYYY"
                        min={2000}
                        max={new Date().getFullYear() + 1}
                        aria-invalid={errors.admissionYear ? "true" : "false"}
                        className={`w-full ${
                          errors.admissionYear
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      {errors.admissionYear && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.admissionYear.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="profileImage"
                        className="text-sm font-medium"
                      >
                        Profile Image URL
                      </Label>
                      <Input
                        id="profileImage"
                        {...register("profileImage")}
                        placeholder="https://example.com/image.jpg"
                        aria-invalid={errors.profileImage ? "true" : "false"}
                        className={`w-full ${
                          errors.profileImage
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      {errors.profileImage && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.profileImage.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-full mt-6">
                  <Button
                    type="submit"
                    className="w-full md:w-auto min-w-[200px]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {getValues("_id") ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>
                        {getValues("_id") ? (
                          <>
                            <FaEdit className="mr-2" />
                            Update Student
                          </>
                        ) : (
                          <>
                            <FaPlus className="mr-2" />
                            Add Student
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </TabsContent>

        <TabsContent value="list">
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <h2 className="text-lg font-semibold">Student List</h2>
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex gap-2 w-full md:w-auto"
                >
                  <div className="relative flex-1 md:min-w-[300px]">
                    <Input
                      placeholder="Search by Student ID or Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                      aria-label="Search students"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
                    )}
                  </div>
                  <Button type="submit" disabled={isSearching}>
                    <FaSearch className="mr-2" />
                    Search
                  </Button>
                </form>
              </div>

              {searchedStudent.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No students found. Try adjusting your search or add a new
                    student.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Sr.no</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchedStudent.map((student, index) => (
                        <TableRow
                          key={student.studentId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewStudent(index)}
                                aria-label={`View details for ${student.name}`}
                              >
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditStudent(index)}
                                aria-label={`Edit ${student.name}`}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setStudentIndex(index);
                                  setIsDeleteModalOpen(true);
                                }}
                                aria-label={`Delete ${student.name}`}
                                disabled={isLoading}
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
