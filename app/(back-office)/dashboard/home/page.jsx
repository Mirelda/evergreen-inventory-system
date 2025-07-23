"use client";

import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import ChartCard from '@/components/dashboard/ChartCard';
import BarChart from '@/components/dashboard/BarChart';
import PieChart from '@/components/dashboard/PieChart';
import { 
  Package, 
  Tag, 
  Building2, 
  Warehouse, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  Calendar
} from 'lucide-react';

async function getAnalytics() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/analytics/overview`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

async function DashboardPage() {
  const analytics = await getAnalytics();
  const { metrics, charts, growth } = analytics;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your inventory management system</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Items"
          value={metrics.totalItems}
          change={growth.items}
          changeType={growth.items > 0 ? 'positive' : 'negative'}
          icon={Package}
          color="blue"
          formatValue={(val) => val.toLocaleString()}
        />
        
        <AnalyticsCard
          title="Total Categories"
          value={metrics.totalCategories}
          change={growth.categories}
          changeType={growth.categories > 0 ? 'positive' : 'negative'}
          icon={Tag}
          color="green"
          formatValue={(val) => val.toLocaleString()}
        />
        
        <AnalyticsCard
          title="Total Brands"
          value={metrics.totalBrands}
          change={growth.brands}
          changeType={growth.brands > 0 ? 'positive' : 'negative'}
          icon={Building2}
          color="purple"
          formatValue={(val) => val.toLocaleString()}
        />
        
        <AnalyticsCard
          title="Total Warehouses"
          value={metrics.totalWarehouses}
          change={growth.warehouses}
          changeType={growth.warehouses > 0 ? 'positive' : 'negative'}
          icon={Warehouse}
          color="orange"
          formatValue={(val) => val.toLocaleString()}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Low Stock Items"
          value={metrics.lowStockItems}
          icon={AlertTriangle}
          color="red"
          subtitle="Items with quantity ≤ 10"
        />
        
        <AnalyticsCard
          title="Out of Stock"
          value={metrics.outOfStockItems}
          icon={AlertTriangle}
          color="red"
          subtitle="Items with zero quantity"
        />
        
        <AnalyticsCard
          title="Recent Items"
          value={metrics.recentItems}
          icon={Calendar}
          color="indigo"
          subtitle="Added in last 30 days"
        />
        
        <AnalyticsCard
          title="Inventory Value"
          value={metrics.totalInventoryValue}
          icon={DollarSign}
          color="green"
          formatValue={(val) => `$${val.toLocaleString()}`}
          subtitle="Total stock value"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Top Categories by Item Count">
          <BarChart 
            data={charts.topCategories} 
            height={300}
            colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']}
          />
        </ChartCard>

        <ChartCard title="Top Brands by Item Count">
          <BarChart 
            data={charts.topBrands} 
            height={300}
            colors={['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']}
          />
        </ChartCard>
      </div>

      {/* Warehouse Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Warehouse Activity Distribution">
          <PieChart 
            data={charts.warehouseDistribution} 
            size={250}
            colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']}
          />
        </ChartCard>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Add New Item</div>
                  <div className="text-sm text-gray-500">Create a new inventory item</div>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-medium text-gray-900">Low Stock Alert</div>
                  <div className="text-sm text-gray-500">View items that need restocking</div>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">View Reports</div>
                  <div className="text-sm text-gray-500">Access detailed analytics</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
