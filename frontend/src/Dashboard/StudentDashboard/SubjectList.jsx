"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
export default function SubjectList() {
  const subjects = ["Math", "Science", "English", "History"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subjects</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-1">
          {subjects.map((subj, idx) => (
            <li key={idx}>{subj}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
