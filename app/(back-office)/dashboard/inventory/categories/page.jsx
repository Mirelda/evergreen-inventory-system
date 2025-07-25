"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/ui/DataTable";
import { getData } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getData('categories');
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      format: (value) => value || "-",
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

  const handleEdit = (category) => {
    router.push(`/dashboard/inventory/categories/edit/${category.id}`);
  };

  const handleDelete = async (category) => {
    if (confirm(`Are you sure you want to delete "${category.title}"?`)) {
      try {
        const response = await fetch(`/api/categories/${category.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setCategories(categories.filter(c => c.id !== category.id));
        } else {
          alert('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
      }
    }
  };

  const handleAdd = () => {
    router.push('/dashboard/inventory/categories/new');
  };

  // Bulk actions
  const handleBulkDelete = async (selectedIds) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} categories?`)) {
      try {
        const deletePromises = selectedIds.map(id => 
          fetch(`/api/categories/${id}`, { method: 'DELETE' })
        );
        
        const results = await Promise.all(deletePromises);
        const successCount = results.filter(response => response.ok).length;
        
        if (successCount > 0) {
          setCategories(categories.filter(category => !selectedIds.includes(category.id)));
          alert(`Successfully deleted ${successCount} categories`);
        } else {
          alert('Failed to delete categories');
        }
      } catch (error) {
        console.error('Error bulk deleting categories:', error);
        alert('Error deleting categories');
      }
    }
  };

  const handleBulkUpdate = (selectedIds) => {
    alert(`Bulk update for ${selectedIds.length} categories - This feature would open a modal or redirect to bulk update page`);
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
      label: "Title",
      type: "text",
      accessor: (item) => item.title,
    },
  ];

  return (
    <div className="p-6">
      <DataTable
        title="Categories"
        data={categories}
        columns={columns}
        searchPlaceholder="Search categories..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="New Category"
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

export default Categories;
