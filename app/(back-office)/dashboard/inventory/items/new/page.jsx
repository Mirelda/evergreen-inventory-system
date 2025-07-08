"use client";
import FormHeader from "@/components/dashboard/FormHeader";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import TextInput from "@/components/formInputs/TextInput";
import { useState } from "react";
import SubmitButton from "@/components/formInputs/SubmitButton";
import TextAreaInput from "@/components/formInputs/TextAreaInput";
import SelectInput from "@/components/formInputs/SelectInput";
import { UploadButton } from "@/lib/uploadthing";
import { UploadDropzone } from "@uploadthing/react";

function NewItem() {
  const [imageUrl, setImageUrl] = useState("");
  const categories = [
    { label: "Electronics", value: "asdwfe524643t35tgrf" },
    { label: "Clothes", value: "rwgrr4363y534tg" },
  ];

  const units = [
    { label: "Kg", value: "3567y45heg4345" },
    { label: "Pcs", value: "ytfgber453235" },
  ];

  const brands = [
    { label: "HP", value: "2345t34grwghety" },
    { label: "Dell", value: "myrthr4354u245" },
  ];

  const warehouses = [
    { label: "Warehouse A", value: "htej3545234y54u" },
    { label: "Warehouse B", value: "zfdhay5w4u5e43" },
    { label: "Warehouse C", value: "ukyjt3453t2ew" },
  ];

  const suppliers = [
    { label: "Supplier A", value: "jrthert4y5443y" },
    { label: "Supplier B", value: "ukdyrjuts643" },
    { label: "Supplier C", value: "2463y5u4ehheqr" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  async function onSubmit(data) {
    data.imageUrl = imageUrl;
    console.log(data);
    setLoading(true);
    const baseUrl = "http://localhost:3000";
    try {
      const response = await fetch(`${baseUrl}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log(response);
        setLoading(false);
        reset();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  return (
    <div>
      {/* Header */}
      <FormHeader title="New Item" href="/dashboard/inventory/" />

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 light:bg-gray-800 light:border-gray-700 mx-auto my-3"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Comp */}
          <TextInput
            label="Item Title"
            name="title"
            register={register}
            errors={errors}
            className="w-full"
          />

          <SelectInput
            name="categoryId"
            label="Select the Item Category"
            register={register}
            className="w-full"
            options={categories}
          />

          <TextInput
            label="Item SKU"
            name="sku"
            register={register}
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Item Barcode"
            name="barcode"
            register={register}
            errors={errors}
            // isRequired="false"
            className="w-full"
          />
          <TextInput
            label="Item Quantity"
            name="qty"
            register={register}
            errors={errors}
            className="w-full"
          />

          <SelectInput
            name="unitId"
            label="Select the Item Unit"
            register={register}
            className="w-full"
            options={units}
          />

          <SelectInput
            name="brandId"
            label="Select the Item Brand"
            register={register}
            className="w-full"
            options={brands}
          />

          <TextInput
            label="Buying Price"
            name="buyingPrice"
            register={register}
            errors={errors}
            type="number"
            className="w-full"
          />

          <TextInput
            label="Selling Price"
            name="sellingPrice"
            register={register}
            errors={errors}
            type="number"
            className="w-full"
          />

          <SelectInput
            name="supplierId"
            label="Select the Item Supplier"
            register={register}
            className="w-full"
            options={suppliers}
          />

          <TextInput
            label="Re-Order Point"
            name="reOrderPoint"
            register={register}
            errors={errors}
            type="number"
            className="w-full"
          />

          <SelectInput
            name="warehouseId"
            label="Select the Item Warehouse"
            register={register}
            className="w-full"
            options={warehouses}
          />

          {/* Image */}

          <TextInput
            label="Item Weight in Kgs"
            name="weight"
            register={register}
            errors={errors}
            type="number"
            className="w-full"
          />

          <TextInput
            label="Item Dimensions in cm (20 x 30 x 100)"
            name="dimensions"
            register={register}
            errors={errors}
            className="w-full"
          />

          <TextInput
            label="Item Tax Rate in %"
            name="taxRate"
            type="number"
            register={register}
            errors={errors}
            className="w-full"
          />

          <TextAreaInput
            label="Item Description"
            name="description"
            register={register}
            errors={errors}
          />

          <TextAreaInput
            label="Item Notes"
            name="notes"
            register={register}
            errors={errors}
          />

          {/* Image upload */}
          <div className="sm:col-span-2 flex flex-col items-center justify-center">
            <p className="block text-sm font-medium leading-6 text-gray-900 mb-2">
              Upload Image
            </p>
            <UploadButton
              className="w-36 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-4 py-2 transition-colors duration-200"
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                setImageUrl(res[0].ufsUrl);
                console.log(res[0].ufsUrl);
                alert("Upload Completed");
              }}
              onUploadError={(error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />

            {imageUrl && (
              <div className="sm:col-span-2 flex justify-center mt-4">
                <img
                  src={imageUrl}
                  alt="Uploaded Preview"
                  className="max-h-24 rounded border border-gray-300 shadow"
                />
              </div>
            )}
          </div>
        </div>
        <SubmitButton isLoading={loading} title="Item" />
      </form>
    </div>
  );
}

export default NewItem;
