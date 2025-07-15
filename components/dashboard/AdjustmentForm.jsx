import { useState } from "react";
import SelectInput from "@/components/formInputs/SelectInput";
import TextInput from "@/components/formInputs/TextInput";
import TextAreaInput from "@/components/formInputs/TextAreaInput";
import SubmitButton from "@/components/formInputs/SubmitButton";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item Selection */}
        <div className="md:col-span-2">
          <SelectInput
            label="Item"
            name="itemId"
            value={form.itemId}
            onChange={handleChange}
            required
            options={[
              { value: "", label: "Select an item" },
              ...items.map((item) => ({ value: item.id, label: item.title }))
            ]}
          />
        </div>

        {/* Warehouse Selection */}
        {type === "add" ? (
          <div className="md:col-span-2">
            <SelectInput
              label="Warehouse"
              name="warehouseId"
              value={form.warehouseId}
              onChange={handleChange}
              required
              options={[
                { value: "", label: "Select a warehouse" },
                ...warehouses.map((w) => ({ value: w.id, label: w.title }))
              ]}
            />
          </div>
        ) : (
          <>
            <SelectInput
              label="From Warehouse"
              name="givingWarehouseId"
              value={form.givingWarehouseId}
              onChange={handleChange}
              required
              options={[
                { value: "", label: "Select source warehouse" },
                ...warehouses.map((w) => ({ value: w.id, label: w.title }))
              ]}
            />
            <SelectInput
              label="To Warehouse"
              name="receivingWarehouseId"
              value={form.receivingWarehouseId}
              onChange={handleChange}
              required
              options={[
                { value: "", label: "Select destination warehouse" },
                ...warehouses.map((w) => ({ value: w.id, label: w.title }))
              ]}
            />
          </>
        )}

        {/* Quantity and Reference Number */}
        <TextInput
          label="Quantity"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          required
          min={1}
          placeholder="Enter quantity"
        />
        <TextInput
          label="Reference Number"
          name="referenceNumber"
          type="text"
          value={form.referenceNumber}
          onChange={handleChange}
          required
          placeholder="Enter reference number"
        />
      </div>

      {/* Notes */}
      <TextAreaInput
        label="Notes"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Enter any additional notes..."
        rows={3}
      />

      {/* Submit Button */}
      <div className="flex justify-end">
        <SubmitButton
          loading={loading}
          text={type === "add" ? "Add Stock" : "Transfer Stock"}
          loadingText="Processing..."
        />
      </div>
    </form>
  );
} 