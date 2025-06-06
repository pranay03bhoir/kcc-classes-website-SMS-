"use client";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/NavigationBar/NavBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Lazy load components for better performance
const CoursesSectionOne = lazy(() =>
  import("@/components/CoursesExploration/CoursesSectionOne")
);
const CourseCategories = lazy(() =>
  import("@/components/CoursesExploration/CourseCategories")
);
const EnrollInCourses = lazy(() =>
  import("@/components/CoursesExploration/EnrollInCourses")
);
const MiddleSchoolProgram = lazy(() =>
  import("@/components/CoursesExploration/MiddleSchoolProgram")
);
const HighSchoolProgram = lazy(() =>
  import("@/components/CoursesExploration/HighSchoolProgram")
);
const HigherSecondaryProgram = lazy(() =>
  import("@/components/CoursesExploration/HigherSecondaryProgram")
);
const TeachingMethodology = lazy(() =>
  import("@/components/CoursesExploration/TeachingMethodology")
);
const StudentEnroll = lazy(() =>
  import("@/components/CoursesExploration/StudentEnroll")
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="p-4 m-4 bg-red-50 rounded-lg">
    <h2 className="text-lg font-semibold text-red-800">
      Something went wrong:
    </h2>
    <pre className="mt-2 text-sm text-red-600">{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Try again
    </button>
  </div>
);

// Loading component wrapper
const LoadingWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

const Courses = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </nav>

      <main className="flex-grow">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LoadingWrapper>
            <CoursesSectionOne />
          </LoadingWrapper>

          <section className="pt-16" aria-labelledby="course-categories">
            <LoadingWrapper>
              <CourseCategories />
            </LoadingWrapper>
          </section>

          <section className="pt-16" aria-labelledby="enroll-courses">
            <LoadingWrapper>
              <EnrollInCourses />
            </LoadingWrapper>
          </section>

          <section className="pt-16" aria-labelledby="middle-school">
            <LoadingWrapper>
              <MiddleSchoolProgram />
            </LoadingWrapper>
          </section>

          <section className="pt-16" aria-labelledby="high-school">
            <LoadingWrapper>
              <HighSchoolProgram />
            </LoadingWrapper>
          </section>

          <section className="pt-16" aria-labelledby="higher-secondary">
            <LoadingWrapper>
              <HigherSecondaryProgram />
            </LoadingWrapper>
          </section>

          <section className="pt-16" aria-labelledby="teaching-methodology">
            <LoadingWrapper>
              <TeachingMethodology />
            </LoadingWrapper>
          </section>

          <section className="pt-16" aria-labelledby="student-enroll">
            <LoadingWrapper>
              <StudentEnroll />
            </LoadingWrapper>
          </section>
        </ErrorBoundary>
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Courses;
