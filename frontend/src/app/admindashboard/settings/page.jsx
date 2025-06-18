import AdminDetailsUpdate from "@/Dashboard/AdminDashboard/AdminDetailsUpdate";
import Sidebar from "@/Dashboard/AdminDashboard/SideBar";
import AdminRoute from "@/components/AdminRoute";

const page = () => {
  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50 pt-16">
        {/* Sidebar - Fixed on desktop, overlay on mobile */}
        <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
          <Sidebar />
        </div>

        {/* Main content area - Properly positioned for mobile and desktop */}
        <div className="flex-1 w-full md:ml-16 bg-[#f9fafb] p-4 md:p-6 overflow-y-auto">
          <AdminDetailsUpdate />
        </div>
      </div>
    </AdminRoute>
  );
};

export default page;
