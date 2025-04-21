"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
export default function CourseList() {
  const courses = [
    { name: "Physics - XI", teacher: "Mr. Sharma" },
    { name: "Mathematics - XII", teacher: "Ms. Joshi" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrolled Courses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {courses.map((course, idx) => (
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
