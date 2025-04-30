"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ViewModal from "@/Dashboard/AdminDashboard/components/ViewModal";
import { useState } from "react";
export default function ProfileCard({ student }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Name:</strong> {student.name}
        </p>
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        <p>
          <strong>Enrollment No:</strong> {student.studentId}
        </p>
      </CardContent>
      <div className="flex justify-between items-center p-2">
        <Button className={`w-26 `} onClick={() => setIsOpen(true)}>
          View More
        </Button>
        <ViewModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          student={student}
        />
      </div>
    </Card>
  );
}
