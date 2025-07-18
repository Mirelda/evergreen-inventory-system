"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { 
  Database, 
  FileText, 
  Users,
  Download, 
  Upload, 
  Activity,
  Shield,
  Clock,
  HardDrive,
  Search,
  Filter,
  RefreshCw,
  Package
} from "lucide-react";

function Documents() {
  const [activeTab, setActiveTab] = useState('overview');

  const systemFeatures = [
    {
      id: 'logs',
      title: 'System Logs',
      description: 'View and analyze system error logs, API calls, and application events',
      icon: FileText,
      color: 'blue',
      features: ['Error tracking', 'API monitoring', 'Performance logs', 'Security events']
    },
    {
      id: 'backup',
      title: 'Database Backup',
      description: 'Create, schedule, and restore database backups with full system recovery',
      icon: Database,
      color: 'green',
      features: ['Automated backups', 'Manual backup', 'Restore points', 'Backup scheduling']
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Management</h1>
        <p className="text-gray-600">Administrative tools for system monitoring, backup, and configuration</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">System Status</p>
              <p className="text-lg font-semibold text-green-600">Online</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Backup</p>
              <p className="text-lg font-semibold text-gray-900">2 hours ago</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-lg font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Security Level</p>
              <p className="text-lg font-semibold text-gray-900">High</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            System Logs
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'backup'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Database Backup
          </button>


        </nav>
      </div>

      {/* Content Area */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systemFeatures.map((feature) => (
            <SystemFeatureCard
              key={feature.id}
              feature={feature}
              onSelect={() => setActiveTab(feature.id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'logs' && <SystemLogsTab />}
      {activeTab === 'backup' && <DatabaseBackupTab />}
    </div>
  );
}

// System Feature Card Component
function SystemFeatureCard({ feature, onSelect }) {
  const { title, description, icon: Icon, color, features } = feature;
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <ul className="space-y-1 mb-4">
            {features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={onSelect}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Access Tool →
          </button>
        </div>
      </div>
    </div>
  );
}

// System Logs Tab
function SystemLogsTab() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        level: filters.level,
        category: filters.category,
        search: filters.search,
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      const response = await fetch(`/api/system/logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setStats(data.stats);
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters, pagination.page]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      case 'INFO': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-lg font-semibold text-red-600">{stats.errors}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-lg font-semibold text-yellow-600">{stats.warnings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Info</p>
                <p className="text-lg font-semibold text-blue-600">{stats.info}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">System Logs</h2>
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="ERROR">Error</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {stats?.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search logs..."
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading logs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Time</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Level</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Message</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLogLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm font-medium text-gray-900">
                      {log.category}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {log.user ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {log.user.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{log.user.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">System</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900">
                      {log.message}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {log.user ? (
                        <div>
                          <div className="text-sm text-gray-900 font-medium">By: {log.user.name}</div>
                          {log.details && <div className="text-xs text-gray-500 mt-1">{log.details}</div>}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">{log.details || 'System operation'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Database Backup Tab
function DatabaseBackupTab() {
  const [backupData, setBackupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const fetchBackupData = async () => {
    try {
      const response = await fetch('/api/system/backup');
      if (response.ok) {
        const data = await response.json();
        setBackupData(data);
      }
    } catch (error) {
      console.error('Error fetching backup data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackupData();
  }, []);

  const generateReport = () => {
    try {
      // Create HTML content for the report
      const currentDate = new Date().toLocaleDateString();
      
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Database Backup Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #1f2937; margin-bottom: 10px; }
            .header p { color: #6b7280; margin: 5px 0; }
            .section { margin: 30px 0; }
            .section h2 { color: #374151; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .success { color: #059669; font-weight: bold; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #d1d5db; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Database Backup Report</h1>
            <p><strong>Generated on:</strong> ${currentDate}</p>
            <p><strong>System:</strong> Evergreen Inventory System</p>
          </div>
      `;
      
      // Database Statistics
      if (backupData?.stats) {
        htmlContent += `
          <div class="section">
            <h2>Database Statistics</h2>
            <table>
              <thead>
                <tr><th>Collection</th><th>Records</th></tr>
              </thead>
              <tbody>
                <tr><td>Total Records</td><td>${backupData.stats.totalRecords}</td></tr>
                <tr><td>Items</td><td>${backupData.stats.collections.items}</td></tr>
                <tr><td>Sales</td><td>${backupData.stats.collections.sales}</td></tr>
                <tr><td>Users</td><td>${backupData.stats.collections.users}</td></tr>
                <tr><td>Categories</td><td>${backupData.stats.collections.categories}</td></tr>
                <tr><td>Brands</td><td>${backupData.stats.collections.brands}</td></tr>
                <tr><td>Warehouses</td><td>${backupData.stats.collections.warehouses}</td></tr>
              </tbody>
            </table>
          </div>
        `;
      }
      
      // Backup History
      if (backupData?.backupHistory && backupData.backupHistory.length > 0) {
        htmlContent += `
          <div class="section">
            <h2>Recent Backup History</h2>
            <table>
              <thead>
                <tr><th>Date</th><th>Status</th><th>Size</th><th>User</th></tr>
              </thead>
              <tbody>
        `;
        
        backupData.backupHistory.slice(0, 10).forEach(backup => {
          htmlContent += `
            <tr>
              <td>${new Date(backup.timestamp).toLocaleString()}</td>
              <td class="success">${backup.status}</td>
              <td>${backup.size || 'N/A'}</td>
              <td>${backup.user || 'System'}</td>
            </tr>
          `;
        });
        
        htmlContent += `
              </tbody>
            </table>
          </div>
        `;
      }
      
      htmlContent += `
          <div class="footer">
            <p>This report was generated automatically by Evergreen Inventory System</p>
          </div>
        </body>
        </html>
      `;
      
      // Open in new window and trigger print
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = function() {
        printWindow.print();
      };
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/system/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'create' })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Download the backup file
        if (result.downloadData) {
          const dataStr = JSON.stringify(result.downloadData, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = result.backup.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        
        toast.success(`Backup created and downloaded successfully! File: ${result.backup.filename}`);
        fetchBackupData(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(`Backup failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setCreating(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!confirm('Are you sure you want to restore from backup? This action cannot be undone.')) {
      return;
    }

    setRestoring(true);
    try {
      const response = await fetch('/api/system/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'restore' })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
      } else {
        const error = await response.json();
        toast.error(`Restore failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast.error('Failed to restore backup');
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading backup information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Database Statistics */}
      {backupData?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-lg font-semibold text-gray-900">{backupData.stats.totalRecords}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Backup Count</p>
                <p className="text-lg font-semibold text-gray-900">{backupData.stats.backupCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Backup</p>
                <p className="text-lg font-semibold text-gray-900">
                  {backupData.stats.lastBackup 
                    ? new Date(backupData.stats.lastBackup).toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Items</p>
                <p className="text-lg font-semibold text-gray-900">{backupData.stats.collections.items}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Backup</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">JSON Backup</h3>
            <button 
              onClick={handleCreateBackup}
              disabled={creating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Create JSON Backup
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Downloads complete backup as JSON file
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Print Report</h3>
            <button 
              onClick={generateReport}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FileText className="w-5 h-5" />
              Generate Print Report
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Opens printable backup summary
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Restore Backup</h3>
            <button 
              disabled={true}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50"
            >
              <Upload className="w-5 h-5" />
              Restore Disabled
            </button>
            <p className="text-sm text-red-500 mt-2">
              🚫 Restore functionality disabled for security reasons
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Contact system administrator for data restoration
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backup History</h3>
        {backupData?.backupHistory && backupData.backupHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Size</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Duration</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">User</th>
                </tr>
              </thead>
              <tbody>
                {backupData.backupHistory.map((backup) => (
                  <tr key={backup.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm text-gray-900">
                      {new Date(backup.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        backup.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {backup.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-900">{backup.size}</td>
                    <td className="py-3 px-2 text-sm text-gray-900">{backup.duration}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{backup.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No backup history available</p>
            <p className="text-sm">Create your first backup to see history</p>
          </div>
        )}
      </div>
    </div>
  );
}





export default Documents;
