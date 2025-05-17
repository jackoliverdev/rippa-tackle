"use client";

import Link from "next/link";
import { Home, Users, Settings, LogOut, Package, ShoppingCart, BarChart2, Video, FileText, Fish } from "lucide-react";
import { useUser } from "reactfire";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { getAuth, signOut } from "firebase/auth";

export default function AdminSidebar() {
  const pathname = usePathname() || "";
  const { data: user } = useUser();
  const router = useRouter();

  const handleSwitchDashboard = () => {
    if (typeof window !== "undefined") {
      if (window.location.pathname.startsWith("/admin")) {
        router.push("/app");
      } else {
        router.push("/admin");
      }
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // Clear any local storage items if needed
      localStorage.clear();
      // After successful logout, redirect to homepage
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-950 to-blue-900 border-r border-blue-800/30 flex flex-col py-8 px-4 shadow-lg backdrop-blur-sm z-30">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="bg-white rounded-full shadow-md p-1">
          <Image src="/rippa_logo.png" alt="Rippa Tackle Logo" width={32} height={32} className="rounded-full" />
        </div>
        <span className="font-heading text-xl font-bold text-white tracking-tight">
          Rippa <span className="text-blue-400">Admin</span>
        </span>
      </div>
      <nav className="flex-1 space-y-2">
        <SidebarLink href="/admin" icon={<Home className="w-5 h-5" />}>Dashboard</SidebarLink>
        <SidebarLink href="/admin/products" icon={<Package className="w-5 h-5" />}>Products</SidebarLink>
        <SidebarLink href="/admin/orders" icon={<ShoppingCart className="w-5 h-5" />}>Orders</SidebarLink>
        <SidebarLink href="/admin/fishing-assistant" icon={<Fish className="w-5 h-5" />}>Fishing Assistant</SidebarLink>
        <SidebarLink href="/admin/videos" icon={<Video className="w-5 h-5" />}>Videos</SidebarLink>
        <SidebarLink href="/admin/blogs" icon={<FileText className="w-5 h-5" />}>Blogs</SidebarLink>
        <SidebarLink href="/admin/users" icon={<Users className="w-5 h-5" />}>Users</SidebarLink>
      </nav>
      <div className="mt-auto pt-8 space-y-4 flex flex-col items-start">
        {user?.email?.toLowerCase() === "jackoliverdev@gmail.com" && (
          <button
            onClick={handleSwitchDashboard}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-100 bg-blue-800/60 hover:bg-blue-700/60 font-medium transition-colors border border-blue-700/50 w-full"
            title={pathname.startsWith("/admin") ? "Switch to User Dashboard" : "Switch to Admin Dashboard"}
          >
            {pathname.startsWith("/admin") ? (
              <>
                <Home className="w-5 h-5" />
                <span>User Dashboard</span>
              </>
            ) : (
              <>
                <Home className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </>
            )}
          </button>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-200 hover:bg-blue-800/60 hover:text-white font-medium transition-colors w-full text-left"
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
      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
        isActive ? "bg-blue-800/80 text-white shadow-sm" : "text-blue-100 hover:bg-blue-800/60 hover:text-white"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
} 