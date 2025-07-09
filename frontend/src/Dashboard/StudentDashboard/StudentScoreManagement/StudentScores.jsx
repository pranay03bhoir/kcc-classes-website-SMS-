"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/utils/student-axios";
import { useEffect, useState } from "react";
import { FaBookOpen, FaRegSmileBeam } from "react-icons/fa";
import Sidebar from "../SideBar";

const StudentScores = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const scoresPerPage = 10;

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/get/student/scores");
        if (res.data.success) {
          setStudent({ scores: res.data.scores });
        } else {
          setError("Failed to fetch scores.");
        }
      } catch (err) {
        setError("Failed to fetch scores.");
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading scores...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  // Minimalistic custom rendering
  // Pagination logic
  const scores = student && student.scores ? student.scores : [];
  const totalPages = Math.ceil(scores.length / scoresPerPage);
  const paginatedScores = scores.slice(
    (currentPage - 1) * scoresPerPage,
    currentPage * scoresPerPage
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Sidebar student={student} />
      <main className="flex-1 ml-0 md:ml-16 p-2 sm:p-6 transition-all duration-300 w-full">
        <div className="w-full max-w-full sm:max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-2">
            <div>
              <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                <FaBookOpen className="text-blue-500" /> My Scores
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Track your latest exam performance. Each score is visualized for
                quick insights.
              </p>
            </div>
            {scores.length > 0 && (
              <div className="flex gap-4 mt-2 sm:mt-0">
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-gray-400">Total Exams</span>
                  <span className="font-semibold text-blue-600">
                    {scores.length}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-gray-400">Avg. Score</span>
                  <span className="font-semibold text-purple-600">
                    {(
                      scores.reduce((acc, s) => acc + (s.score || 0), 0) /
                      (scores.length || 1)
                    ).toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <Card className="bg-white/80 shadow-xl border-0 rounded-2xl px-2 sm:px-0">
            <CardContent className="px-0 pt-6 pb-4">
              {scores.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption className="text-gray-400">
                      Your latest exam scores
                    </TableCaption>
                    <TableHeader>
                      <TableRow className="bg-blue-50/60">
                        <TableHead>Subject</TableHead>
                        <TableHead>Exam</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Max</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedScores.map((score, idx) => {
                        const percent = score.maxScore
                          ? (score.score / score.maxScore) * 100
                          : score.score ?? 0;
                        const isHigh = percent >= 80;
                        const isLow = percent < 40;
                        return (
                          <TableRow
                            key={idx + (currentPage - 1) * scoresPerPage}
                            className="hover:bg-blue-50/40 transition-colors group"
                          >
                            <TableCell className="font-medium flex items-center gap-2 min-w-[120px]">
                              <FaBookOpen className="text-purple-400 group-hover:text-purple-600 transition-colors" />
                              {score.subjectName || "-"}
                            </TableCell>
                            <TableCell className="min-w-[90px]">
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 border-0"
                              >
                                {score.examType || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell className="min-w-[120px]">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-semibold ${
                                    isHigh
                                      ? "text-green-600"
                                      : isLow
                                      ? "text-red-500"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {score.score ?? "-"}
                                </span>
                                <div className="relative group">
                                  <Progress
                                    value={percent}
                                    className="w-16 sm:w-20 h-2 bg-gray-200 rounded-full"
                                  />
                                  <span className="absolute left-1/2 -translate-x-1/2 -top-7 opacity-0 group-hover:opacity-100 text-xs bg-white px-2 py-1 rounded shadow border text-gray-600 transition-all pointer-events-none">
                                    {percent.toFixed(1)}%
                                  </span>
                                </div>
                                {isHigh && (
                                  <Badge
                                    variant="default"
                                    className="bg-green-100 text-green-700 border-0"
                                  >
                                    Top
                                  </Badge>
                                )}
                                {isLow && (
                                  <Badge
                                    variant="destructive"
                                    className="bg-red-100 text-red-700 border-0"
                                  >
                                    Low
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[70px]">
                              {score.maxScore ?? "100"}
                            </TableCell>
                            <TableCell className="min-w-[100px]">
                              {score.date
                                ? new Date(score.date).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )
                                : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        className="p-2 rounded-full border bg-white shadow hover:bg-blue-100 disabled:opacity-50 transition-all"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        <span className="text-lg">&lt;</span>
                      </button>
                      <span className="text-xs text-gray-600 px-2">
                        Page{" "}
                        <span className="font-semibold text-blue-700">
                          {currentPage}
                        </span>{" "}
                        of {totalPages}
                      </span>
                      <button
                        className="p-2 rounded-full border bg-white shadow hover:bg-blue-100 disabled:opacity-50 transition-all"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                      >
                        <span className="text-lg">&gt;</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                  <FaRegSmileBeam className="text-5xl mb-2 text-blue-300" />
                  <span className="text-lg font-medium">
                    No scores available yet.
                  </span>
                  <span className="text-xs text-gray-400">
                    Keep up the good work and check back after your next exam!
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentScores;
