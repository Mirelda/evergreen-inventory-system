"use client";

import FixedHeader from "@/components/dashboard/FixedHeader";
import OptionCard from "@/components/dashboard/OptionCard";
import { LayoutGrid, LayoutPanelTop, Slack, Warehouse, Scale, Diff } from "lucide-react";
import Link from "next/link";

function Inventory() {
  const optionCards = [
    {
      title: "Items",
      description: "Manage and view all items in your inventory",
      link: "/dashboard/inventory/items",
      linkTitle: "View Items",
      enabled: true,
      icon: LayoutGrid,
    },
    {
      title: "Categories",
      description: "Organize items into categories for better management",
      link: "/dashboard/inventory/categories",
      linkTitle: "View Categories",
      enabled: true,
      icon: LayoutPanelTop,
    },
    {
      title: "Brands",
      description: "Manage product brands and manufacturers",
      link: "/dashboard/inventory/brands",
      linkTitle: "View Brands",
      enabled: true,
      icon: Slack,
    },
    {
      title: "Warehouse",
      description: "Manage warehouse locations and stock levels",
      link: "/dashboard/inventory/warehouse",
      linkTitle: "View Warehouses",
      enabled: true,
      icon: Warehouse,
    },
    {
      title: "Units",
      description: "Manage measurement units for inventory items",
      link: "/dashboard/inventory/units",
      linkTitle: "View Units",
      enabled: true,
      icon: Scale,
    },
    {
      title: "Inventory Adjustments",
      description: "Add or transfer stock between warehouses",
      link: "/dashboard/inventory/adjustments/new",
      linkTitle: "New Adjustment",
      enabled: true,
      icon: Diff,
    },
  ];
  return (
    <div>
      <FixedHeader newLink="/dashboard/inventory/items/new" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-16 py-8 gap-6">
        {optionCards.map((card, i) => {
          return <OptionCard optionData={card} key={i} />;
        })}
      </div>
    </div>
  );
}

export default Inventory;
