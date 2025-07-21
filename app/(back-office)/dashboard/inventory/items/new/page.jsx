"use client";
import FormHeader from "@/components/dashboard/FormHeader";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import TextInput from "@/components/formInputs/TextInput";
import { useState, useEffect } from "react";
import SubmitButton from "@/components/formInputs/SubmitButton";
import TextAreaInput from "@/components/formInputs/TextAreaInput";
import SelectInput from "@/components/formInputs/SelectInput";
import { UploadButton } from "@/lib/uploadthing";
import { UploadDropzone } from "@uploadthing/react";
import { getData } from "@/lib/utils";

function NewItem() {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, unitsData, brandsData, warehousesData] = await Promise.all([
          getData('categories'),
          getData('units'),
          getData('brands'),
          getData('warehouse')
        ]);

        setCategories(categoriesData.map(cat => ({ label: cat.title, value: cat.id })));
        setUnits(unitsData.map(unit => ({ label: unit.title, value: unit.id })));
        setBrands(brandsData.map(brand => ({ label: brand.title, value: brand.id })));
        setWarehouses(warehousesData.map(warehouse => ({ label: warehouse.title, value: warehouse.id })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      sku: "",
      barcode: "",
      quantity: 0,
      buyingPrice: 0,
      sellingPrice: 0,
      reOrderPoint: 0,
      weight: 0,
      taxRate: 0,
      dimensions: "",
      description: "",
      notes: "",
      imageUrl: "",
    }
  });

  const imageUrl = watch("imageUrl");

  async function onSubmit(data) {
    console.log(data);
    setLoading(true);
    try {
      const response = await fetch('/api/items', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Item created successfully:", result);
        setLoading(false);
        reset();
        alert("Item created successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error creating item:", errorData);
        setLoading(false);
        alert("Error creating item. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Error creating item. Please try again.");
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
          {/* Item Title */}
          <TextInput
            label="Item Title"
            name="title"
            register={register}
            errors={errors}
            className="w-full"
            validation={{
              minLength: { value: 2, message: "Title must be at least 2 characters" },
              maxLength: { value: 100, message: "Title must be less than 100 characters" }
            }}
          />

          {/* Category */}
          <SelectInput
            name="categoryId"
            label="Item Category"
            register={register}
            errors={errors}
            className="w-full"
            options={categories}
          />

          {/* SKU */}
          <TextInput
            label="Item SKU"
            name="sku"
            register={register}
            errors={errors}
            className="w-full"
            validation={{
              pattern: {
                value: /^[A-Z0-9]{3,20}$/,
                message: "SKU must be 3-20 characters, uppercase letters and numbers only"
              }
            }}
            placeholder="e.g., ITM001, PROD123"
          />

          {/* Barcode */}
          <TextInput
            label="Item Barcode"
            name="barcode"
            register={register}
            errors={errors}
            isRequired={false}
            className="w-full"
            validation={{
              pattern: {
                value: /^[0-9]{8,13}$/,
                message: "Barcode must be 8-13 digits"
              }
            }}
            placeholder="e.g., 1234567890123"
          />

          {/* Quantity */}
          <TextInput
            label="Item Quantity"
            name="qty"
            register={register}
            errors={errors}
            type="number"
            className="w-full"
            validation={{
              min: { value: 0, message: "Quantity must be 0 or greater" },
              max: { value: 999999, message: "Quantity must be less than 1,000,000" }
            }}
            placeholder="0"
          />

          {/* Unit */}
          <SelectInput
            name="unitId"
            label="Item Unit"
            register={register}
            errors={errors}
            className="w-full"
            options={units}
          />

          {/* Brand */}
          <SelectInput
            name="brandId"
            label="Item Brand"
            register={register}
            errors={errors}
            className="w-full"
            options={brands}
          />

          {/* Buying Price */}
          <TextInput
            label="Buying Price"
            name="buyingPrice"
            register={register}
            errors={errors}
            type="number"
            className="w-full"
            validation={{
              min: { value: 0, message: "Price must be 0 or greater" },
              max: { value: 999999.99, message: "Price must be less than 1,000,000" }
            }}
            placeholder="0.00"
          />

          {/* Selling Price */}
          <TextInput
            label="Selling Price"
            name="sellingPrice"
            register={register}
            errors={errors}
            type="number"
            className="w-full"
            validation={{
              min: { value: 0, message: "Price must be 0 or greater" },
              max: { value: 999999.99, message: "Price must be less than 1,000,000" }
            }}
            placeholder="0.00"
          />



          {/* Re-Order Point */}
          <TextInput
            label="Re-Order Point"
            name="reOrderPoint"
            register={register}
            errors={errors}
            type="number"
            className="w-full"
            validation={{
              min: { value: 0, message: "Re-order point must be 0 or greater" },
              max: { value: 999999, message: "Re-order point must be less than 1,000,000" }
            }}
            placeholder="0"
          />

          {/* Warehouse */}
          <SelectInput
            name="warehouseId"
            label="Item Warehouse"
            register={register}
            errors={errors}
            className="w-full"
            options={warehouses}
          />

          {/* Weight */}
          <TextInput
            label="Item Weight (kg)"
            name="weight"
            register={register}
            errors={errors}
            type="number"
            className="w-full"
            validation={{
              min: { value: 0, message: "Weight must be 0 or greater" },
              max: { value: 9999.99, message: "Weight must be less than 10,000 kg" }
            }}
            placeholder="0.00"
          />

          {/* Dimensions */}
          <TextInput
            label="Item Dimensions (cm)"
            name="dimensions"
            register={register}
            errors={errors}
            className="w-full"
            validation={{
              pattern: {
                value: /^\d+\s*x\s*\d+\s*x\s*\d+$/,
                message: "Format: 20 x 30 x 100 (L x W x H)"
              }
            }}
            placeholder="20 x 30 x 100"
          />

          {/* Tax Rate */}
          <TextInput
            label="Tax Rate (%)"
            name="taxRate"
            type="number"
            register={register}
            errors={errors}
            className="w-full"
            validation={{
              min: { value: 0, message: "Tax rate must be 0 or greater" },
              max: { value: 100, message: "Tax rate must be 100% or less" }
            }}
            placeholder="0"
          />

          {/* Description */}
          <TextAreaInput
            label="Item Description"
            name="description"
            register={register}
            errors={errors}
            isRequired={false}
          />

          {/* Notes */}
          <TextAreaInput
            label="Item Notes"
            name="notes"
            register={register}
            errors={errors}
            isRequired={false}
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
                setValue("imageUrl", res[0].url);
                console.log(res[0].url);
                alert("Upload Completed");
              }}
              onUploadError={(error) => {
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
