"use client";
import {
  BaggageClaim,
  BarChart4,
  Cable,
  ChevronLeft,
  Files,
  Home,
  PlusCircle,
  ShoppingBag,
  ShoppingBasket,
  Store,
} from "lucide-react";
import Link from "next/link";
import SubscriptionCard from "./SubscriptionCard";

import CollapsibleLink from "./CollapsibleLink";
import SidebarDropdownLink from "./SidebarDropdownLink";

function Sidebar() {
  const inventoryLinks = [
    {
      title: "Items",
      href: "/dashboard/inventory",
    },
    {
      title: "Categories",
      href: "/dashboard/inventory",
    },
    {
      title: "Brands",
      href: "/dashboard/inventory",
    },
    {
      title: "Units",
      href: "/dashboard/inventory",
    },
    {
      title: "Warehouse",
      href: "/dashboard/inventory",
    },
    {
      title: "Inventory Adjustments",
      href: "",
    },
  ];

  const salesLinks = [
    {
      title: "Customers",
      href: "#",
    },
    {
      title: "Sales Orders",
      href: "#",
    },
    {
      title: "Packages",
      href: "#",
    },
    {
      title: "Shipments",
      href: "#",
    },
    {
      title: "Invoices",
      href: "#",
    },
    {
      title: "Sales Receipts",
      href: "#",
    },
    {
      title: "Payment Received",
      href: "#",
    },
    {
      title: "Sales Returns",
      href: "#",
    },
    {
      title: "Credit Notes",
      href: "#",
    },
  ];

  return (
    <div className="w-60 min-h-screen bg-slate-800 text-slate-50 fixed flex flex-col justify-between">
      {/* TOP */}

      <div className="flex flex-col">
        {/* Logo */}

        <Link
          href="#"
          className="bg-slate-950 flex space-x-2 items-center py-3 px-2"
        >
          <Store />
          <span className="font-semibold text-xl">Inventory</span>
        </Link>
        {/* Links */}

        <nav className="flex flex-col gap-3 px-3 py-6">
          <Link
            className="flex items-center space-x-2 bg-blue-600 text-slate-50 p-2 rounded-md"
            href="#"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <SidebarDropdownLink
            title="Inventory"
            items={inventoryLinks}
            icon={BaggageClaim}
          />

          <SidebarDropdownLink
            title="Sales"
            items={salesLinks}
            icon={ShoppingBasket}
          />

          <button className="cursor-pointer flex items-center space-x-2 p-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Purchases</span>
          </button>
          <Link className="flex items-center space-x-2 p-2" href="#">
            <Cable className="w-4 h-4" />
            <span>Integrations</span>
          </Link>
          <Link className="flex items-center space-x-2 p-2" href="#">
            <BarChart4 className="w-4 h-4" />
            <span>Reports</span>
          </Link>
          <Link className="flex items-center space-x-2 p-2" href="#">
            <Files className="w-4 h-4" />
            <span>Documents</span>
          </Link>
        </nav>
        <SubscriptionCard />
      </div>

      {/* Bottom */}

      <div className="flex flex-col">
        <button className="cursor-pointer bg-slate-950 flex space-x-2 items-center justify-center py-3 px-2">
          <ChevronLeft />
        </button>
      </div>
      {/* Subscription card */}
      {/* Footer icon */}
    </div>
  );
}

export default Sidebar;
