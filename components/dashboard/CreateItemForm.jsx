"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import TextInput from "@/components/formInputs/TextInput";
import SelectInput from "@/components/formInputs/SelectInput";
import TextAreaInput from "@/components/formInputs/TextAreaInput";
import SubmitButton from "@/components/formInputs/SubmitButton";
import { UploadButton } from "@/lib/uploadthing";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";

export default function CreateItemForm({
  categories = [],
  units = [],
  brands = [],
  warehouses = [],
  initialData = {},
  isUpdate = false,
}) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialData });

  // Ensure all data arrays are properly formatted
  if (!Array.isArray(categories) || !Array.isArray(units) || !Array.isArray(brands) || !Array.isArray(warehouses)) {
    return <div>Loading...</div>;
  }

  function redirect() {
    router.push("/dashboard/inventory/items");
  }

  async function onSubmit(data) {
    data.imageUrl = imageUrl;
    data.qty = parseInt(data.qty);
    data.buyingPrice = parseFloat(data.buyingPrice);
    data.sellingPrice = parseFloat(data.sellingPrice);
    data.reOrderPoint = parseInt(data.reOrderPoint);
    data.weight = parseFloat(data.weight) || 0;
    data.taxRate = parseFloat(data.taxRate) || 0;

    console.log(data);

    if (isUpdate) {
      makePutRequest(
        setLoading,
        `api/items/${initialData.id}`,
        data,
        "Item",
        redirect,
        reset
      );
    } else {
      makePostRequest(setLoading, "api/items", data, "Item", reset);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
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
            errors={errors}
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
            className="w-full"
          />
          <TextInput
            label="Item Quantity"
            name="qty"
            register={register}
            errors={errors}
            type="number"
            className="w-full"
          />
          <SelectInput
            name="unitId"
            label="Select the Item Unit"
            register={register}
            errors={errors}
            className="w-full"
            options={units}
          />
          <SelectInput
            name="brandId"
            label="Select the Item Brand"
            register={register}
            errors={errors}
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
            type="number"
            register={register}
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Re-Order Point"
            name="reOrderPoint"
            type="number"
            register={register}
            errors={errors}
            className="w-full"
          />
          <SelectInput
            name="warehouseId"
            label="Select the Item Warehouse"
            register={register}
            errors={errors}
            className="w-full"
            options={warehouses}
          />
          <TextInput
            label="Item Weight in Kgs"
            name="weight"
            type="number"
            register={register}
            errors={errors}
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
          <div className="sm:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <label
                htmlFor="course-image"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-50 mb-2"
              >
                Item Image
              </label>
            </div>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setImageUrl(res[0].url);
                console.log("Upload Completed");
              }}
              onUploadError={(error) => {
                console.log(`ERROR! ${error.message}`);
              }}
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Item image"
                width={1000}
                height={667}
                className="w-32 h-32 object-cover"
              />
            )}
          </div>
        </div>
        <SubmitButton
          isLoading={loading}
          title={isUpdate ? "Updated Item" : "New Item"}
        />
      </form>
    </div>
  );
}
