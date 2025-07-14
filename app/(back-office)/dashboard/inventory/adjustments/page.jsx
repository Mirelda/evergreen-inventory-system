"use client";

import { useState, useEffect } from "react";
import AdjustmentForm from "@/components/dashboard/AdjustmentForm";

export default function AdjustmentsPage() {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [tab, setTab] = useState("add");
  const [refresh, setRefresh] = useState(false);
  const [addAdjustments, setAddAdjustments] = useState([]);
  const [transferAdjustments, setTransferAdjustments] = useState([]);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stock Adjustments</h1>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === "add" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("add")}
        >
          Add Stock
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "transfer" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("transfer")}
        >
          Transfer Stock
        </button>
      </div>
      <div className="mb-8">
        {tab === "add" ? (
          <AdjustmentForm
            type="add"
            items={items}
            warehouses={warehouses}
            onSuccess={() => setRefresh(r => !r)}
          />
        ) : (
          <AdjustmentForm
            type="transfer"
            items={items}
            warehouses={warehouses}
            onSuccess={() => setRefresh(r => !r)}
          />
        )}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Add Stock History</h2>
        <ul className="mb-8">
          {addAdjustments.length === 0 && <li className="text-gray-500">No records.</li>}
          {addAdjustments.map(adj => (
            <li key={adj.id} className="border-b py-2 text-sm">
              <b>{adj.referenceNumber}</b> - Item: {adj.itemId} - Warehouse: {adj.warehouseId} - Quantity: {adj.addStockQuantity} - Notes: {adj.notes}
            </li>
          ))}
        </ul>
        <h2 className="text-lg font-semibold mb-2">Transfer Stock History</h2>
        <ul>
          {transferAdjustments.length === 0 && <li className="text-gray-500">No records.</li>}
          {transferAdjustments.map(adj => (
            <li key={adj.id} className="border-b py-2 text-sm">
              <b>{adj.referenceNumber}</b> - Item: {adj.itemId} - Giving Warehouse: {adj.givingWarehouseId} - Receiving Warehouse: {adj.receivingWarehouseId} - Quantity: {adj.transferStockQuantity} - Notes: {adj.notes}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
