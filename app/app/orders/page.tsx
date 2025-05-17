import { Package } from "lucide-react";
import PageTitle from "@/components/admin/page-title";
import { OrdersList } from "@/components/app/orders/OrdersList";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageTitle 
        title="My Orders" 
        description="View and manage your Rippa Tackle orders"
        icon={<Package size={24} />}
      />
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <OrdersList />
      </div>
    </div>
  );
}
 