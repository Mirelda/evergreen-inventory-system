"use client";

import FixedHeader from "@/components/dashboard/FixedHeader";
import OptionCard from "@/components/dashboard/OptionCard";
import { LayoutGrid, LayoutPanelTop, Slack, Warehouse, Scale, Diff } from "lucide-react";
import Link from "next/link";

function Inventory() {
  const optionCards = [
    {
      title: "Items",
      description: "Create standalone items and services that you buy and sell",
      link: "/dashboard/inventory/items/new",
      linkTitle: "New Item",
      enabled: true,
      icon: LayoutGrid,
    },
    {
      title: "Categories",
      description: "Bundle different items together and sell them as kits",
      link: "/dashboard/inventory/categories/new",
      linkTitle: "New Category",
      enabled: true,
      icon: LayoutPanelTop,
    },
    {
      title: "Brands",
      description:
        "Tweak your item prices for specific contacts or transactions",
      link: "/dashboard/inventory/brands/new",
      linkTitle: "New Brand",
      enabled: true,
      icon: Slack,
    },
    {
      title: "Warehouse",
      description:
        "Tweak your item prices for specific contacts or transactions",
      link: "/dashboard/inventory/warehouse/new",
      linkTitle: "New Warehouse",
      enabled: true,
      icon: Warehouse,
    },
    {
      title: "Units",
      description:
        "Tweak your item prices for specific contacts or transactions",
      link: "/dashboard/inventory/units/new",
      linkTitle: "New Unit",
      enabled: true,
      icon: Scale,
    },
    {
      title: "Inventory Adjustments",
      description:
        "Add or transfer stock between warehouses",
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
