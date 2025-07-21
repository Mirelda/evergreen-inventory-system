"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/ui/DataTable";
import { getData } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const data = await getData('sales');
        setSales(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch sales');
        console.error('Error fetching sales:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // Calculate totals
  const totalRevenue = sales.reduce((sum, sale) => {
    const saleRevenue = sale.items.reduce((itemSum, saleItem) => {
      return itemSum + (saleItem.quantitySold * saleItem.pricePerItem);
    }, 0);
    return sum + saleRevenue;
  }, 0);

  const todaysSales = sales.filter(sale => {
    const today = new Date().toDateString();
    return new Date(sale.createdAt).toDateString() === today;
  }).length;

  const columns = [
    {
      key: "referenceNumber",
      label: "Reference No",
      sortable: true,
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      sortable: true,
      format: (value) => `$${value?.toFixed(2) || "0.00"}`,
    },
    {
      key: "items",
      label: "Items",
      sortable: false,
      accessor: (sale) => {
        if (!sale.items || sale.items.length === 0) return "No items";
        return sale.items.map(item => 
          `${item.item?.title || 'Unknown'} (${item.quantitySold})`
        ).join(", ");
      },
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      type: "date",
    },
  ];

  const handleDelete = async (sale) => {
    if (confirm(`Are you sure you want to delete sale "${sale.referenceNumber}"?`)) {
      try {
        const response = await fetch(`/api/sales/${sale.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setSales(sales.filter(s => s.id !== sale.id));
        } else {
          alert('Failed to delete sale');
        }
      } catch (error) {
        console.error('Error deleting sale:', error);
        alert('Error deleting sale');
      }
    }
  };

  const handleAdd = () => {
    router.push('/dashboard/sales/new');
  };

  // Bulk actions
  const handleBulkDelete = async (selectedIds) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} sales?`)) {
      try {
        const deletePromises = selectedIds.map(id => 
          fetch(`/api/sales/${id}`, { method: 'DELETE' })
        );
        
        const results = await Promise.all(deletePromises);
        const successCount = results.filter(response => response.ok).length;
        
        if (successCount > 0) {
          setSales(sales.filter(sale => !selectedIds.includes(sale.id)));
          alert(`Successfully deleted ${successCount} sales`);
        } else {
          alert('Failed to delete sales');
        }
      } catch (error) {
        console.error('Error bulk deleting sales:', error);
        alert('Error deleting sales');
      }
    }
  };

  const handleBulkUpdate = (selectedIds) => {
    alert(`Bulk update for ${selectedIds.length} sales - This feature would open a modal or redirect to bulk update page`);
  };

  const handleBulkExport = (selectedIds) => {
    console.log('Bulk export for:', selectedIds);
  };

  // Advanced filters configuration
  const filters = [
    {
      key: "totalAmount",
      label: "Amount Range",
      type: "numberRange",
      accessor: (item) => item.totalAmount,
    },
    {
      key: "items",
      label: "Items Count",
      type: "numberRange",
      accessor: (item) => item.items?.length || 0,
    },
    {
      key: "createdAt",
      label: "Date",
      type: "dateRange",
      accessor: (item) => item.createdAt,
    },
    {
      key: "referenceNumber",
      label: "Reference No",
      type: "text",
      accessor: (item) => item.referenceNumber,
    },
  ];

  return (
    <div className="p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-900">{sales?.length || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Today's Sales</h3>
          <p className="text-2xl font-bold text-gray-900">{todaysSales}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        title="Sales"
        data={sales}
        columns={columns}
        searchPlaceholder="Search sales..."
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="New Sale"
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

export default Sales;
