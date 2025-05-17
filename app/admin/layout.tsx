import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="pl-72 pr-8 pt-8 pb-8 min-h-screen transition-all">
        <div className="max-w-full">{children}</div>
      </main>
    </div>
  );
} 