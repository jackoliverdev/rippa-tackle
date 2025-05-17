import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { User } from '@/app/admin/users/page';

interface AdminUserDetailProps {
  userId: string | null;
  onUserUpdated: () => void;
}

export const AdminUserDetail: React.FC<AdminUserDetailProps> = ({
  userId,
  onUserUpdated,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetPasswordStatus, setResetPasswordStatus] = useState<{ loading: boolean; message: string | null; error: string | null }>({
    loading: false,
    message: null,
    error: null,
  });
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
  });

  // Fetch user data when userId changes
  useEffect(() => {
    if (!userId) {
      setUser(null);
      setEditMode(false);
      return;
    }

    const fetchUserDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          // Initialize form data
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            role: data.role || 'user',
          });
        } else {
          setError(data.error || 'Failed to fetch user details');
        }
      } catch (err) {
        setError('Failed to fetch user details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Prepare user data
      const userData = {
        id: user.id,
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        email: formData.email,
        role: formData.role,
      };

      // Preserve existing profile data if user has a profile
      let profileData = null;
      if (user.profile) {
        profileData = {
          id: user.profile.id,
          user_id: user.id,
        };
      }

      // Send update request
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userData, profile: profileData }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update user');
      }

      // Update successful
      onUserUpdated();
      setEditMode(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user || !user.email) return;
    
    setResetPasswordStatus({
      loading: true,
      message: null,
      error: null,
    });
    
    try {
      const res = await fetch('/api/admin/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email,
          firebase_uid: user.firebase_uid
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send password reset');
      }
      
      setResetPasswordStatus({
        loading: false,
        message: 'Password reset email sent successfully',
        error: null,
      });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setResetPasswordStatus(prev => ({ ...prev, message: null }));
      }, 5000);
    } catch (err) {
      setResetPasswordStatus({
        loading: false,
        message: null,
        error: err instanceof Error ? err.message : 'Failed to send password reset email',
      });
    }
  };

  if (!userId) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white h-full">
        <div className="bg-blue-900 py-3 px-4 font-medium text-white">User Details</div>
        <div className="p-6 text-center text-muted-foreground">
          Select a user from the list to view details
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white h-full">
        <div className="bg-blue-900 py-3 px-4 font-medium text-white">User Details</div>
        <div className="p-6 text-center text-muted-foreground">Loading user details...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white h-full">
        <div className="bg-blue-900 py-3 px-4 font-medium text-white">User Details</div>
        <div className="p-6 text-center text-red-500">{error || 'User not found'}</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white h-full">
      <div className="bg-blue-900 py-3 px-4 font-medium flex justify-between items-center text-white">
        <span>{editMode ? 'Edit User' : 'User Details'}</span>
        <div>
          {!editMode ? (
            <div className="flex gap-2">
              <button
                onClick={handlePasswordReset}
                disabled={resetPasswordStatus.loading}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm disabled:opacity-50"
              >
                {resetPasswordStatus.loading ? 'Sending...' : 'Reset Password'}
              </button>
              <button
                onClick={() => setEditMode(true)}
                className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-sm"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode(false)}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-sm disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6 max-h-[650px] overflow-y-auto">
        {saveError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {saveError}
          </div>
        )}
        
        {resetPasswordStatus.message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {resetPasswordStatus.message}
          </div>
        )}
        
        {resetPasswordStatus.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {resetPasswordStatus.error}
          </div>
        )}

        {/* User info section */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {user.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt={getUserDisplayName(user)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-blue-100 text-blue-800 font-semibold text-3xl">
                {getUserDisplayName(user).charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{getUserDisplayName(user)}</h3>
            <div className="text-gray-500">{user.email}</div>
            <div className="flex gap-3 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {user.role || 'user'}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                ID: {user.id}
              </span>
            </div>
          </div>
        </div>

        {/* Basic user information */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-lg mb-3">Basic Information</h4>
          {editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">First Name</div>
                <div>{user.first_name || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Name</div>
                <div>{user.last_name || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div>{user.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Role</div>
                <div>{user.role || 'user'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Registered</div>
                <div>{formatDate(user.created_at)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Updated</div>
                <div>{formatDate(user.updated_at)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Note: Wedding profile section has been removed */}
      </div>
    </div>
  );
}; 