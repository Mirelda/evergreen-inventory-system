import { useState } from "react";

export default function AdjustmentForm({ type = "add", items = [], warehouses = [], onSuccess }) {
  const [form, setForm] = useState({
    itemId: "",
    warehouseId: "",
    givingWarehouseId: "",
    receivingWarehouseId: "",
    quantity: "",
    referenceNumber: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let endpoint = type === "add" ? "/api/adjustments/add" : "/api/adjustments/transfer";
      let payload = {
        itemId: form.itemId,
        referenceNumber: form.referenceNumber,
        notes: form.notes,
      };
      if (type === "add") {
        payload.warehouseId = form.warehouseId;
        payload.addStockQuantity = form.quantity;
      } else {
        payload.givingWarehouseId = form.givingWarehouseId;
        payload.receivingWarehouseId = form.receivingWarehouseId;
        payload.transferStockQuantity = form.quantity;
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm({
          itemId: "",
          warehouseId: "",
          givingWarehouseId: "",
          receivingWarehouseId: "",
          quantity: "",
          referenceNumber: "",
          notes: "",
        });
        if (onSuccess) onSuccess();
        alert("Operation successful!");
      } else {
        const data = await res.json();
        alert(data.error || "An error occurred");
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Item</label>
        <select
          name="itemId"
          value={form.itemId}
          onChange={handleChange}
          required
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
      </div>
      {type === "add" ? (
        <div>
          <label className="block mb-1">Warehouse</label>
          <select
            name="warehouseId"
            value={form.warehouseId}
            onChange={handleChange}
            required
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Select</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.title}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">Giving Warehouse</label>
            <select
              name="givingWarehouseId"
              value={form.givingWarehouseId}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.title}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1">Receiving Warehouse</label>
            <select
              name="receivingWarehouseId"
              value={form.receivingWarehouseId}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.title}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div>
        <label className="block mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          min={1}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block mb-1">Reference Number</label>
        <input
          type="text"
          name="referenceNumber"
          value={form.referenceNumber}
          onChange={handleChange}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
} 