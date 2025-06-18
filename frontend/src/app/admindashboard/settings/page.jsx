import AdminDetailsUpdate from "@/Dashboard/AdminDashboard/AdminDetailsUpdate";
import Sidebar from "@/Dashboard/AdminDashboard/SideBar";
import AdminRoute from "@/components/AdminRoute";

const page = () => {
  return (
    <AdminRoute>
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="w-full md:w-64 fixed h-full z-30">
          <Sidebar />
        </div>
        <div className="flex-1 md:ml-64 bg-[#f9fafb] p-4 md:p-6 overflow-y-auto">
          <AdminDetailsUpdate />
        </div>
      </div>
    </AdminRoute>
  );
};

export default page;
