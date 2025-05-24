"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function MarkAttendanceModal({
  open,
  onClose,
  students,
  setStudents,
}) {
  const handleStatusChange = (index, value) => {
    const updated = [...students];
    updated[index].status = value;
    setStudents(updated);
  };

  const handleNoteChange = (index, value) => {
    const updated = [...students];
    updated[index].notes = value;
    setStudents(updated);
  };

  const handleSave = () => {
    console.log("Saved attendance:", students);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Mark Attendance - May 15, 2023
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-gray-500 text-xs border-b">
              <tr>
                <th className="text-left py-2">STUDENT</th>
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">BATCH</th>
                <th className="text-left py-2">STATUS</th>
                <th className="text-left py-2">NOTES</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="border-b py-2">
                  <td className="flex items-center gap-3 py-3">
                    <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium text-gray-700">
                      {student.initials}
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                    </div>
                  </td>
                  <td>{student.id}</td>
                  <td>
                    <span className="text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-1">
                      {student.batch}
                    </span>
                  </td>
                  <td>
                    <Select
                      value={student.status}
                      onValueChange={(val) => handleStatusChange(index, val)}
                    >
                      <SelectTrigger className="w-[120px] text-sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Late">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td>
                    <Input
                      value={student.notes}
                      onChange={(e) => handleNoteChange(index, e.target.value)}
                      placeholder="Add notes..."
                      className="w-full text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Attendance</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
