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
import { useState, useEffect } from "react";

function Sidebar({ collapsed, setCollapsed }) {

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [collapsed]);

  const inventoryLinks = [
    {
      title: "Items",
      href: "/dashboard/inventory/items",
    },
    {
      title: "Categories",
      href: "/dashboard/inventory/categories",
    },
    {
      title: "Brands",
      href: "/dashboard/inventory/brands",
    },
    {
      title: "Units",
      href: "/dashboard/inventory/units",
    },
    {
      title: "Warehouse",
      href: "/dashboard/inventory/warehouse",
    },
    {
      title: "Inventory Adjustments",
      href: "/dashboard/inventory/adjustments",
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
    <div className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} min-h-screen bg-slate-800 text-slate-50 fixed flex flex-col justify-between`}>
      {/* TOP */}
      <div className="flex flex-col">
        {/* Logo */}
        <Link
          href="/dashboard/home"
          className={`bg-slate-950 flex items-center justify-center py-3 ${collapsed ? 'px-0' : 'px-2'}`}
        >
          <Store className="w-6 h-6" />
          {!collapsed && <span className="font-semibold text-xl ml-2">Inventory</span>}
        </Link>
        {/* Links */}
        <nav className={`flex flex-col gap-2 ${collapsed ? 'items-center' : 'px-3 py-6'}`}> 
          <Link
            className={`flex items-center ${collapsed ? 'justify-center w-10 h-10 p-0 my-1' : 'space-x-2 bg-blue-600 text-slate-50 p-2 rounded-md'} transition-all`}
            href="/dashboard/home"
          >
            <Home className="w-5 h-5" />
            {!collapsed && <span>Home</span>}
          </Link>
          {collapsed ? (
            <>
              <Link className="flex items-center justify-center w-10 h-10 my-1" href="#"><BaggageClaim className="w-5 h-5" /></Link>
              <Link className="flex items-center justify-center w-10 h-10 my-1" href="#"><ShoppingBasket className="w-5 h-5" /></Link>
              <button className="flex items-center justify-center w-10 h-10 my-1"><ShoppingBag className="w-5 h-5" /></button>
              <Link className="flex items-center justify-center w-10 h-10 my-1" href="#"><Cable className="w-5 h-5" /></Link>
              <Link className="flex items-center justify-center w-10 h-10 my-1" href="#"><BarChart4 className="w-5 h-5" /></Link>
              <Link className="flex items-center justify-center w-10 h-10 my-1" href="#"><Files className="w-5 h-5" /></Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </nav>
        {!collapsed && <SubscriptionCard />}
      </div>
      {/* Bottom */}
      <div className="flex flex-col">
        <button onClick={() => setCollapsed(!collapsed)} className="cursor-pointer bg-slate-950 flex items-center justify-center py-3 px-0">
          <ChevronLeft className={`transition-transform duration-300 w-5 h-5 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {/* Subscription card */}
      {/* Footer icon */}
    </div>
  );
}

export default Sidebar;
