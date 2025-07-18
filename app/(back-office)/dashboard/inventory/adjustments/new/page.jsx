import AdjustmentForm from "@/components/dashboard/AdjustmentForm";
import { getData } from "@/lib/getData";

export default async function NewAdjustments({ searchParams }) {
  const itemsData = getData("items");
  const warehousesData = getData("warehouse");
  const [items, warehouses] = await Promise.all([
    itemsData,
    warehousesData,
  ]);
  
  // Get the pre-selected item ID from URL params
  const preSelectedItemId = searchParams?.itemId || null;
  
  return (
    <AdjustmentForm
      items={items}
      warehouses={warehouses}
      preSelectedItemId={preSelectedItemId}
    />
  );
}
