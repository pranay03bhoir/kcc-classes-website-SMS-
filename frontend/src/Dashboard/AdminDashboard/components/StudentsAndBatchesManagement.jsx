"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, RefreshCw, Search } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import BatchManagement from "./StudentManagementComponents/BatchManagement";
import CourseManagement from "./StudentManagementComponents/CourseManagement";
import StudentManagement from "./StudentManagementComponents/StudentManagement";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const StudentsAndBatchesManagement = ({
  students,
  courses,
  batches,
  teachers,
  isLoading = false,
  error = null,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [onRefresh]);

  const filteredData = {
    students: students?.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    courses: courses?.filter((course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    batches: batches?.filter((batch) =>
      batch.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message ||
            "An error occurred while loading the data. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink isCurrentPage>
              Student & Batch Management
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-red-600"
        >
          Student & Batch Management
        </motion.h1>

        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          aria-label="Refresh data"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search across all items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          aria-label="Search items"
        />
      </div>

      <Tabs
        defaultValue="students"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
        aria-label="Management sections"
      >
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="students" aria-label="Students management">
            Students {students && `(${filteredData.students.length})`}
          </TabsTrigger>
          <TabsTrigger value="courses" aria-label="Courses management">
            Courses {courses && `(${filteredData.courses.length})`}
          </TabsTrigger>
          <TabsTrigger value="batches" aria-label="Batches management">
            Batches {batches && `(${filteredData.batches.length})`}
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-red-600" />
            </div>
          ) : (
            <>
              {activeTab === "students" && (
                <TabsContent value="students" forceMount>
                  <motion.div
                    key="students"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <StudentManagement
                      students={filteredData.students}
                      isLoading={isLoading}
                    />
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "courses" && (
                <TabsContent value="courses" forceMount>
                  <motion.div
                    key="courses"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <CourseManagement
                      students={filteredData.students}
                      courses={filteredData.courses}
                      isLoading={isLoading}
                    />
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "batches" && (
                <TabsContent value="batches" forceMount>
                  <motion.div
                    key="batches"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <BatchManagement
                      students={filteredData.students}
                      batches={filteredData.batches}
                      teachers={teachers}
                      subjects={filteredData.courses}
                      isLoading={isLoading}
                    />
                  </motion.div>
                </TabsContent>
              )}
            </>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

StudentsAndBatchesManagement.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
    })
  ),
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  batches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  teachers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRefresh: PropTypes.func,
};

StudentsAndBatchesManagement.defaultProps = {
  students: [],
  courses: [],
  batches: [],
  teachers: [],
  isLoading: false,
  error: null,
  onRefresh: null,
};

export default StudentsAndBatchesManagement;
