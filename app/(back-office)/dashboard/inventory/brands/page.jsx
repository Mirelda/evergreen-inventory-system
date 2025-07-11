"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/ui/DataTable";
import { getData } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await getData('brands');
        setBrands(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch brands');
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const columns = [
    {
      key: "title",
      label: "Brand Name",
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

  const handleEdit = (brand) => {
    router.push(`/dashboard/inventory/brands/edit/${brand.id}`);
  };

  const handleDelete = async (brand) => {
    if (confirm(`Are you sure you want to delete "${brand.title}"?`)) {
      try {
        const response = await fetch(`/api/brands/${brand.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setBrands(brands.filter(b => b.id !== brand.id));
        } else {
          alert('Failed to delete brand');
        }
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Error deleting brand');
      }
    }
  };

  const handleAdd = () => {
    router.push('/dashboard/inventory/brands/new');
  };

  // Bulk actions
  const handleBulkDelete = async (selectedIds) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} brands?`)) {
      try {
        const deletePromises = selectedIds.map(id => 
          fetch(`/api/brands/${id}`, { method: 'DELETE' })
        );
        
        const results = await Promise.all(deletePromises);
        const successCount = results.filter(response => response.ok).length;
        
        if (successCount > 0) {
          setBrands(brands.filter(brand => !selectedIds.includes(brand.id)));
          alert(`Successfully deleted ${successCount} brands`);
        } else {
          alert('Failed to delete brands');
        }
      } catch (error) {
        console.error('Error bulk deleting brands:', error);
        alert('Error deleting brands');
      }
    }
  };

  const handleBulkUpdate = (selectedIds) => {
    alert(`Bulk update for ${selectedIds.length} brands - This feature would open a modal or redirect to bulk update page`);
  };

  const handleBulkExport = (selectedIds) => {
    console.log('Bulk export for:', selectedIds);
  };

  return (
    <div className="p-6">
      <DataTable
        title="Brands"
        data={brands}
        columns={columns}
        searchPlaceholder="Search brands..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="New Brand"
        loading={loading}
        error={error}
        enableExport={true}
        enableBulkActions={true}
        onBulkDelete={handleBulkDelete}
        onBulkUpdate={handleBulkUpdate}
        onBulkExport={handleBulkExport}
      />
    </div>
  );
}

export default Brands;
