"use client";

import Link from "next/link";
import { Home, User, Calendar, BarChart2, Settings, LogOut } from "lucide-react";
import { useUser } from "reactfire";
import { useRouter, usePathname } from "next/navigation";

export default function VenueSidebar() {
  const pathname = usePathname() || "";
  const { data: user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    // You may want to use signOut from firebase/auth here if needed
    router.push("/");
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#F7E6EB] border-r border-[#D6CFC7] flex flex-col py-8 px-4 shadow-lg z-30">
      <div className="mb-10 flex items-center gap-3 px-2">
        <img src="/venueverselogo.png" alt="The Venue Verse Logo" className="w-8 h-8" />
        <span className="font-heading text-xl font-bold text-[#2D2D2D] tracking-tight">The Venue Verse</span>
      </div>
      <nav className="flex-1 space-y-2">
        <SidebarLink href="/venues" icon={<Home className="w-5 h-5" />}>Dashboard</SidebarLink>
        <SidebarLink href="/venues/venue-profile" icon={<User className="w-5 h-5" />}>Venue Profile</SidebarLink>
        <SidebarLink href="/venues/bookings" icon={<Calendar className="w-5 h-5" />}>Bookings</SidebarLink>
        <SidebarLink href="/venues/analytics" icon={<BarChart2 className="w-5 h-5" />}>Analytics</SidebarLink>
        <SidebarLink href="/venues/settings" icon={<Settings className="w-5 h-5" />}>Settings</SidebarLink>
      </nav>
      <div className="mt-auto pt-8 space-y-4 flex flex-col items-start">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#2D2D2D] hover:bg-[#8CA77A]/20 hover:text-[#8CA77A] font-medium transition-colours w-full text-left"
        >
          <LogOut className="w-5 h-5" /> Log Out
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colours text-[#2D2D2D] ${
        isActive ? "bg-[#E3BFCB] text-[#B76E79]" : "hover:bg-[#F7E6EB] hover:text-[#B76E79]"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
} 