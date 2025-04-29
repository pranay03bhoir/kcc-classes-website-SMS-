"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function CourseList({ student }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrolled Courses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {student.map((course, idx) => (
          <div key={idx}>
            <p className="font-medium">{course.name}</p>
            <p className="text-sm text-muted-foreground">
              Teacher: {course.teacher}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
