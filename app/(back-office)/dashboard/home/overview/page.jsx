import SalesOverview from "@/components/dashboard/SalesOverview";
import React from "react";

import { getData } from "@/lib/getData";

import DashboardOverview from "@/components/dashboard/DashboardOverview";

export default async function Dashboard() {
  // const items = await getData("items");
  const warehouses = await getData("warehouse");
  const items = await getData("items");
  // console.log(warehouses);
  return (
    <div>
      {/* <DashboardBanner /> */}
      <SalesOverview />
      {/* <CurrentStock title=" Available Stock Items Stock" items={items} /> */}
      <DashboardOverview items={items} warehouses={warehouses} />
    </div>
  );
}
