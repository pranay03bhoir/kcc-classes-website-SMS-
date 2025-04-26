"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BatchManagement = ({
  students,
  batches,
  selectedStudent,
  setSelectedStudent,
  selectedBatch,
  setSelectedBatch,
  batchName,
  setBatchName,
}) => {
  return (
    <div>
      <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="space-y-4 py-4">
          <h2 className="text-xl font-semibold">Manage Student Batches</h2>
          <Input
            placeholder="Batch Name"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <div className="flex gap-2 mb-4">
            <Button onClick={() => console.log("Create Batch", batchName)}>
              Create Batch
            </Button>
            <Button
              variant="outline"
              onClick={() => console.log("Update Batch", batchName)}
            >
              Update Batch
            </Button>
            <Button
              variant="destructive"
              onClick={() => console.log("Delete Batch", batchName)}
            >
              Delete Batch
            </Button>
          </div>
          <Select
            onValueChange={setSelectedStudent}
            value={selectedStudent}
            className="w-full"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student, index) => (
                <SelectItem key={index} value={student.name}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={setSelectedBatch}
            value={selectedBatch}
            className="w-full"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch, index) => (
                <SelectItem key={index} value={batch.name}>
                  {batch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 flex-wrap mt-4">
            <Button
              onClick={() =>
                console.log("Add to Batch", selectedStudent, selectedBatch)
              }
            >
              Add to Batch
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                console.log(
                  "Update Batch Assignment",
                  selectedStudent,
                  selectedBatch
                )
              }
            >
              Update Batch
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                console.log("Remove from Batch", selectedStudent, selectedBatch)
              }
            >
              Remove from Batch
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <h2 className="text-lg font-semibold mb-2">All Batches</h2>
          <Table className={`text-start`}>
            <TableHeader>
              <TableRow>
                <TableHead>Sr.no</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Batch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((b, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-200 cursor-pointer transition-colors"
                  onClick={() => setSelectedBatch(b.name)}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{b.batchId}</TableCell>
                  <TableCell>{b.name}</TableCell>
                  <TableCell>
                    <Button className={`w-full`} variant="outline">
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button className={`w-full`} variant={`destructive`}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchManagement;
