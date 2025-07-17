"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  DollarSign, 
  TrendingUp, 
  Receipt, 
  Package, 
  BarChart3, 
  AlertTriangle,
  Calendar,
  Hash
} from "lucide-react";

function Reports() {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) {
          throw new Error('Failed to fetch reports data');
        }
        const data = await response.json();
        setReportsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Reports</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const { summary, charts, topSellingItems, lowStockItems, recentSales } = reportsData;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
        <div className="text-sm text-gray-500 mt-1">
          Data from the last 30 days
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Sales"
          value={formatCurrency(summary.totalSales)}
          subtitle={`${summary.totalSalesQuantity} items sold`}
          icon={DollarSign}
          color="green"
        />
        <SummaryCard
          title="Total Profit"
          value={formatCurrency(summary.totalProfit)}
          subtitle={`${summary.profitMargin}% profit margin`}
          icon={TrendingUp}
          color="blue"
        />
        <SummaryCard
          title="Total Tax"
          value={formatCurrency(summary.totalTax)}
          subtitle="Calculated tax amount"
          icon={Receipt}
          color="purple"
        />
        <SummaryCard
          title="Inventory Value"
          value={formatCurrency(summary.totalInventoryValue)}
          subtitle={`Cost: ${formatCurrency(summary.totalInventoryCost)}`}
          icon={Package}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Daily Sales Trend</h3>
          </div>
          <div className="h-64">
            <DailySalesChart data={charts.dailySales} />
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
          </div>
          <div className="space-y-3">
            {charts.salesByCategory.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{item.category}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Product</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">Quantity</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellingItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm text-gray-900">{item.title}</td>
                    <td className="text-right py-3 px-2 text-sm font-medium text-gray-900">{item.quantity}</td>
                    <td className="text-right py-3 px-2 text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Product</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">Current</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">Min. Stock</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm text-gray-900">{item.title}</td>
                    <td className="text-right py-3 px-2">
                      <span className="text-sm font-medium text-red-600">{item.quantity}</span>
                    </td>
                    <td className="text-right py-3 px-2 text-sm font-medium text-gray-900">{item.reorderPoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Reference No</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">Items</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{sale.referenceNumber}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-2 text-sm font-medium text-gray-900">{formatCurrency(sale.totalAmount)}</td>
                  <td className="text-right py-3 px-2 text-sm font-medium text-gray-900">{sale.itemCount}</td>
                  <td className="text-right py-3 px-2 text-sm text-gray-600">{formatDate(sale.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ title, value, subtitle, icon: Icon, color }) {
  const colorClasses = {
    green: "bg-green-500",
    blue: "bg-blue-500", 
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Simple Daily Sales Chart Component
function DailySalesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm">No chart data available</p>
        </div>
      </div>
    );
  }

  const maxAmount = Math.max(...data.map(d => d.amount));
  
  return (
    <div className="h-full flex items-end space-x-2 px-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
            style={{ 
              height: `${(item.amount / maxAmount) * 200}px`,
              minHeight: '4px'
            }}
            title={`${formatDate(item.date)}: ${formatCurrency(item.amount)}`}
          />
          <div className="text-xs text-gray-500 mt-2 transform -rotate-45 whitespace-nowrap">
            {new Date(item.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Reports;
