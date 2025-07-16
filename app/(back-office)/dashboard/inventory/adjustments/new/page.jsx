import AdjustmentForm from "@/components/dashboard/AdjustmentForm";
import { getData } from "@/lib/getData";
export default async function NewAdjustments() {
  const itemsData = getData("items");
  const warehousesData = getData("warehouse");
  const suppliersData = getData("suppliers");
  const [items, warehouses, suppliers] = await Promise.all([
    itemsData,
    warehousesData,
    suppliersData,
  ]);
  return (
    <AdjustmentForm
      items={items}
      suppliers={suppliers}
      warehouses={warehouses}
    />
  );
}
