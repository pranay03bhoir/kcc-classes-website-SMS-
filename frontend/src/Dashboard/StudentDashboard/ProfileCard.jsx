"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function ProfileCard({ student }) {
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
        <Button className={`w-26 `}>View More</Button>
      </div>
    </Card>
  );
}
