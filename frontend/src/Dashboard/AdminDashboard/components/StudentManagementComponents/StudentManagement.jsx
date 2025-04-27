"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea"; // For address
import api from "@/utils/axios";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import ViewModal from "../ViewModal"; // Import the modal component
const StudentManagement = ({ students }) => {
  // Single state object to hold the form data
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    parentsContact: [""],
    address: "",
    currentStd: "",
    admissionYear: new Date().getFullYear(),
    profileImage: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchedStudent, setSearchedStudent] = useState(students || []);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentIndex, setStudentIndex] = useState(null);
  useEffect(() => {
    setSearchedStudent(students || []);
  }, [students]);
  // Handle changes to the form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add a parent contact field dynamically
  const handleAddParentContact = () => {
    setFormData((prevState) => ({
      ...prevState,
      parentsContact: [...prevState.parentsContact, ""],
    }));
  };
  const handleRemoveParentContact = (index) => {
    const updatedParentsContact = [...formData.parentsContact];
    if (index < 1) {
      toast.error("At least one parent contact is required");
      return;
    }
    updatedParentsContact.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      parentsContact: updatedParentsContact,
    }));
  };
  const handleParentContactChange = (index, value) => {
    const updatedParentsContact = [...formData.parentsContact];
    updatedParentsContact[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      parentsContact: updatedParentsContact,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(
      editingIndex ? "Updating student..." : "Adding student..."
    );
    try {
      if (editingIndex !== null) {
        const response = await api.put(
          `/update/students/${formData._id}`,
          formData
        );
        const updatedStudent = { ...formData };
        updatedStudent[editingIndex] = response.data;
        if (response.status === 200) {
          toast.update(toastId, {
            render: response.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          toast.update(toastId, {
            render: response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      } else {
        // Create a new student object from formData
        const newStudent = { ...formData };

        // Add the new student to the list (can also make an API call to store it)
        const response = await api.post("/create/students", newStudent);

        if (response.status === 200) {
          toast.update(toastId, {
            render: response.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        } else if (response.status === 400) {
          toast.update(toastId, {
            render: response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          toast.update(toastId, {
            render: response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      }

      // Reset form fields after submission
      setFormData({
        studentId: "",
        name: "",
        email: "",
        password: "",
        contact: "",
        parentsContact: [""],
        address: "",
        currentStd: "",
        admissionYear: 2025,
        profileImage: "",
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error adding student:", error);
      const message =
        error.response?.data?.message || "Error submitting student";
      toast.error(message);
    }
  };

  // const handleUpdateStudentDetails = async () => {
  //   try {
  //     if (editingIndex !== null) {
  //       const response = await api.put(
  //         `/update/students/${formData._id}`,
  //         formData
  //       );
  //       const updatedStudent = { ...formData };
  //       updatedStudent[editingIndex] = response.data;
  //       if (response.status === 200) {
  //         toast.success(response.data.message);
  //       } else {
  //         toast.error(response.data.message);
  //       }
  //     }
  //     // Reset form fields after submission
  //     setFormData({
  //       name: "",
  //       email: "",
  //       password: "",
  //       contact: "",
  //       parentsContact: [""],
  //       address: "",
  //       currentStd: "",
  //       admissionYear: new Date().getFullYear(),
  //       profileImage: "",
  //     });
  //     setEditingIndex(null);
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 3000); // Scroll to the top of the page
  //     // Reset the form data
  //   } catch (error) {
  //     console.error("Error updating student:", error);
  //     const message = error.response?.data?.message || "Error updating student";
  //     toast.error(message);
  //   }
  // };
  const handleEditStudent = (index) => {
    // Populate the form with the selected student's data
    // Scroll to the top of the page
    const selected = students[index];
    // Set the form data with the selected student's data
    setFormData({ ...selected });
    setEditingIndex(index);
    formRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" }); // Scroll to the top of the page
  };
  const handleStudentSearch = async (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim(); // always trim first
    const toastId = toast.loading("Searching student...");

    if (trimmedSearchTerm === "") {
      // No API call when search bar is empty
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

      const status = error.response?.status;
      const message =
        error.response?.data?.message || "Error searching student";

      if (status === 404) {
        setSearchedStudent([]);
        toast.update(toastId, {
          render: message,
          type: "info",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          render: message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  };

  const handleDeleteStudent = async (index) => {
    try {
      const studentId = students[index]._id;
      console.log("StudentId" + studentId);

      const response = await api.delete(`/delete/students/${studentId}`);
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      setIsDeleteModalOpen(false); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting student:", error);
      const message = error.response?.data?.message || "Error deleting student";
      toast.error(message);
    }
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Important: prevent page reload
    handleStudentSearch(searchTerm); // Pass the current search term
  };

  const handleViewStudent = (index) => {
    // Handle view action here
    setSelectedStudent(students[index]);
    setIsEditModalOpen(true);
  };

  return (
    <Card
      className="mb-4 shadow-lg hover:shadow-xl transition-shadow"
      ref={formRef}
    >
      <CardContent className="space-y-4 py-4">
        <h2 className="text-xl font-semibold">Add / Update Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 md:grid md:grid-cols-3 gap-10">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="parentsContact">Parents' Contact</Label>
              {formData.parentsContact.map((parentContact, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={parentContact}
                    onChange={(e) =>
                      handleParentContactChange(index, e.target.value)
                    }
                    placeholder={`Parent Contact ${index + 1}`}
                    name={`parentsContact-${index}`}
                    className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <Button
                    type="button"
                    onClick={handleAddParentContact}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    <FaPlus />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveParentContact(index)}
                    className="text-red-500"
                  >
                    <FaTrashAlt />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="currentStd">Current Standard</Label>
              <Input
                id="currentStd"
                name="currentStd"
                value={formData.currentStd}
                onChange={handleChange}
                className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <Label htmlFor="admissionYear">Current Standard</Label>
              <Input
                id="admissionYear"
                name="admissionYear"
                value={formData.admissionYear}
                onChange={handleChange}
                className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="profileImage">Profile Image URL</Label>
              <Input
                id="profileImage"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="mt-4 col-span-3 w-full">
              <div className={`w-full`}>
                {editingIndex !== null ? (
                  <Button type="submit" className="w-full">
                    <FaEdit className="mr-2" /> Update Student
                  </Button>
                ) : (
                  <Button type="submit" className="w-full">
                    <FaPlus className="mr-2" /> Add Student
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardContent className="py-4">
        <h2 className="text-lg font-semibold mb-2">All Students</h2>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Search by Student ID or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 input"
          />
          <Button type="submit">Search</Button>
        </form>

        <Table className="text-start w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Sr.no</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchedStudent.map((student, index) => (
              <TableRow
                key={student.studentId}
                className="hover:bg-gray-200 cursor-pointer transition-colors"
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleViewStudent(index)}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // Handle edit action here
                      handleEditStudent(index);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      setStudentIndex(index); // Set the index of the student to be deleted
                      setIsDeleteModalOpen(true); // Open the modal for confirmation
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ViewModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          student={selectedStudent}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleDeleteStudent(studentIndex)}
          itemType={"Student"}
        />
      </CardContent>
    </Card>
  );
};

export default StudentManagement;
