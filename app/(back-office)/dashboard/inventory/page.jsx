"use client";

import { useState, useEffect } from "react";
import FixedHeader from "@/components/dashboard/FixedHeader";
import OptionCard from "@/components/dashboard/OptionCard";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import { LayoutGrid, LayoutPanelTop, Slack, Warehouse, Scale, Diff, Package, AlertTriangle, DollarSign } from "lucide-react";
import Link from "next/link";

function Inventory() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics/overview');
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data.metrics);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

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
      
      {/* Analytics Overview */}
      {!loading && analytics && (
        <div className="px-16 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Inventory Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AnalyticsCard
              title="Total Items"
              value={analytics.totalItems}
              icon={Package}
              color="blue"
              formatValue={(val) => val.toLocaleString()}
            />
            
            <AnalyticsCard
              title="Low Stock Items"
              value={analytics.lowStockItems}
              icon={AlertTriangle}
              color="red"
              subtitle="Items with quantity ≤ 10"
            />
            
            <AnalyticsCard
              title="Inventory Value"
              value={analytics.totalInventoryValue}
              icon={DollarSign}
              color="green"
              formatValue={(val) => `$${val.toLocaleString()}`}
              subtitle="Total stock value"
            />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-16 py-8 gap-6">
        {optionCards.map((card, i) => {
          return <OptionCard optionData={card} key={i} />;
        })}
      </div>
    </div>
  );
}

export default Inventory;
