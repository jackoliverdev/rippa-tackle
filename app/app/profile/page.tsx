import { ProfileForm } from "@/components/app/profile/ProfileForm";
import { ProfileAvatar } from "@/components/app/profile/ProfileAvatar";
import { LoyaltyPoints } from "@/components/app/profile/LoyaltyPoints";
import { RecentOrders } from "@/components/app/profile/RecentOrders";
import PageTitle from "@/components/admin/page-title";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageTitle 
        title="My Rippa Tackle Account" 
        description="Manage your profile and view your fishing activity"
        icon={<User size={24} />}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar with avatar and loyalty points */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Your Profile</h2>
            <ProfileAvatar />
          </div>
          <LoyaltyPoints />
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 text-blue-800">Angler Details</h2>
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
} 