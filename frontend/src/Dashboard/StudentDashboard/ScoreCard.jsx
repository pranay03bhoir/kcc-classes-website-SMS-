"use client";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaChartBar, FaGraduationCap } from "react-icons/fa";

export default function ScoreCard({ student }) {
  // Extract scores from student data
  const scores = student?.scores || [];

  // Color mapping for different subjects
  const subjectColors = {
    Mathematics: "from-blue-500 to-blue-600",
    Science: "from-green-500 to-green-600",
    English: "from-purple-500 to-purple-600",
    History: "from-orange-500 to-orange-600",
    Geography: "from-red-500 to-red-600",
    Physics: "from-indigo-500 to-indigo-600",
    Chemistry: "from-teal-500 to-teal-600",
    Biology: "from-emerald-500 to-emerald-600",
    "Computer Science": "from-cyan-500 to-cyan-600",
    Economics: "from-pink-500 to-pink-600",
    Literature: "from-yellow-500 to-yellow-600",
    default: "from-gray-500 to-gray-600",
  };

  const getGradeColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGrade = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    return "D";
  };

  // Process scores to group by subject and calculate averages
  const processScores = () => {
    const subjectScores = {};

    scores.forEach((score) => {
      const subjectName = score.subject.name;
      if (!subjectName) return;

      if (!subjectScores[subjectName]) {
        subjectScores[subjectName] = [];
      }
      subjectScores[subjectName].push(score.score);
    });

    // Calculate average for each subject
    return Object.entries(subjectScores).map(([subject, scoreList]) => ({
      subject,
      score: Math.round(
        scoreList.reduce((sum, score) => sum + score, 0) / scoreList.length
      ),
      color: subjectColors[subject] || subjectColors.default,
    }));
  };

  const processedScores = processScores();
  const hasScores = processedScores.length > 0;

  // Calculate overall average
  const overallAverage = hasScores
    ? Math.round(
        processedScores.reduce((acc, curr) => acc + curr.score, 0) /
          processedScores.length
      )
    : 0;

  return (
    <div className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
            <FaChartBar className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">
            Academic Performance
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasScores ? (
          <div className="text-center py-8">
            <FaGraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No scores available yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Your academic performance will appear here once scores are added
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {processedScores.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FaGraduationCap className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {item.subject}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg font-bold ${getGradeColor(
                          item.score
                        )}`}
                      >
                        {item.score}%
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${getGradeColor(
                          item.score
                        )} bg-opacity-10 ${getGradeColor(item.score).replace(
                          "text-",
                          "bg-"
                        )}`}
                      >
                        {getGrade(item.score)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Average Score
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {overallAverage}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 font-medium">
                    Overall Grade
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {getGrade(overallAverage)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </div>
  );
}
