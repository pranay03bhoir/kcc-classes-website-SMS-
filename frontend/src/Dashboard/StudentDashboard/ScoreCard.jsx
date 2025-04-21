"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
export default function ScoreCard() {
  const scores = [
    { subject: "Math", score: 92 },
    { subject: "Science", score: 88 },
    { subject: "English", score: 85 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {scores.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span>{item.subject}</span>
            <span className="font-medium">{item.score}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
