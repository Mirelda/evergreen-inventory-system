'use client';

import { useState } from 'react';

function ChartCard({ 
  title, 
  children, 
  className = "",
  showLegend = false,
  legendItems = [],
  timeRange = "7d",
  onTimeRangeChange 
}) {
  const [selectedRange, setSelectedRange] = useState(timeRange);

  const handleTimeRangeChange = (range) => {
    setSelectedRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {onTimeRangeChange && (
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { value: '7d', label: '7D' },
              { value: '30d', label: '30D' },
              { value: '90d', label: '90D' },
              { value: '1y', label: '1Y' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => handleTimeRangeChange(range.value)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedRange === range.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="relative">
        {children}
      </div>

      {showLegend && legendItems.length > 0 && (
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChartCard; 