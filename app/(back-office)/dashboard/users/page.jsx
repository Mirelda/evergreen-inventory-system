"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/ui/DataTable";
import { getData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getData('user'); // API endpoint for users
        setUsers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success("User role updated successfully.");
        // Update the local state to reflect the change
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update user role.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the role.");
      console.error('Error updating role:', error);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      type: "date",
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => {
        if (user.role === 'ADMIN') {
          return <span className="font-semibold text-slate-500">Locked</span>;
        }

        return (
          <div className="relative w-full">
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
              className="appearance-none block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="MANAGER">MANAGER</option>
              <option value="STAFF">STAFF</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        );
      },
    }
  ];

  return (
    <div className="p-6">
      <DataTable
        title="User Management"
        data={users}
        columns={columns}
        searchPlaceholder="Search users..."
        loading={loading}
        error={error}
        enableExport={true}
        enableBulkActions={false} // Disable bulk actions for now
        enableAdvancedFiltering={true}
        filters={[
          { key: 'role', label: 'Role', type: 'select', options: [
            { value: 'ADMIN', label: 'ADMIN' },
            { value: 'MANAGER', label: 'MANAGER' },
            { value: 'STAFF', label: 'STAFF' }
          ]}
        ]}
      />
    </div>
  );
}

export default Users; 