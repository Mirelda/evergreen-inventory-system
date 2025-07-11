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
    // TODO: Implement edit functionality
    console.log('Edit category:', category);
    // router.push(`/dashboard/inventory/categories/edit/${category.id}`);
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
      />
    </div>
  );
}

export default Categories;
