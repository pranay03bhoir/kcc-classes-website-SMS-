import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "../SideBar";
import AddTeacherToCourse from "./components/AddTeacherToCourse";
import DisplayAllTeachers from "./components/DisplayAllTeachers";
import RemoveTeacherFromCourse from "./components/RemoveTeacherFromCourse";

const Teacher = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto min-h-screen">
        <Sidebar />
      </div>
      <div className="grid grid-cols-1 md:mx-auto">
        <div>
          <DisplayAllTeachers />
        </div>
        <main className="flex-1 flex justify-center items-start p-2 sm:p-4 md:p-10 bg-gray-50">
          <div className="w-full max-w-full sm:max-w-2xl md:max-w-4xl">
            <Tabs defaultValue="add" className="w-full">
              <TabsList className="mb-4 sm:mb-6 flex gap-x-2 bg-transparent p-0 border-b border-gray-200 overflow-x-auto whitespace-nowrap custom-scrollbar-hide px-2 sm:-mx-4 sm:px-4">
                <TabsTrigger
                  value="add"
                  className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 bg-transparent rounded-none shadow-none transition-colors min-w-[90px] sm:min-w-[110px] md:min-w-max"
                >
                  Add Teacher to Course
                </TabsTrigger>
                <TabsTrigger
                  value="remove"
                  className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 bg-transparent rounded-none shadow-none transition-colors min-w-[90px] sm:min-w-[110px] md:min-w-max"
                >
                  Remove Teacher from Course
                </TabsTrigger>
              </TabsList>
              <TabsContent value="add">
                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 md:p-8 min-h-[200px] sm:min-h-[300px] w-full overflow-x-auto">
                  <AddTeacherToCourse />
                </div>
              </TabsContent>
              <TabsContent value="remove">
                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 md:p-8 min-h-[200px] sm:min-h-[300px] w-full overflow-x-auto">
                  <RemoveTeacherFromCourse />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Teacher;
