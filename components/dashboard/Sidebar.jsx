"use client";
import {
  BaggageClaim,
  BarChart4,
  Cable,
  ChevronLeft,
  Files,
  Home,
  ShoppingBag,
  ShoppingBasket,
  Store,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import SubscriptionCard from "./SubscriptionCard";
import { useSession } from "next-auth/react";
import SidebarDropdownLink from "./SidebarDropdownLink";
import { useState } from "react";

function Sidebar({ showSidebar, setShowSidebar, collapsed, setCollapsed }) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const handleMobileClose = () => {
    if (window.innerWidth < 1024) setShowSidebar(false);
  };

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

  return (
    <aside
      className={`
        fixed lg:static top-0 left-0 min-h-screen ${collapsed ? 'w-16' : 'w-60'} bg-slate-800 text-slate-50 z-50 flex flex-col
        transition-all duration-300
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      <div className="bg-slate-950 flex items-center justify-between py-3 px-2">
        <span className="flex items-center font-semibold text-xl">
          <Store className="w-6 h-6 mr-2" />
          {!collapsed && 'Inventory'}
        </span>
        <button
          onClick={() => setShowSidebar(false)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-2 px-2 py-4">
        <Link
          className={`flex items-center rounded-md transition-all h-12 w-full
            ${collapsed ? 'justify-center p-0' : 'space-x-2 p-2'}
            bg-blue-600 text-slate-50`}
          href="/dashboard/home"
          onClick={handleMobileClose}
        >
          <Home className="w-5 h-5" />
          {!collapsed && <span>Home</span>}
        </Link>
        <SidebarDropdownLink
          title={!collapsed ? "Inventory" : ""}
          items={inventoryLinks}
          icon={BaggageClaim}
          onLinkClick={handleMobileClose}
          collapsed={collapsed}
        />
        <Link
          className={`flex items-center rounded-md transition-all h-12 w-full hover:bg-slate-700
            ${collapsed ? 'justify-center p-0' : 'space-x-2 p-2'}`}
          href="/dashboard/sales"
          onClick={handleMobileClose}
        >
          <ShoppingBasket className="w-5 h-5" />
          {!collapsed && <span>Sales</span>}
        </Link>
        
        {(userRole === "ADMIN" || userRole === "MANAGER") && (
          <>
            <Link
              className={`flex items-center rounded-md transition-all h-12 w-full hover:bg-slate-700 ${collapsed ? 'justify-center p-0' : 'space-x-2 p-2'}`}
              href="/dashboard/purchases"
              onClick={handleMobileClose}
            >
              <ShoppingBag className="w-4 h-4" />
              {!collapsed && <span>Purchases</span>}
            </Link>
            <Link
              className={`flex items-center rounded-md transition-all h-12 w-full hover:bg-slate-700 ${collapsed ? 'justify-center p-0' : 'space-x-2 p-2'}`}
              href="/dashboard/integrations"
              onClick={handleMobileClose}
            >
              <Cable className="w-4 h-4" />
              {!collapsed && <span>Integrations</span>}
            </Link>
            <Link className={`flex items-center rounded-md transition-all h-12 w-full hover:bg-slate-700 ${collapsed ? 'justify-center p-0' : 'space-x-2 p-2'}`} href="/dashboard/reports" onClick={handleMobileClose}>
              <BarChart4 className="w-4 h-4" />
              {!collapsed && <span>Reports</span>}
            </Link>
            <Link className={`flex items-center rounded-md transition-all h-12 w-full hover:bg-slate-700 ${collapsed ? 'justify-center p-0' : 'space-x-2 p-2'}`} href="/dashboard/documents" onClick={handleMobileClose}>
              <Files className="w-4 h-4" />
              {!collapsed && <span>Documents</span>}
            </Link>
          </>
        )}

        {userRole === "ADMIN" && (
           <Link className={`flex items-center rounded-md transition-all h-12 w-full hover:bg-slate-700 ${collapsed ? 'justify-center p-0' : 'space-x-2 p-2'}`} href="/dashboard/users" onClick={handleMobileClose}>
             <Users className="w-4 h-4" />
             {!collapsed && <span>Users</span>}
           </Link>
        )}
      </nav>
      <SubscriptionCard />
      {/* Masaüstünde daralt/expand butonu */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="bg-slate-950 flex items-center justify-center py-3 px-0 lg:block hidden"
      >
        <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  );
}

export default Sidebar;
