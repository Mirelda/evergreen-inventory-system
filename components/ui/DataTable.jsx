"use client";

import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, ChevronDown, ChevronUp, Download, CheckSquare, Square, Filter, X } from "lucide-react";
import Link from "next/link";
import DeleteBtn from "@/components/dashboard/DeleteBtn";

function DataTable({
  title = "Data Table",
  data = [],
  columns = [],
  searchPlaceholder = "Search...",
  onEdit,
  onDelete,
  onAdd,
  addButtonText = "Add New",
  addButtonLink,
  loading = false,
  error = null,
  className = "",
  enableExport = false,
  enableBulkActions = false,
  onBulkDelete,
  onBulkUpdate,
  onBulkExport,
  enableAdvancedFiltering = false,
  filters = [],
  endpoint = "",
  resourceTitle = "item",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  // Filter data based on search term and active filters
  const filteredData = data.filter((item) => {
    // Search term filtering
    const searchMatch = searchTerm === "" || columns.some((column) => {
      const value = column.accessor ? column.accessor(item) : item[column.key];
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (!searchMatch) return false;

    // Advanced filtering
    if (enableAdvancedFiltering && Object.keys(activeFilters).length > 0) {
      return filters.every((filter) => {
        const filterValue = activeFilters[filter.key];
        if (!filterValue || filterValue === "") return true;

        const itemValue = filter.accessor ? filter.accessor(item) : item[filter.key];
        
        switch (filter.type) {
          case "select":
            return itemValue === filterValue;
          case "dateRange":
            if (filterValue.startDate && filterValue.endDate) {
              const itemDate = new Date(itemValue);
              const startDate = new Date(filterValue.startDate);
              const endDate = new Date(filterValue.endDate);
              return itemDate >= startDate && itemDate <= endDate;
            }
            return true;
          case "numberRange":
            if (filterValue.min !== undefined && filterValue.max !== undefined) {
              return itemValue >= filterValue.min && itemValue <= filterValue.max;
            }
            return true;
          case "text":
            return itemValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
          default:
            return true;
        }
      });
    }

    return true;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = columns.find(col => col.key === sortConfig.key)?.accessor 
      ? columns.find(col => col.key === sortConfig.key).accessor(a)
      : a[sortConfig.key];
    const bValue = columns.find(col => col.key === sortConfig.key)?.accessor
      ? columns.find(col => col.key === sortConfig.key).accessor(b)
      : b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
      setSelectAll(false);
    } else {
      setSelectedItems(new Set(currentItems.map(item => item.id)));
      setSelectAll(true);
    }
  };

  const handleSelectItem = (itemId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
    setSelectAll(newSelectedItems.size === currentItems.length);
  };

  // Handle bulk actions
  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    if (onBulkDelete) {
      onBulkDelete(Array.from(selectedItems));
    }
  };

  const handleBulkUpdate = () => {
    if (selectedItems.size === 0) return;
    if (onBulkUpdate) {
      onBulkUpdate(Array.from(selectedItems));
    }
  };

  const handleBulkExport = () => {
    if (selectedItems.size === 0) return;
    if (onBulkExport) {
      onBulkExport(Array.from(selectedItems));
    } else {
      // Default bulk export behavior
      const selectedData = sortedData.filter(item => selectedItems.has(item.id));
      const csvContent = [
        columns.map(col => col.label).join(','),
        ...selectedData.map(item => 
          columns.map(col => {
            const value = col.accessor ? col.accessor(item) : item[col.key];
            return `"${value || ''}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_selected_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  // Filter handling functions
  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearFilter = (filterKey) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(activeFilters).filter(value => {
      if (typeof value === 'object') {
        return Object.values(value).some(v => v !== undefined && v !== "");
      }
      return value !== undefined && value !== "";
    }).length;
  };

  // Handle export to CSV
  const handleExport = () => {
    const csvContent = [
      // Header row
      columns.map(col => col.label).join(','),
      // Data rows
      ...sortedData.map(item => 
        columns.map(col => {
          const value = col.accessor ? col.accessor(item) : item[col.key];
          return `"${value || ''}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Format cell value
  const formatCellValue = (value, column) => {
    if (value === null || value === undefined) return "-";
    
    // Custom format function
    if (column.format) {
      return column.format(value);
    }
    
    // Date formatting
    if (column.type === "date" || column.key?.toLowerCase().includes("date") || column.key?.toLowerCase().includes("at")) {
      if (value instanceof Date || typeof value === "string") {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });
          }
        } catch (e) {
          // Fallback to string if date parsing fails
        }
      }
    }
    
    // Image URL handling
    if (column.type === "image" || column.key?.toLowerCase().includes("image") || column.key?.toLowerCase().includes("url")) {
      if (typeof value === "string" && (value.startsWith("http") || value.startsWith("/"))) {
        return (
          <div className="flex items-center justify-center">
            <img 
              src={value} 
              alt="Preview" 
              className="w-12 h-12 object-cover rounded-md border border-gray-200"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="hidden text-xs text-gray-500">Resim yüklenemedi</span>
          </div>
        );
      }
    }
    
    // Nested object handling (dot notation)
    if (column.key && column.key.includes(".")) {
      const keys = column.key.split(".");
      let nestedValue = value;
      for (const key of keys) {
        if (nestedValue && typeof nestedValue === "object") {
          nestedValue = nestedValue[key];
        } else {
          nestedValue = null;
          break;
        }
      }
      return formatCellValue(nestedValue, { ...column, key: keys[keys.length - 1] });
    }
    
    // Boolean handling
    if (typeof value === "boolean") {
      return value ? "Evet" : "Hayır";
    }
    
    // Number formatting
    if (typeof value === "number") {
      return value.toLocaleString("tr-TR");
    }
    
    // Default string handling
    return value.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">{title}</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          {/* Advanced Filter Toggle */}
          {enableAdvancedFiltering && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                getActiveFiltersCount() > 0
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          )}
          
          {/* Export Button */}
          {enableExport && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
          
          {/* Add Button */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {addButtonText}
            </button>
          )}
          
          {addButtonLink && (
            <Link
              href={addButtonLink}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {addButtonText}
            </Link>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {enableBulkActions && selectedItems.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-900">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onBulkUpdate && (
              <button
                onClick={handleBulkUpdate}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Bulk Update
              </button>
            )}
            {onBulkExport && (
              <button
                onClick={handleBulkExport}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Selected
              </button>
            )}
            {onBulkDelete && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            )}
            <button
              onClick={() => {
                setSelectedItems(new Set());
                setSelectAll(false);
              }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {enableAdvancedFiltering && showFilters && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Advanced Filters</h3>
            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {filter.label}
                </label>
                
                {filter.type === "select" && (
                  <select
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                
                {filter.type === "dateRange" && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={activeFilters[filter.key]?.startDate || ""}
                      onChange={(e) => handleFilterChange(filter.key, {
                        ...activeFilters[filter.key],
                        startDate: e.target.value
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={activeFilters[filter.key]?.endDate || ""}
                      onChange={(e) => handleFilterChange(filter.key, {
                        ...activeFilters[filter.key],
                        endDate: e.target.value
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
                
                {filter.type === "numberRange" && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={activeFilters[filter.key]?.min || ""}
                      onChange={(e) => handleFilterChange(filter.key, {
                        ...activeFilters[filter.key],
                        min: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={activeFilters[filter.key]?.max || ""}
                      onChange={(e) => handleFilterChange(filter.key, {
                        ...activeFilters[filter.key],
                        max: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
                
                {filter.type === "text" && (
                  <input
                    type="text"
                    placeholder={`Filter by ${filter.label}`}
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
                
                {activeFilters[filter.key] && (
                  <button
                    onClick={() => clearFilter(filter.key)}
                    className="text-xs text-red-600 hover:text-red-800 transition-colors"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {enableBulkActions && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center justify-center w-4 h-4"
                  >
                    {selectAll ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${
                    column.sortable !== false ? "hover:bg-gray-100" : ""
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable !== false && sortConfig.key === column.key && (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0) + (enableBulkActions ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {searchTerm ? "No results found" : "No data available"}
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  {enableBulkActions && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleSelectItem(item.id)}
                        className="flex items-center justify-center w-4 h-4"
                      >
                        {selectedItems.has(item.id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCellValue(
                        column.accessor ? column.accessor(item) : item[column.key],
                        column
                      )}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <DeleteBtn 
                            id={item.id} 
                            endpoint={endpoint} 
                            resourceTitle={resourceTitle}
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of{" "}
            {sortedData.length} results
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable; 