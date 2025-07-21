"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import ChartCard from "@/components/dashboard/ChartCard";
import BarChart from "@/components/dashboard/BarChart";
import PieChart from "@/components/dashboard/PieChart";
import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils";

function Dashboard() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch('/api/reports');
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { summary, charts, lowStockItems } = analyticsData;

  return (
    <div className="space-y-6 p-6">
      {/* User Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hello, {session?.user?.name || "User"}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back to your inventory dashboard. Here's what's happening today.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Items"
          value={formatNumber(summary.totalItemCount || 0)}
          subtitle="Total unique products"
          color="blue"
        />
        <AnalyticsCard
          title="Total Value"
          value={formatCurrency(summary.totalInventoryValue || 0)}
          subtitle="Based on selling price"
          color="green"
        />
        <AnalyticsCard
          title="Low Stock Items"
          value={lowStockItems?.length || 0}
          subtitle="Items needing attention"
          color="red"
        />
        <AnalyticsCard
          title="Total Categories"
          value={charts.salesByCategory?.length || 0}
          subtitle="Active product categories"
          color="purple"
        />
      </div>

      {/* Sales Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Total Sales"
          value={formatNumber(summary.totalSalesQuantity || 0)}
          subtitle="Items sold in last 30 days"
          color="indigo"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={formatCurrency(summary.totalSales || 0)}
          subtitle="Revenue in last 30 days"
          color="green"
        />
        <AnalyticsCard
          title="Today's Sales"
          value={formatNumber(summary.todaysSalesCount || 0)}
          subtitle="Sales made today"
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Inventory Value by Category">
          <PieChart 
            data={charts.salesByCategory.map(item => ({
              label: item.category,
              value: item.amount
            }))}
          />
        </ChartCard>
        
        <ChartCard title="Stock Movement (Last 30 Days)">
          <BarChart 
            data={summary.stockMovement.map(item => ({
              label: item.date,
              value: item.quantity
            }))}
          />
        </ChartCard>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems && lowStockItems.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Low Stock Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.slice(0, 6).map((item) => (
              <Link href={`/dashboard/inventory/adjustments?itemId=${item.id}`} key={item.id}>
                <div className="border border-red-200 rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
                  <h4 className="font-medium text-red-800">{item.title}</h4>
                  <p className="text-sm text-red-600">
                    Quantity: {item.quantity} {item.unit?.abbreviation || 'units'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
