"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/ui/DataTable";
import { getData } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getData('items');
        setItems(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch items');
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "sku",
      label: "SKU",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      accessor: (item) => item.category?.title || "-",
    },
    {
      key: "brand",
      label: "Brand",
      sortable: true,
      accessor: (item) => item.brand?.title || "-",
    },
    {
      key: "quantity",
      label: "Quantity",
      sortable: true,
      format: (value) => value?.toLocaleString() || "0",
    },
    {
      key: "unit",
      label: "Unit",
      sortable: true,
      accessor: (item) => item.unit?.title || "-",
    },
    {
      key: "sellingPrice",
      label: "Selling Price",
      sortable: true,
      format: (value) => `$${value?.toFixed(2) || "0.00"}`,
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleEdit = (item) => {
    // TODO: Implement edit functionality
    console.log('Edit item:', item);
    // router.push(`/dashboard/inventory/items/edit/${item.id}`);
  };

  const handleDelete = async (item) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        const response = await fetch(`/api/items/${item.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setItems(items.filter(i => i.id !== item.id));
        } else {
          alert('Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
      }
    }
  };

  const handleAdd = () => {
    router.push('/dashboard/inventory/items/new');
  };

  return (
    <div className="p-6">
      <DataTable
        title="Items"
        data={items}
        columns={columns}
        searchPlaceholder="Search items..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="New Item"
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default Items;
