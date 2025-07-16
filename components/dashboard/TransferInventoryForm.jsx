"use client";

import SelectInput from "@/components/FormInputs/SelectInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
import TextareaInput from "@/components/FormInputs/TextareaInput";
import { makePostRequest } from "@/lib/apiRequest";
import { generateReferenceNumber } from "@/lib/generateRef";

import { useState } from "react";
import { useForm } from "react-hook-form";

export default function TransferInventoryForm({ items, warehouses }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  async function onSubmit(data) {
    console.log(data);
    data.referenceNumber = generateReferenceNumber(10);
    makePostRequest(
      setLoading,
      "api/adjustments/transfer",
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
        <TextInput
          type="number"
          label="Enter Quantity of Stock to Transfer"
          name="transferStockQty"
          register={register}
          errors={errors}
          className="w-full"
        />
        <SelectInput
          name="givingWarehouseId"
          label="Select the Warehouse that will give the Stock"
          register={register}
          className="w-full"
          options={warehouses}
        />
        <SelectInput
          name="recievingWarehouseId"
          label="Select the Warehouse that will receive the Stock"
          register={register}
          className="w-full"
          options={warehouses}
        />
        <TextareaInput
          label="Adjustment Notes"
          name="notes"
          register={register}
          errors={errors}
        />
      </div>
      <SubmitButton isLoading={loading} title="Adjustment" />
    </form>
  );
}
