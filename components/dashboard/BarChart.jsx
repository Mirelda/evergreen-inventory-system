'use client';

function BarChart({ data, height = 200, colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const totalHeight = height - 40; // Account for labels

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <div className="flex items-end justify-between h-full gap-2">
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * totalHeight : 0;
          const color = colors[index % colors.length];
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{ 
                  height: `${barHeight}px`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
                title={`${item.label}: ${item.value}`}
              />
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-500 mt-1">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BarChart; 