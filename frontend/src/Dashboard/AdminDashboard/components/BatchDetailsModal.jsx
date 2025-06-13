import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircleIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  Loader2Icon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

const BatchDetailsModal = ({
  open,
  onClose,
  batch,
  subjects = {},
  teachers = {},
  students = [],
  isLoading = false,
}) => {
  if (!batch) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-xl p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-500 to-green-600 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-semibold">
                {batch.name}
              </DialogTitle>
              <Badge className={`${getStatusColor(batch.status)} px-3 py-1`}>
                {batch.status || "Active"}
              </Badge>
            </div>
          </DialogHeader>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <p className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{batch.timings}</span>
            </p>
            <p className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>{batch.duration || "Not specified"}</span>
            </p>
          </div>
        </div>

        {/* Content Section */}
        <ScrollArea className="h-[60vh]">
          <div className="p-6 space-y-6">
            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <BookOpenIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Class & Subject</span>
                </div>
                <p className="font-semibold">{batch.classStd}</p>
                <p className="text-sm text-gray-600">
                  {subjects?.name || "Not assigned"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Teacher</span>
                </div>
                <p className="font-semibold">
                  {batch.teacherId.name || "Not Assigned"}
                </p>
                <p
                  className="text-sm text-gray-600 truncate max-w-full"
                  title={batch.teacherId.email || ""}
                >
                  {batch.teacherId.email || ""}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <UsersIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Students</span>
                </div>
                <p className="font-semibold">{students.length}</p>
                <p className="text-sm text-gray-600">
                  Capacity: {batch.capacity || "Unlimited"}
                </p>
              </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" /> Student List
                </h3>
              </div>
              <div className="divide-y">
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <div
                      key={student._id}
                      className="p-4 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student?.profileImage} />
                          <AvatarFallback>{student?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student?.name}</p>
                          <p className="text-sm text-gray-500">
                            {student?.studentId || "No Roll Number"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {student?.attendance[student?.attendance?.length - 1]
                          ?.status || "Regular"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <AlertCircleIcon className="w-5 h-5 mx-auto mb-2" />
                    <p>No students enrolled in this batch</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            {batch.description && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600">{batch.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="default">Export Details</Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BatchDetailsModal;
