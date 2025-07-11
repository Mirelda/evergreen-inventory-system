"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import FormHeader from "@/components/dashboard/FormHeader";
import { useForm } from "react-hook-form";
import TextInput from "@/components/formInputs/TextInput";
import TextAreaInput from "@/components/formInputs/TextAreaInput";
import SelectInput from "@/components/formInputs/SelectInput";
import SubmitButton from "@/components/formInputs/SubmitButton";
import { getData } from "@/lib/utils";

function EditItem() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch item data and form options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemData, categoriesData, unitsData, brandsData, warehousesData] = await Promise.all([
          fetch(`/api/items/${params.id}`).then(res => res.json()),
          getData('categories'),
          getData('units'),
          getData('brands'),
          getData('warehouse')
        ]);

        setItem(itemData);
        setCategories(categoriesData.map(cat => ({ label: cat.title, value: cat.id })));
        setUnits(unitsData.map(unit => ({ label: unit.title, value: unit.id })));
        setBrands(brandsData.map(brand => ({ label: brand.title, value: brand.id })));
        setWarehouses(warehousesData.map(warehouse => ({ label: warehouse.title, value: warehouse.id })));

        // Set form values
        if (itemData) {
          setValue('title', itemData.title);
          setValue('description', itemData.description || '');
          setValue('sku', itemData.sku || '');
          setValue('barcode', itemData.barcode || '');
          setValue('quantity', itemData.quantity);
          setValue('unitId', itemData.unitId);
          setValue('brandId', itemData.brandId);
          setValue('categoryId', itemData.categoryId);
          setValue('warehouseId', itemData.warehouseId || '');
          setValue('unitPrice', itemData.unitPrice);
          setValue('sellingPrice', itemData.sellingPrice);
          setValue('buyingPrice', itemData.buyingPrice);
          setValue('reorderPoint', itemData.reorderPoint || '');
          setValue('dimensions', itemData.dimensions || '');
          setValue('taxRate', itemData.taxRate || '');
          setValue('notes', itemData.notes || '');
        }
      } catch (err) {
        setError('Failed to fetch item data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, setValue]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const response = await fetch(`/api/items/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          quantity: parseInt(data.quantity),
          unitPrice: parseFloat(data.unitPrice),
          sellingPrice: parseFloat(data.sellingPrice),
          buyingPrice: parseFloat(data.buyingPrice),
          reorderPoint: data.reorderPoint ? parseInt(data.reorderPoint) : null,
          taxRate: data.taxRate ? parseFloat(data.taxRate) : null,
        }),
      });

      if (response.ok) {
        alert('Item updated successfully!');
        router.push('/dashboard/inventory/items');
      } else {
        const errorData = await response.json();
        alert(`Error updating item: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Item not found</p>
      </div>
    );
  }

  return (
    <div>
      <FormHeader title={`Edit Item: ${item.title}`} href="/dashboard/inventory/items" />

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
            label="Barcode"
            name="barcode"
            register={register}
            errors={errors}
            isRequired={false}
            className="w-full"
            placeholder="e.g., 1234567890123"
          />

          {/* Quantity */}
          <TextInput
            label="Quantity"
            name="quantity"
            type="number"
            register={register}
            errors={errors}
            className="w-full"
            validation={{
              min: { value: 0, message: "Quantity must be 0 or greater" }
            }}
          />

          {/* Unit */}
          <SelectInput
            name="unitId"
            label="Unit"
            register={register}
            errors={errors}
            className="w-full"
            options={units}
          />

          {/* Brand */}
          <SelectInput
            name="brandId"
            label="Brand"
            register={register}
            errors={errors}
            className="w-full"
            options={brands}
          />

          {/* Warehouse */}
          <SelectInput
            name="warehouseId"
            label="Warehouse"
            register={register}
            errors={errors}
            isRequired={false}
            className="w-full"
            options={warehouses}
          />

          {/* Unit Price */}
          <TextInput
            label="Unit Price"
            name="unitPrice"
            type="number"
            step="0.01"
            register={register}
            errors={errors}
            className="w-full"
            validation={{
              min: { value: 0, message: "Unit price must be 0 or greater" }
            }}
          />

          {/* Selling Price */}
          <TextInput
            label="Selling Price"
            name="sellingPrice"
            type="number"
            step="0.01"
            register={register}
            errors={errors}
            className="w-full"
            validation={{
              min: { value: 0, message: "Selling price must be 0 or greater" }
            }}
          />

          {/* Buying Price */}
          <TextInput
            label="Buying Price"
            name="buyingPrice"
            type="number"
            step="0.01"
            register={register}
            errors={errors}
            className="w-full"
            validation={{
              min: { value: 0, message: "Buying price must be 0 or greater" }
            }}
          />

          {/* Reorder Point */}
          <TextInput
            label="Reorder Point"
            name="reorderPoint"
            type="number"
            register={register}
            errors={errors}
            isRequired={false}
            className="w-full"
            validation={{
              min: { value: 0, message: "Reorder point must be 0 or greater" }
            }}
          />

          {/* Dimensions */}
          <TextInput
            label="Dimensions"
            name="dimensions"
            register={register}
            errors={errors}
            isRequired={false}
            className="w-full"
            placeholder="e.g., 10x5x2 cm"
          />

          {/* Tax Rate */}
          <TextInput
            label="Tax Rate (%)"
            name="taxRate"
            type="number"
            step="0.01"
            register={register}
            errors={errors}
            isRequired={false}
            className="w-full"
            validation={{
              min: { value: 0, message: "Tax rate must be 0 or greater" },
              max: { value: 100, message: "Tax rate cannot exceed 100%" }
            }}
          />

          {/* Description */}
          <TextAreaInput
            label="Description"
            name="description"
            register={register}
            errors={errors}
            isRequired={false}
            className="sm:col-span-2"
            validation={{
              maxLength: { value: 500, message: "Description must be less than 500 characters" }
            }}
            placeholder="Detailed description of the item"
            rows={3}
          />

          {/* Notes */}
          <TextAreaInput
            label="Notes"
            name="notes"
            register={register}
            errors={errors}
            isRequired={false}
            className="sm:col-span-2"
            validation={{
              maxLength: { value: 1000, message: "Notes must be less than 1000 characters" }
            }}
            placeholder="Additional notes about the item"
            rows={3}
          />
        </div>

        <SubmitButton isLoading={submitting} title="Update Item" />
      </form>
    </div>
  );
}

export default EditItem; 