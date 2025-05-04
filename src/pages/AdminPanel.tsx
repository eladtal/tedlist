import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  adminPrivileges: string[];
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: Date;
}

const AdminPanel: React.FC = () => {
  const { token, user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleMakeAdmin = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/make-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          privileges: ['manage_users', 'manage_items', 'manage_trades']
        })
      });

      if (!response.ok) {
        throw new Error('Failed to make user admin');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user._id === userId ? updatedUser : user
      ));
      toast.success('User is now an admin');
    } catch (err) {
      toast.error('Failed to make user admin');
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/remove-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove admin privileges');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user._id === userId ? updatedUser : user
      ));
      toast.success('Admin privileges removed');
    } catch (err) {
      toast.error('Failed to remove admin privileges');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? Their data will be preserved but they will no longer be able to access the system.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      await response.json();
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isDeleted: true } : user
      ));
      toast.success('User has been deleted');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === users.filter(u => !u.isAdmin && !u.isDeleted).length) {
      // If all non-admin users are selected, clear selection
      setSelectedUsers(new Set());
    } else {
      // Select all non-admin users
      setSelectedUsers(new Set(users.filter(u => !u.isAdmin && !u.isDeleted).map(u => u._id)));
    }
  };

  const handleBulkDeleteItems = async () => {
    if (selectedUsers.size === 0) {
      toast.error('No users selected');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ALL items from ${selectedUsers.size} selected users? This action cannot be undone.`)) {
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const userId of selectedUsers) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/items`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete items');
        }

        successCount++;
      } catch (err) {
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully deleted items from ${successCount} users`);
    }
    if (failCount > 0) {
      toast.error(`Failed to delete items from ${failCount} users`);
    }

    // Clear selection after bulk action
    setSelectedUsers(new Set());
  };

  const handleBulkDeleteUsers = async () => {
    if (selectedUsers.size === 0) {
      toast.error('No users selected');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedUsers.size} selected users? Their data will be preserved but they will no longer be able to access the system.`)) {
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const userId of selectedUsers) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/delete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        await response.json();
        successCount++;
        // Update local state to mark user as deleted
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isDeleted: true } : user
        ));
      } catch (err) {
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully deleted ${successCount} users`);
    }
    if (failCount > 0) {
      toast.error(`Failed to delete ${failCount} users`);
    }

    // Clear selection after bulk action
    setSelectedUsers(new Set());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          {selectedUsers.size > 0 && (
            <div className="space-x-4">
              <button
                onClick={handleBulkDeleteItems}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Items from Selected ({selectedUsers.size})
              </button>
              <button
                onClick={handleBulkDeleteUsers}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Selected Users ({selectedUsers.size})
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectedUsers.size === users.filter(u => !u.isAdmin && !u.isDeleted).length && selectedUsers.size > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className={user.isDeleted ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!user.isAdmin && !user.isDeleted && (
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedUsers.has(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.isDeleted ? (
                      <span className="text-gray-400">Account deleted</span>
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.isDeleted ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Deleted
                      </span>
                    ) : user.isAdmin ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Admin
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-4">
                      {!user.isDeleted && !user.isAdmin && (
                        <>
                          <button
                            onClick={() => handleMakeAdmin(user._id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Make Admin
                          </button>
                          <button
                            onClick={() => handleBulkDeleteItems()}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete Items
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete User
                          </button>
                        </>
                      )}
                      {!user.isDeleted && user.isAdmin && user._id !== currentUser?._id && (
                        <button
                          onClick={() => handleRemoveAdmin(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove Admin
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 