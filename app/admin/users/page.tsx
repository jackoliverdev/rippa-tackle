'use client';

import React, { useState } from 'react';
import { AdminUsersList } from '@/components/admin/users/AdminUsersList';
import { AdminUserDetail } from '@/components/admin/users/AdminUserDetail';
import { PageTitle } from '@/components/admin/page-title';
import { Users, Search, RefreshCw } from 'lucide-react';

export interface User {
  id: string;
  email: string;
  firebase_uid: string;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  quiz_summary: string | null;
  partner_first_name: string | null;
  partner_last_name: string | null;
  wedding_date: string | null;
  guest_count: number | null;
  location: string | null;
  max_distance: number | null;
  budget_min: number | null;
  budget_max: number | null;
  preferences: any | null;
  created_at: string;
  updated_at: string;
}

export default function AdminUsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="User Management" 
        description="Manage customers and admin users"
        icon={<Users className="w-8 h-8" />}
        actions={
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="px-4 py-2 pr-10 rounded-md border border-white/20 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-white/70" />
            </div>
            <select
              className="px-4 py-2 rounded-md border border-white/20 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white"
              value={filterRole || ''}
              onChange={(e) => setFilterRole(e.target.value === '' ? null : e.target.value)}
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <button
              onClick={handleRefresh}
              className="p-2 rounded-md text-white bg-blue-600/40 hover:bg-blue-500/60 transition-colors"
              title="Refresh users"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AdminUsersList 
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
            searchQuery={searchQuery}
            filterRole={filterRole}
            refreshTrigger={refreshTrigger}
          />
        </div>
        <div className="lg:col-span-2">
          <AdminUserDetail 
            userId={selectedUserId}
            onUserUpdated={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
} 