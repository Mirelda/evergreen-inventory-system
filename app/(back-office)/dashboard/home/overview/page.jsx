"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import SalesOverview from "@/components/dashboard/SalesOverview";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import ChartCard from "@/components/dashboard/ChartCard";
import BarChart from "@/components/dashboard/BarChart";
import PieChart from "@/components/dashboard/PieChart";

function Dashboard() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState({
    overview: null,
    lowStock: [],
    inventoryValue: null,
    stockMovement: null,
    sales: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [overviewRes, lowStockRes, inventoryValueRes, stockMovementRes, salesRes] = await Promise.all([
          fetch('/api/analytics/overview'),
          fetch('/api/analytics/low-stock'),
          fetch('/api/analytics/inventory-value'),
          fetch('/api/analytics/stock-movement'),
          fetch('/api/sales')
        ]);

        const [overview, lowStock, inventoryValue, stockMovement, sales] = await Promise.all([
          overviewRes.json(),
          lowStockRes.json(),
          inventoryValueRes.json(),
          stockMovementRes.json(),
          salesRes.json()
        ]);

        setAnalyticsData({
          overview,
          lowStock,
          inventoryValue,
          stockMovement,
          sales
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            <div className="mt-2 text-sm text-gray-500">
              Logged in as: {session?.user?.email || "user@example.com"}
            </div>
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
            <div className="text-xs text-gray-400">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Items"
          value={analyticsData.overview?.totalItems || 0}
          change="+12%"
          changeType="positive"
          color="blue"
        />
        <AnalyticsCard
          title="Total Value"
          value={`$${(analyticsData.inventoryValue?.totalInventoryValue || 0).toLocaleString()}`}
          change="+8%"
          changeType="positive"
          color="green"
        />
        <AnalyticsCard
          title="Low Stock Items"
          value={analyticsData.lowStock?.length || 0}
          change="+3"
          changeType="negative"
          color="red"
        />
        <AnalyticsCard
          title="Total Categories"
          value={analyticsData.overview?.totalCategories || 0}
          change="+2"
          changeType="positive"
          color="purple"
        />
      </div>

      {/* Sales Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.sales?.length || 0}
          change={`+${analyticsData.sales?.length || 0}`}
          changeType="positive"
          color="indigo"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${(analyticsData.sales?.reduce((sum, sale) => sum + sale.totalAmount, 0) || 0).toFixed(2)}`}
          change={`+$${(analyticsData.sales?.reduce((sum, sale) => sum + sale.totalAmount, 0) || 0).toFixed(2)}`}
          changeType="positive"
          color="green"
        />
        <AnalyticsCard
          title="Today's Sales"
          value={analyticsData.sales?.filter(sale => {
            const today = new Date().toDateString();
            return new Date(sale.createdAt).toDateString() === today;
          }).length || 0}
          change="Today"
          changeType="neutral"
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Inventory Value by Category">
          <PieChart 
            data={(analyticsData.inventoryValue?.categoryBreakdown || []).map(item => ({
              label: item.category,
              value: item.value
            }))}
          />
        </ChartCard>
        
        <ChartCard title="Stock Movement (Last 30 Days)">
          <BarChart 
            data={(analyticsData.stockMovement?.recentAdjustments || []).map(item => ({
              label: item.item?.title || 'Unknown',
              value: item.addStockQuantity || item.transferStockQuantity || 0
            }))}
          />
        </ChartCard>
      </div>

      {/* Low Stock Alerts */}
      {analyticsData.lowStock && analyticsData.lowStock.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Low Stock Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.lowStock.slice(0, 6).map((item, index) => (
              <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h4 className="font-medium text-red-800">{item.title}</h4>
                <p className="text-sm text-red-600">
                  Quantity: {item.quantity} {item.unit?.abbreviation || 'units'}
                </p>
                <p className="text-xs text-red-500">
                  Reorder Point: {item.reorderPoint} {item.unit?.abbreviation || 'units'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Overview */}
      <SalesOverview />
    </div>
  );
}

export default Dashboard;
