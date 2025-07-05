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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import CollapsibleLink from "./CollapsibleLink";

function Sidebar() {
  const inventoryLinks = [
    {
      title: "Items",
      href: "",
    },
    {
      title: "Item Groups",
      href: "",
    },
    {
      title: "Inventory Adjustments",
      href: "",
    },
  ];
  return (
    <div className="w-60 min-h-screen bg-slate-800 text-slate-50 fixed flex flex-col justify-between">
      {/* TOP */}

      <div className="flex flex-col">
        {/* Logo */}
        {/* PR link */}
        <Link
          href="#"
          className="bg-slate-950 flex space-x-2 items-center py-3 px-2"
        >
          <Store />
          <span className="font-semibold text-xl">Inventory</span>
        </Link>
        {/* Links */}
        {/* PR classname */}
        <nav className="flex flex-col gap-3 px-3 py-6">
          {/* PR href and classname */}
          <Link
            className="flex items-center space-x-2 bg-blue-600 text-slate-50 p-2 rounded-md"
            href="#"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Collapsible>
            <CollapsibleTrigger className="cursor-pointer flex items-center space-x-2 p-2">
              <BaggageClaim className="w-4 h-4" />
              <span>Inventory</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {inventoryLinks.map((items, i) => {
                return (
                  <CollapsibleLink
                    key={i}
                    href={items.href}
                    title={items.title}
                  />
                );
              })}
            </CollapsibleContent>
          </Collapsible>

          <button className="cursor-pointer flex items-center space-x-2 p-2">
            <ShoppingBasket className="w-4 h-4" />
            <span>Sales</span>
          </button>
          <button className="cursor-pointer flex items-center space-x-2 p-2">
            {/* PR */}
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
          {/* PR END */}
        </nav>
        <SubscriptionCard />
      </div>

      {/* Bottom */}
      {/* PR classname */}
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
