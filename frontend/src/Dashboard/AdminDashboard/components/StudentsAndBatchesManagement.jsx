"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import BatchManagement from "./StudentManagementComponents/BatchManagement";
import CourseManagement from "./StudentManagementComponents/CourseManagement";
import StudentManagement from "./StudentManagementComponents/StudentManagement";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const StudentsAndBatchesManagement = ({ students, courses, batches }) => {
  const [activeTab, setActiveTab] = useState("students");

  return (
    <div className="p-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-6 text-center text-red-600"
      >
        Student & Batch Management
      </motion.h1>

      <Tabs
        defaultValue="students"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "students" && (
            <TabsContent value="students" forceMount>
              <motion.div
                key="students"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <StudentManagement students={students} />
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
                <CourseManagement students={students} courses={courses} />
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
                <BatchManagement students={students} batches={batches} />
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default StudentsAndBatchesManagement;
