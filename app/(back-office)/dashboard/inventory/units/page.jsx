"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/ui/DataTable";
import { getData } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Units() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const data = await getData('units');
        setUnits(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch units');
        console.error('Error fetching units:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const columns = [
    {
      key: "title",
      label: "Unit Name",
      sortable: true,
    },
    {
      key: "abbreviation",
      label: "Abbreviation",
      sortable: true,
    },
    {
      key: "items",
      label: "Items Count",
      sortable: true,
      accessor: (item) => item.items?.length || 0,
      format: (value) => value.toLocaleString(),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      format: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "updatedAt",
      label: "Updated",
      sortable: true,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleEdit = (unit) => {
    router.push(`/dashboard/inventory/units/edit/${unit.id}`);
  };

  const handleDelete = async (unit) => {
    if (confirm(`Are you sure you want to delete "${unit.title}"?`)) {
      try {
        const response = await fetch(`/api/units/${unit.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setUnits(units.filter(u => u.id !== unit.id));
        } else {
          alert('Failed to delete unit');
        }
      } catch (error) {
        console.error('Error deleting unit:', error);
        alert('Error deleting unit');
      }
    }
  };

  const handleAdd = () => {
    router.push('/dashboard/inventory/units/new');
  };

  // Bulk actions
  const handleBulkDelete = async (selectedIds) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} units?`)) {
      try {
        const deletePromises = selectedIds.map(id => 
          fetch(`/api/units/${id}`, { method: 'DELETE' })
        );
        
        const results = await Promise.all(deletePromises);
        const successCount = results.filter(response => response.ok).length;
        
        if (successCount > 0) {
          setUnits(units.filter(unit => !selectedIds.includes(unit.id)));
          alert(`Successfully deleted ${successCount} units`);
        } else {
          alert('Failed to delete units');
        }
      } catch (error) {
        console.error('Error bulk deleting units:', error);
        alert('Error deleting units');
      }
    }
  };

  const handleBulkUpdate = (selectedIds) => {
    alert(`Bulk update for ${selectedIds.length} units - This feature would open a modal or redirect to bulk update page`);
  };

  const handleBulkExport = (selectedIds) => {
    console.log('Bulk export for:', selectedIds);
  };

  // Advanced filters configuration
  const filters = [
    {
      key: "items",
      label: "Items Count",
      type: "numberRange",
      accessor: (item) => item.items?.length || 0,
    },
    {
      key: "createdAt",
      label: "Created Date",
      type: "dateRange",
      accessor: (item) => item.createdAt,
    },
    {
      key: "title",
      label: "Unit Name",
      type: "text",
      accessor: (item) => item.title,
    },
    {
      key: "abbreviation",
      label: "Abbreviation",
      type: "text",
      accessor: (item) => item.abbreviation,
    },
  ];

  return (
    <div className="p-6">
      <DataTable
        title="Units"
        data={units}
        columns={columns}
        searchPlaceholder="Search units..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="New Unit"
        loading={loading}
        error={error}
        enableExport={true}
        enableBulkActions={true}
        onBulkDelete={handleBulkDelete}
        onBulkUpdate={handleBulkUpdate}
        onBulkExport={handleBulkExport}
        enableAdvancedFiltering={true}
        filters={filters}
      />
    </div>
  );
}

export default Units;
