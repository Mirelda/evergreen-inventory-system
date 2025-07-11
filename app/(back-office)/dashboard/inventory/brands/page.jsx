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
    // TODO: Implement edit functionality
    console.log('Edit brand:', brand);
    // router.push(`/dashboard/inventory/brands/edit/${brand.id}`);
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
      />
    </div>
  );
}

export default Brands;
