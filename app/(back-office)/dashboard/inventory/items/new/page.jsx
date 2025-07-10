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
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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
    formState: { errors },
  } = useForm();
  async function onSubmit(data) {
    data.imageUrl = imageUrl;
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
        setImageUrl("");
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
            // Optional field
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
                // Handle successful upload
                setImageUrl(res[0].ufsUrl);
                console.log(res[0].ufsUrl);
                alert("Upload Completed");
              }}
              onUploadError={(error) => {
                // Handle upload error
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
