"use client";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import CurrentStock from "./CurrentStock";
import DataTable from "./DataTable";

export default function DashboardOverview({ warehouses, items }) {
  // console.log(warehouses);
  const tabs = [
    {
      title: "Stock By Warehouse",
      icon: Plus,
      tab: "warehouse",
    },
    {
      title: "Stock By Item",
      icon: Minus,
      tab: "item",
    },
  ];
  const [activeTab, setActiveTab] = useState("warehouse");
  const columns = [
    "imageUrl",
    "title",
    "quantity",
    "sellingPrice",
    "createdAt",
  ];
  return (
    <div>
      <div className="border-b border-gray-200 dark:border-gray-700 w-full max-w-4xl px-4 py-2 bg-white border mx-auto my-4 shadow rounded">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <li className="mr-2" key={i}>
                <button
                  onClick={() => setActiveTab(tab.tab)}
                  className={`${
                    activeTab === tab.tab
                      ? "inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group"
                      : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 "
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-500 " />
                  {tab.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {activeTab === "warehouse" ? (
        <div className="max-w-5xl mx-auto">
          {warehouses.map((warehouse, i) => {
            return (
              <CurrentStock
                key={i}
                title={`Available Stock Items in ${warehouse.title}`}
                items={warehouse.warehouseItems}
              />
            );
          })}
        </div>
      ) : (
        <div className="my-4 px-8 ">
          <DataTable data={items} columns={columns} resourceTitle="items" />
        </div>
      )}
    </div>
  );
}
