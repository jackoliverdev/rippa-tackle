import { LayoutDashboard } from "lucide-react";
import PageTitle from "@/components/admin/page-title";
import { DashboardDemo } from "@/components/admin/dashboard/demo";

const AdminDashboardPage = () => {
  return (
    <div>
      <PageTitle 
        title="Admin Dashboard" 
        description="Manage your products, orders, and inventory from one centralised control panel."
        icon={<LayoutDashboard className="w-6 h-6" />}
      />
      
      <DashboardDemo />
    </div>
  );
};

export default AdminDashboardPage; 