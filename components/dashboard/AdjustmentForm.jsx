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
    // Event object kontrolü
    if (!e || !e.target) {
      console.error('Invalid event object:', e);
      return;
    }

    const { name, value } = e.target;
    console.log('AdjustmentForm handleChange:', name, value); // Debug için
    
    setForm(prev => {
      const newForm = {
        ...prev,
        [name]: value
      };
      console.log('New form state:', newForm); // Debug için
      return newForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', form); // Debug için
    setLoading(true);

    try {
      const endpoint = type === "add" ? "/api/adjustments/add" : "/api/adjustments/transfer";
      
      // Prepare data based on type
      let requestData;
      if (type === "add") {
        requestData = {
          itemId: form.itemId,
          warehouseId: form.warehouseId,
          addStockQuantity: form.quantity, // API'de beklenen field name
          referenceNumber: form.referenceNumber,
          notes: form.notes,
        };
      } else {
        requestData = {
          itemId: form.itemId,
          givingWarehouseId: form.givingWarehouseId,
          receivingWarehouseId: form.receivingWarehouseId,
          transferStockQuantity: form.quantity, // API'de beklenen field name
          referenceNumber: form.referenceNumber,
          notes: form.notes,
        };
      }

      console.log('Sending data to API:', requestData); // Debug için

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        console.log('Form submitted successfully'); // Debug için
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
      } else {
        const errorData = await response.json();
        console.error("Failed to submit adjustment:", errorData);
      }
    } catch (error) {
      console.error("Error submitting adjustment:", error);
    } finally {
      setLoading(false);
    }
  };

  const itemOptions = items.map(item => ({
    value: item.id,
    label: item.title
  }));

  const warehouseOptions = warehouses.map(warehouse => ({
    value: warehouse.id,
    label: warehouse.title || warehouse.name // API'den gelen field name'i kontrol et
  }));

  console.log('Current form state:', form); // Debug için
  console.log('Item options:', itemOptions); // Debug için
  console.log('Warehouse options:', warehouseOptions); // Debug için

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <SelectInput
          label="Item"
          name="itemId"
          value={form.itemId}
          onChange={handleChange}
          options={itemOptions}
          isRequired={true}
          placeholder="Select Item"
        />

        {type === "add" ? (
          <SelectInput
            label="Warehouse"
            name="warehouseId"
            value={form.warehouseId}
            onChange={handleChange}
            options={warehouseOptions}
            isRequired={true}
            placeholder="Select Warehouse"
          />
        ) : (
          <>
            <SelectInput
              label="From Warehouse"
              name="givingWarehouseId"
              value={form.givingWarehouseId}
              onChange={handleChange}
              options={warehouseOptions}
              isRequired={true}
              placeholder="Select From Warehouse"
            />
            <SelectInput
              label="To Warehouse"
              name="receivingWarehouseId"
              value={form.receivingWarehouseId}
              onChange={handleChange}
              options={warehouseOptions}
              isRequired={true}
              placeholder="Select To Warehouse"
            />
          </>
        )}

        <TextInput
          label="Quantity"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          isRequired={true}
          placeholder="Enter quantity"
        />

        <TextInput
          label="Reference Number"
          name="referenceNumber"
          value={form.referenceNumber}
          onChange={handleChange}
          isRequired={true}
          placeholder="Enter reference number"
        />

        <TextAreaInput
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          isRequired={false}
          placeholder="Enter any additional notes..."
        />
      </div>

      <SubmitButton loading={loading} text={type === "add" ? "Add Stock" : "Transfer Stock"} />
    </form>
  );
} 