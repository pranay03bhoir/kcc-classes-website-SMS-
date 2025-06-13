"use client";
import CourseCard from "@/components/CardComponent/CourseCard";
import CustomHeading from "@/components/Heading/CustomHeading";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import api from "@/utils/common-axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

const COURSE_CATEGORIES = {
  ALL: "ALL Subjects",
  MIDDLE_SCHOOL: "Middle School",
  HIGH_SCHOOL: "High School",
  SCIENCE: "Science",
  COMMERCE: "Commerce",
};

const COURSES_PER_PAGE = 6;

const EnrollInCourses = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isFiltering, setIsFiltering] = useState(false);

  const fetchCourses = async ({ pageParam = 1 }) => {
    try {
      const response = await api.get("/get/courses", {
        params: {
          page: pageParam,
          limit: COURSES_PER_PAGE,
          category:
            selectedCategory === "ALL"
              ? undefined
              : COURSE_CATEGORIES[selectedCategory],
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch courses");
    }
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["courses", selectedCategory],
    queryFn: fetchCourses,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  useEffect(() => {
    setIsFiltering(true);
    refetch().finally(() => setIsFiltering(false));
  }, [selectedCategory, refetch]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  if (status === "error") {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600">
          Error loading courses
        </h2>
        <p className="text-gray-600 mt-2">{error.message}</p>
        <Button
          onClick={() => refetch()}
          className="mt-4 bg-blue-600 hover:bg-blue-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-20"
          >
            <CustomHeading
              title="Our Primary Course Subjects"
              borderColour="border-white rounded-full"
              padding="py-14"
            />
          </motion.div>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto mt-6 mb-12 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover our carefully designed curriculum that helps students excel
            in academics and build a strong foundation for future success.
          </motion.p>
        </motion.div>

        {/* Category Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {Object.entries(COURSE_CATEGORIES).map(([key, title]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange(key)}
              className={`px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-200 shadow-sm
                ${
                  selectedCategory === key
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              disabled={isFiltering}
            >
              {title}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading State */}
        {isFiltering ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {data?.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.courses.map((course) => (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <CourseCard
                        title={course.name}
                        description={course.description}
                        duration={course.duration}
                        category={course.category}
                        classesPerWeek={course.classesPerWeek}
                        gradeLevel={course.gradeLevel}
                        rating={course.rating}
                        buttonText="Enroll Now"
                        isPopular={course.isPopular}
                        iconUrl={course.imageUrl}
                      />
                    </motion.div>
                  ))}
                </React.Fragment>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Load More Button */}
        {hasNextPage && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner className="w-5 h-5" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Load More Courses"
              )}
            </Button>
          </motion.div>
        )}

        {/* No Results State */}
        {!isFiltering && data?.pages[0]?.courses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500">
              Try selecting a different category or check back later for new
              courses.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default EnrollInCourses;
