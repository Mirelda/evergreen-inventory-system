import DashboardOverview from "@/components/dashboard/DashboardOverview";
import FixedHeader from "@/components/dashboard/FixedHeader";
import { getData } from "@/lib/getData";

export default async function Adjustments() {
  const warehouses = await getData("warehouse");
  const items = await getData("items");

  return (
    <div>
      <FixedHeader
        title="Adjustments"
        newLink="/dashboard/inventory/adjustments/new"
      />
      <DashboardOverview items={items} warehouses={warehouses} />
    </div>
  );
}
