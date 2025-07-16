import React from "react";
import SalesActivityCard from "./SalesActivityCard";
import InventorySummaryCard from "./InventorySummaryCard";
import { getData } from "@/lib/getData";

export default async function SalesOverview() {
  const categories = (await getData("categories")) || [];
  const items = (await getData("items")) || [];
  const warehouses = (await getData("warehouse")) || [];
  const suppliers = (await getData("suppliers")) || [];

  // Parallel fetching
  // const [categories, items, warehouses, suppliers] = await Promise.all([
  //   categoriesData,
  //   itemsData,
  //   warehousesData,
  //   suppliersData,
  // ]);
  const inventorySummary = warehouses.map((item, i) => {
    return {
      title: item.title,
      number: item.warehouseItems.length,
    };
  });

  const salesActivity = [
    {
      title: "Categories",
      number: categories.length,
      unit: "Qty",
      href: "/dashboard/inventory/categories",
      color: "text-blue-600",
    },
    {
      title: "Items",
      number: items.length,
      unit: "Pkgs",
      href: "/dashboard/inventory/items",
      color: "text-red-600",
    },
    {
      title: "Warehouses",
      number: warehouses.length,
      unit: "Pkgs",
      href: "/dashboard/inventory/warehouse",
      color: "text-green-600",
    },
    {
      title: "Suppliers",
      number: suppliers.length,
      unit: "Qty",
      href: "/dashboard/inventory/suppliers",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="bg-blue-50 border-b border-slate-300  grid grid-cols-12 gap-4">
      {/* SALES ACTIVITY */}
      <div className="col-span-full lg:col-span-8 border-r border-slate-300 p-8 py-16 lg:py-8">
        <h2 className="mb-6 text-xl">Overview</h2>
        <div className=" pr-8 grid sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-4">
          {/* Card */}
          {salesActivity &&
            salesActivity.map((item, i) => {
              return <SalesActivityCard item={item} key={i} />;
            })}
        </div>
      </div>
      {/* INVENTORY SUMMARY */}
      <div className="col-span-full lg:col-span-4 p-8">
        <h2 className="mb-6 text-xl">Inventory Summary</h2>
        <div className="">
          {inventorySummary.map((item, i) => {
            return <InventorySummaryCard item={item} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
}
