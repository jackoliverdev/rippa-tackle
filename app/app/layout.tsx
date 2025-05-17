import { ReactNode } from "react";
import DashboardSidebar from "@/components/app/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="pl-72 pr-8 pt-8 pb-8 min-h-screen transition-all">
        <div className="max-w-full ml-2">{children}</div>
      </main>
    </div>
  );
}
