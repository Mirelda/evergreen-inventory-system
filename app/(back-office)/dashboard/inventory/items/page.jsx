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
      key: "imageUrl",
      label: "Image",
      render: (item) => (
        item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded-md" />
        ) : (
          <span>No Image</span>
        )
      ),
    },
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
      type: "date",
    },
  ];

  const handleEdit = (item) => {
    router.push(`/dashboard/inventory/items/edit/${item.id}`);
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

  // Bulk actions
  const handleBulkDelete = async (selectedIds) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      try {
        const deletePromises = selectedIds.map(id => 
          fetch(`/api/items/${id}`, { method: 'DELETE' })
        );
        
        const results = await Promise.all(deletePromises);
        const successCount = results.filter(response => response.ok).length;
        
        if (successCount > 0) {
          setItems(items.filter(item => !selectedIds.includes(item.id)));
          alert(`Successfully deleted ${successCount} items`);
        } else {
          alert('Failed to delete items');
        }
      } catch (error) {
        console.error('Error bulk deleting items:', error);
        alert('Error deleting items');
      }
    }
  };

  const handleBulkUpdate = (selectedIds) => {
    // For now, just show a message. In a real app, you'd open a modal or redirect to a bulk update page
    alert(`Bulk update for ${selectedIds.length} items - This feature would open a modal or redirect to bulk update page`);
  };

  const handleBulkExport = (selectedIds) => {
    // This will use the default bulk export behavior in DataTable
    console.log('Bulk export for:', selectedIds);
  };

  // Advanced filters configuration
  const filters = [
    {
      key: "category",
      label: "Category",
      type: "select",
      accessor: (item) => item.category?.title,
      options: [
        { value: "Electronics", label: "Electronics" },
        { value: "Clothing", label: "Clothing" },
        { value: "Books", label: "Books" },
        { value: "Home & Garden", label: "Home & Garden" },
      ]
    },
    {
      key: "brand",
      label: "Brand",
      type: "select",
      accessor: (item) => item.brand?.title,
      options: [
        { value: "Apple", label: "Apple" },
        { value: "Samsung", label: "Samsung" },
        { value: "Nike", label: "Nike" },
        { value: "Adidas", label: "Adidas" },
      ]
    },
    {
      key: "sellingPrice",
      label: "Price Range",
      type: "numberRange",
      accessor: (item) => item.sellingPrice,
    },
    {
      key: "quantity",
      label: "Stock Range",
      type: "numberRange",
      accessor: (item) => item.quantity,
    },
    {
      key: "createdAt",
      label: "Created Date",
      type: "dateRange",
      accessor: (item) => item.createdAt,
    },
  ];

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

export default Items;
