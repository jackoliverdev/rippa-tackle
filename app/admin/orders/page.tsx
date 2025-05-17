import { PackageOpen, Download } from "lucide-react";
import PageTitle from "@/components/admin/page-title";
import { AdminOrdersList } from "@/components/admin/AdminOrdersList";
import { Button } from "@/components/ui/button";

export default function AdminOrdersPage() {
  return (
    <div>
      <PageTitle 
        title="Orders Management" 
        description="View, filter and manage customer orders"
        icon={<PackageOpen size={24} />}
        actions={
          <Button variant="outline" size="sm" className="gap-2 text-sm bg-white">
            <Download size={16} />
            Export CSV
          </Button>
        }
      />
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <AdminOrdersList />
      </div>
    </div>
  );
} 