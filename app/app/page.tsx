"use client";

import { CustomerDashboardDemo } from "@/components/app/dashboard/demo";
import { PageTitle } from "@/components/admin/page-title";
import { Home } from "lucide-react";

const ApplicationPage = () => {
  return (
    <div className="space-y-6">
      <PageTitle 
        title="Customer Dashboard" 
        description="Welcome to your Rippa Tackle account - manage orders and track your loyalty points"
        icon={<Home className="w-8 h-8" />}
      />
      
      <CustomerDashboardDemo />
    </div>
  );
};
export default ApplicationPage;
