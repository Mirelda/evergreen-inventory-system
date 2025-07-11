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
    // TODO: Implement edit functionality
    console.log('Edit warehouse:', warehouse);
    // router.push(`/dashboard/inventory/warehouse/edit/${warehouse.id}`);
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
      />
    </div>
  );
}

export default Warehouse;
