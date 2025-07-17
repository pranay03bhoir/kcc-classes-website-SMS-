"use client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/utils/axios";
import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaEye, FaSearch, FaUser } from "react-icons/fa";
import AddTeacher from "./modals/AddTeacher";
import EditTeacherDetails from "./modals/EditTeacherDetails";

const DisplayAllTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [viewTeacher, setViewTeacher] = useState(null);
  const [editTeacher, setEditTeacher] = useState(null);
  const [addTeacherOpen, setAddTeacherOpen] = useState(false);

  const refreshTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/teachers");
      if (res.data.success) {
        setTeachers(res.data.teachers);
      } else {
        setError(res.data.message || "Failed to fetch teachers");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching teachers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTeachers();
  }, []);

  // Filter teachers by search
  const filteredTeachers = useMemo(() => {
    if (!search.trim()) return teachers;
    return teachers.filter(
      (t) =>
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.email?.toLowerCase().includes(search.toLowerCase()) ||
        t.teacherId?.toLowerCase().includes(search.toLowerCase())
    );
  }, [teachers, search]);

  return (
    <div className="flex py-10 bg-gray-50 pt-16">
      {/* Main content area - Properly positioned for mobile and desktop */}
      <div className="flex-1 w-full md:ml-16 bg-[#f9fafb] p-4 md:p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Card className="w-full shadow-lg rounded-2xl border border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                All Teachers
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-lg shadow-sm px-4 py-2"
                  onClick={() => setAddTeacherOpen(true)}
                  aria-label="Add Teacher"
                >
                  + Add Teacher
                </Button>
                <div className="relative w-full max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaSearch />
                  </span>
                  <Input
                    type="search"
                    placeholder="Search by name, email, or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {loading ? (
                <div className="flex flex-col justify-center items-center h-40 gap-2">
                  <LoadingSpinner />
                  <span className="text-gray-500 mt-2">
                    Loading teachers...
                  </span>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-32">
                  <Alert
                    variant="destructive"
                    className="w-full max-w-md mx-auto rounded-lg shadow"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              ) : filteredTeachers.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-32 text-gray-500 gap-2">
                  <svg
                    width="64"
                    height="64"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="mb-2"
                  >
                    <circle cx="12" cy="12" r="10" fill="#f3f4f6" />
                    <path
                      d="M8 10h8M8 14h5"
                      stroke="#a0aec0"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>No teachers found.</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-full bg-white rounded-xl shadow-sm">
                    <TableHeader>
                      <TableRow className="bg-blue-50 text-blue-900 font-semibold text-base">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead className="w-16">Avatar</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Teacher ID</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeachers.map((teacher, idx) => (
                        <TableRow
                          key={teacher._id}
                          className="hover:bg-blue-50/40 transition-all group"
                        >
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Avatar className="border-2 border-blue-200 shadow-sm group-hover:border-blue-400 transition-all">
                              <AvatarFallback>
                                {teacher.name ? (
                                  teacher.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                ) : (
                                  <FaUser className="text-gray-400" />
                                )}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            {teacher.name}
                          </TableCell>
                          <TableCell className="text-blue-700">
                            {teacher.email}
                          </TableCell>
                          <TableCell>{teacher.contact}</TableCell>
                          <TableCell>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono">
                              {teacher.teacherId}
                            </span>
                          </TableCell>
                          <TableCell className="flex gap-2 justify-center items-center">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-400 text-blue-700 hover:bg-blue-50 hover:border-blue-600 transition-all flex items-center gap-1"
                              onClick={() => setViewTeacher(teacher)}
                              aria-label="View teacher"
                            >
                              <FaEye /> View
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-green-100 text-green-700 hover:bg-green-200 transition-all flex items-center gap-1"
                              onClick={() => setEditTeacher(teacher)}
                              aria-label="Edit teacher"
                            >
                              <FaEdit /> Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Teacher Modal */}
      <Dialog open={!!viewTeacher} onOpenChange={() => setViewTeacher(null)}>
        <DialogContent className="max-w-md rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
            <DialogDescription>
              View details for{" "}
              <span className="font-semibold">{viewTeacher?.name}</span>
            </DialogDescription>
          </DialogHeader>
          {viewTeacher && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-3">
                <Avatar className="border-2 border-blue-200 shadow-sm">
                  <AvatarFallback>
                    {viewTeacher.name ? (
                      viewTeacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    ) : (
                      <FaUser className="text-gray-400" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-lg">
                    {viewTeacher.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {viewTeacher.teacherId}
                  </div>
                </div>
              </div>
              <div>
                <span className="font-medium">Email:</span> {viewTeacher.email}
              </div>
              <div>
                <span className="font-medium">Contact:</span>{" "}
                {viewTeacher.contact}
              </div>
              {/* Add more fields as needed */}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Modal (integrated) */}
      <Dialog open={!!editTeacher} onOpenChange={() => setEditTeacher(null)}>
        {editTeacher && (
          <div className="max-w-lg w-full mx-auto rounded-2xl shadow-xl p-6 bg-white">
            <EditTeacherDetails
              open={!!editTeacher}
              onClose={() => setEditTeacher(null)}
              teacher={editTeacher}
              onSuccess={refreshTeachers}
            />
          </div>
        )}
      </Dialog>

      {/* Add Teacher Modal */}
      <Dialog open={addTeacherOpen} onOpenChange={setAddTeacherOpen}>
        <DialogContent className="max-w-2xl rounded-2xl shadow-xl p-6">
          <AddTeacher
            onSuccess={() => {
              setAddTeacherOpen(false);
              refreshTeachers();
            }}
            onClose={() => setAddTeacherOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DisplayAllTeachers;
