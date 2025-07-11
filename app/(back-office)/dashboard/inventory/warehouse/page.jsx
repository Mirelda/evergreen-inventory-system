"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/ui/DataTable";
import { getData } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Warehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setLoading(true);
        const data = await getData('warehouse');
        setWarehouses(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch warehouses');
        console.error('Error fetching warehouses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const columns = [
    {
      key: "title",
      label: "Warehouse Name",
      sortable: true,
    },
    {
      key: "warehouseType",
      label: "Type",
      sortable: true,
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      format: (value) => value || "-",
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      format: (value) => value || "-",
    },
    {
      key: "addStockAdjustments",
      label: "Stock Adjustments",
      sortable: true,
      accessor: (item) => item.addStockAdjustments?.length || 0,
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

  const handleEdit = (warehouse) => {
    router.push(`/dashboard/inventory/warehouse/edit/${warehouse.id}`);
  };

  const handleDelete = async (warehouse) => {
    if (confirm(`Are you sure you want to delete "${warehouse.title}"?`)) {
      try {
        const response = await fetch(`/api/warehouse/${warehouse.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setWarehouses(warehouses.filter(w => w.id !== warehouse.id));
        } else {
          alert('Failed to delete warehouse');
        }
      } catch (error) {
        console.error('Error deleting warehouse:', error);
        alert('Error deleting warehouse');
      }
    }
  };

  const handleAdd = () => {
    router.push('/dashboard/inventory/warehouse/new');
  };

  // Bulk actions
  const handleBulkDelete = async (selectedIds) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} warehouses?`)) {
      try {
        const deletePromises = selectedIds.map(id => 
          fetch(`/api/warehouse/${id}`, { method: 'DELETE' })
        );
        
        const results = await Promise.all(deletePromises);
        const successCount = results.filter(response => response.ok).length;
        
        if (successCount > 0) {
          setWarehouses(warehouses.filter(warehouse => !selectedIds.includes(warehouse.id)));
          alert(`Successfully deleted ${successCount} warehouses`);
        } else {
          alert('Failed to delete warehouses');
        }
      } catch (error) {
        console.error('Error bulk deleting warehouses:', error);
        alert('Error deleting warehouses');
      }
    }
  };

  const handleBulkUpdate = (selectedIds) => {
    alert(`Bulk update for ${selectedIds.length} warehouses - This feature would open a modal or redirect to bulk update page`);
  };

  const handleBulkExport = (selectedIds) => {
    console.log('Bulk export for:', selectedIds);
  };

  // Advanced filters configuration
  const filters = [
    {
      key: "warehouseType",
      label: "Warehouse Type",
      type: "select",
      accessor: (item) => item.warehouseType,
      options: [
        { value: "branch", label: "Branch" },
        { value: "warehouse", label: "Warehouse" },
        { value: "store", label: "Store" },
      ]
    },
    {
      key: "addStockAdjustments",
      label: "Stock Adjustments",
      type: "numberRange",
      accessor: (item) => item.addStockAdjustments?.length || 0,
    },
    {
      key: "createdAt",
      label: "Created Date",
      type: "dateRange",
      accessor: (item) => item.createdAt,
    },
    {
      key: "title",
      label: "Warehouse Name",
      type: "text",
      accessor: (item) => item.title,
    },
    {
      key: "location",
      label: "Location",
      type: "text",
      accessor: (item) => item.location,
    },
  ];

  return (
    <div className="p-6">
      <DataTable
        title="Warehouses"
        data={warehouses}
        columns={columns}
        searchPlaceholder="Search warehouses..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="New Warehouse"
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

export default Warehouse;
