import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { User } from '@/app/admin/users/page';

interface AdminUsersListProps {
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  searchQuery: string;
  filterRole: string | null;
  refreshTrigger: number;
}

export const AdminUsersList: React.FC<AdminUsersListProps> = ({
  selectedUserId,
  onSelectUser,
  searchQuery,
  filterRole,
  refreshTrigger,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (res.ok) setUsers(data);
        else setError(data.error || 'Failed to fetch users');
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [refreshTrigger]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  const getUserDisplayName = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) {
      return user.first_name;
    }
    return user.email || 'Unnamed User';
  };

  const getProfileImageUrl = (user: User) => {
    if (!user.profile_image_url) {
      return undefined;
    }
    return user.profile_image_url;
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    // Apply role filter
    if (filterRole && user.role !== filterRole) {
      return false;
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = getUserDisplayName(user).toLowerCase();
      const email = user.email.toLowerCase();
      
      return name.includes(query) || email.includes(query);
    }

    return true;
  });

  return (
    <div className="border rounded-lg overflow-hidden bg-white h-full">
      <div className="bg-blue-900 py-3 px-4 font-medium flex justify-between items-center text-white">
        <span>User Directory</span>
        <span className="text-sm">{filteredUsers.length} users</span>
      </div>
      
      {isLoading ? (
        <div className="p-6 text-center text-muted-foreground">Loading users...</div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          {users.length > 0 ? 'No users match your filters' : 'No users found'}
        </div>
      ) : (
        <div className="divide-y max-h-[650px] overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedUserId === user.id ? 'bg-blue-50' : ''}`}
              onClick={() => onSelectUser(user.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {user.profile_image_url ? (
                    <img
                      src={getProfileImageUrl(user)}
                      alt={getUserDisplayName(user)}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-blue-100 text-blue-800 font-semibold text-lg">
                      {getUserDisplayName(user).charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{getUserDisplayName(user)}</div>
                  <div className="text-sm text-gray-500 truncate">{user.email}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {user.role || 'user'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Registered: {formatDate(user.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 