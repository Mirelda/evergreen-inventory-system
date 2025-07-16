"use client";

import { useState, useEffect } from "react";
import SalesOverview from "@/components/dashboard/SalesOverview";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import ChartCard from "@/components/dashboard/ChartCard";
import BarChart from "@/components/dashboard/BarChart";
import PieChart from "@/components/dashboard/PieChart";

function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState({
    overview: null,
    lowStock: [],
    inventoryValue: null,
    stockMovement: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [overviewRes, lowStockRes, inventoryValueRes, stockMovementRes] = await Promise.all([
          fetch('/api/analytics/overview'),
          fetch('/api/analytics/low-stock'),
          fetch('/api/analytics/inventory-value'),
          fetch('/api/analytics/stock-movement')
        ]);

        const [overview, lowStock, inventoryValue, stockMovement] = await Promise.all([
          overviewRes.json(),
          lowStockRes.json(),
          inventoryValueRes.json(),
          stockMovementRes.json()
        ]);

        setAnalyticsData({
          overview,
          lowStock,
          inventoryValue,
          stockMovement
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
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
      {/* Top Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
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
