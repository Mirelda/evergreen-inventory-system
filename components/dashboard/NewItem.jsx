import CreateItemForm from "@/components/dashboard/CreateItemForm";
import FormHeader from "@/components/dashboard/FormHeader";
import { getData } from "@/lib/getData";
export default async function NewItem({ initialData = {}, isUpdate = false }) {
  const categoriesData = getData("categories");
  const unitsData = getData("units");
  const brandsData = getData("brands");
  const warehousesData = getData("warehouse");

  // Parallel fetching
  const [categories, units, brands, warehouses] = await Promise.all([
    categoriesData,
    unitsData,
    brandsData,
    warehousesData,
  ]);

  // Transform data to the format expected by SelectInput ({value, label})
  const transformedCategories = categories?.map(cat => ({
    value: cat.id,
    label: cat.title
  })) || [];

  const transformedUnits = units?.map(unit => ({
    value: unit.id,
    label: unit.title
  })) || [];

  const transformedBrands = brands?.map(brand => ({
    value: brand.id,
    label: brand.title
  })) || [];

  return (
    <div>
      {/* Header */}
      <FormHeader
        title={isUpdate ? "Update Item" : "New Item"}
        href="/dashboard/inventory/items"
      />
      {/* Form */}
      <CreateItemForm
        categories={transformedCategories}
        units={transformedUnits}
        brands={transformedBrands}
        warehouses={warehouses}
        initialData={initialData}
        isUpdate={isUpdate}
      />
    </div>
  );
}
