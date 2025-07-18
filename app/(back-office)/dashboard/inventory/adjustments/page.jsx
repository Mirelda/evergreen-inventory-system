"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AdjustmentForm from "@/components/dashboard/AdjustmentForm";
import DataTable from "@/components/ui/DataTable";

export default function AdjustmentsPage() {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [tab, setTab] = useState("add");
  const [refresh, setRefresh] = useState(false);
  const [addAdjustments, setAddAdjustments] = useState([]);
  const [transferAdjustments, setTransferAdjustments] = useState([]);
  const searchParams = useSearchParams();
  const preSelectedItemId = searchParams.get('itemId');

  useEffect(() => {
    // Fetch items and warehouses
    const fetchData = async () => {
      const [itemsRes, warehousesRes, addAdjRes, transferAdjRes] = await Promise.all([
        fetch("/api/items"),
        fetch("/api/warehouse"),
        fetch("/api/adjustments/add"),
        fetch("/api/adjustments/transfer"),
      ]);
      setItems(await itemsRes.json());
      setWarehouses(await warehousesRes.json());
      setAddAdjustments(addAdjRes.ok ? await addAdjRes.json() : []);
      setTransferAdjustments(transferAdjRes.ok ? await transferAdjRes.json() : []);
    };
    fetchData();
  }, [refresh]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Add Stock table columns
  const addColumns = [
    { key: 'referenceNumber', label: 'Reference No' },
    { 
      key: 'item', 
      label: 'Item', 
      accessor: (item) => item.item?.title || 'Unknown'
    },
    { 
      key: 'warehouse', 
      label: 'Warehouse', 
      accessor: (item) => item.warehouse?.title || 'Unknown'
    },
    { key: 'addStockQuantity', label: 'Quantity' },
    { key: 'notes', label: 'Notes' },
    { 
      key: 'createdAt', 
      label: 'Date', 
      accessor: (item) => formatDate(item.createdAt)
    },
  ];

  // Transfer table columns
  const transferColumns = [
    { key: 'referenceNumber', label: 'Reference No' },
    { 
      key: 'item', 
      label: 'Item', 
      accessor: (item) => item.item?.title || 'Unknown'
    },
    { 
      key: 'givingWarehouse', 
      label: 'From', 
      accessor: (item) => item.givingWarehouse?.title || 'Unknown'
    },
    { 
      key: 'receivingWarehouse', 
      label: 'To', 
      accessor: (item) => item.receivingWarehouse?.title || 'Unknown'
    },
    { key: 'transferStockQuantity', label: 'Quantity' },
    { key: 'notes', label: 'Notes' },
    { 
      key: 'createdAt', 
      label: 'Date', 
      accessor: (item) => formatDate(item.createdAt)
    },
  ];

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-6">Stock Adjustments</h1>
      
      {/* Show info message if item is pre-selected */}
      {preSelectedItemId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            <strong>📦 Quick Add Stock:</strong> You can quickly add stock for the selected low-stock item below.
          </p>
        </div>
      )}
      
      {/* Tab Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "add" 
              ? "bg-blue-600 text-white shadow-md" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setTab("add")}
        >
          Add Stock
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "transfer" 
              ? "bg-blue-600 text-white shadow-md" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setTab("transfer")}
        >
          Transfer Stock
        </button>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        {tab === "add" ? (
          <AdjustmentForm
            type="add"
            items={items}
            warehouses={warehouses}
            preSelectedItemId={preSelectedItemId}
            onSuccess={() => setRefresh(r => !r)}
          />
        ) : (
          <AdjustmentForm
            type="transfer"
            items={items}
            warehouses={warehouses}
            preSelectedItemId={preSelectedItemId}
            onSuccess={() => setRefresh(r => !r)}
          />
        )}
      </div>

      {/* History Section */}
      <div className="space-y-8">
        {/* Add Stock History */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Add Stock History</h2>
          </div>
          <div className="p-6">
            {addAdjustments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No add stock records found.</p>
            ) : (
              <DataTable 
                data={addAdjustments} 
                columns={addColumns}
                searchKey="referenceNumber"
                searchPlaceholder="Search by reference number..."
              />
            )}
          </div>
        </div>

        {/* Transfer History */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Transfer Stock History</h2>
          </div>
          <div className="p-6">
            {transferAdjustments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No transfer records found.</p>
            ) : (
              <DataTable 
                data={transferAdjustments} 
                columns={transferColumns}
                searchKey="referenceNumber"
                searchPlaceholder="Search by reference number..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
