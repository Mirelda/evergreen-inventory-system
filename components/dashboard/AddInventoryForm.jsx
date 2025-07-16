"use client";

import SelectInput from "@/components/FormInputs/SelectInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";

import { makePutRequest } from "@/lib/apiRequest";

import { useState } from "react";
import { useForm } from "react-hook-form";

export default function UpdateStockForm({ items, warehouses, type = "add" }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  async function onSubmit(data) {
    data.type = type;
    console.log(data);
    makePutRequest(
      setLoading,
      "api/adjustments/update",
      data,
      "Stock Adjustment",
      reset
    );
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <SelectInput
          name="itemId"
          label="Select the Item"
          register={register}
          className="w-full"
          options={items}
        />
        <SelectInput
          name="warehouseId"
          label="Select the Warehouse"
          register={register}
          className="w-full"
          options={warehouses}
        />
        <TextInput
          type="number"
          label={
            type == "add"
              ? "Enter Quantity of Stock to Add"
              : "Enter Quantity of Stock to Remove"
          }
          name="addStockQty"
          register={register}
          errors={errors}
          className="w-full"
        />
      </div>
      <SubmitButton
        isLoading={loading}
        title={type == "add" ? "Add Stock" : "Remove Stock"}
      />
    </form>
  );
}
