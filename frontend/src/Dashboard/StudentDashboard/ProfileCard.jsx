"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function ProfileCard() {
  const student = {
    name: "Aarav Deshmukh",
    email: "aarav@example.com",
    enrollmentNo: "STU123456",
  };

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
          <strong>Enrollment No:</strong> {student.enrollmentNo}
        </p>
      </CardContent>
    </Card>
  );
}
