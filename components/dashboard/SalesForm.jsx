"use client";
import FormHeader from "@/components/dashboard/FormHeader";
import SubmitButton from "@/components/formInputs/SubmitButton";
import TextInput from "@/components/formInputs/TextInput";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SelectInput from "../formInputs/SelectInput";
import { makePostRequest } from "@/lib/apiRequest";

export default function SalesForm({ items }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddItem = (item) => {
    if (item.quantity <= 0) {
      toast.error("This item is out of stock");
      return;
    }
    
    const newItem = {
      ...item,
      quantity: 1, // Default quantity
      originalQuantity: item.quantity, // Store original stock quantity
    };
    const exists = selectedItems.find((i) => i.id === newItem.id);
    if (!exists) {
      setSelectedItems([...selectedItems, newItem]);
    } else {
      toast.error("Item already added.");
    }
  };

  const handleQuantityChange = (id, quantity) => {
    const newQuantity = parseInt(quantity, 10);
    const selectedItem = selectedItems.find((item) => item.id === id);
    
    if (newQuantity > selectedItem.originalQuantity) {
      toast.error(`Maximum available quantity is ${selectedItem.originalQuantity}`);
      return;
    }
    
    if (newQuantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return selectedItems
      .reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0)
      .toFixed(2);
  };

  async function onSubmit() {
    if (selectedItems.length === 0) {
      toast.error("Please add at least one item to the sale.");
      return;
    }

    const saleData = {
      items: selectedItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.sellingPrice
      })),
      totalAmount: parseFloat(calculateTotal()),
    };
    
    // makePostRequest handles setLoading, toast messages, and reset internally
    await makePostRequest(setLoading, "api/sales", saleData, "Sale", () => {
      reset();
      setSelectedItems([]);
      router.push("/dashboard/sales");
    });
  }

  return (
    <div>
      <FormHeader title="Create a New Sale" href="/dashboard/sales" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto my-3"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <SelectInput
              name="item-search"
              label="Select an Item"
              options={items.map((item) => ({ 
                value: item.id, 
                label: item.title 
              }))}
              onChange={(selectedId) => {
                const selected = items.find((item) => item.id === selectedId);
                if (selected) handleAddItem(selected);
              }}
              className="w-full"
            />
          </div>

          {/* Selected Items Table */}
          <div className="sm:col-span-2">
            <h3 className="mb-2 font-semibold text-gray-900">Selected Items</h3>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Product name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-white border-b"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {item.title}
                      </th>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          className="w-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                          min="1"
                          max={item.originalQuantity}
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-900">${item.sellingPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="sm:col-span-2 flex justify-end items-center">
            <h3 className="text-lg font-bold text-gray-900">Total: ${calculateTotal()}</h3>
          </div>
        </div>
        <SubmitButton isLoading={loading} title="Save Sale" />
      </form>
    </div>
  );
} 