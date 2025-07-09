"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import Sidebar from "../SideBar";

const StudentAssignment = () => {
  const {
    user: studentData,
    isLoading: authLoading,
    isAuthenticated,
  } = useStudentAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 overflow-hidden">
      {/* Decorative SVG Blob Background */}
      <svg
        className="absolute -top-32 -left-32 w-[600px] h-[600px] opacity-30 blur-2xl pointer-events-none z-0"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="blobGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </radialGradient>
        </defs>
        <path
          d="M421.5,320Q410,390,340,410Q270,430,210,390Q150,350,170,280Q190,210,250,170Q310,130,370,170Q430,210,421.5,320Z"
          fill="url(#blobGradient)"
        />
      </svg>
      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar student={studentData} />
      </div>
      {/* Main content area */}
      <main className="relative flex-1 md:ml-16 flex items-center justify-center z-10">
        <Card style={{ minWidth: 320, maxWidth: 400, textAlign: "center" }}>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <LoadingSpinner size="default" />
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              This feature is under development. Please check back later!
            </CardDescription>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentAssignment;
