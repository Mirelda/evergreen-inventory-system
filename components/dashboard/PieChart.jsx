'use client';

function PieChart({ data, size = 200, colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No data available
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2;
  const center = size / 2;

  let currentAngle = 0;
  const paths = [];

  data.forEach((item, index) => {
    const percentage = total > 0 ? item.value / total : 0;
    const angle = percentage * 360;
    const color = colors[index % colors.length];

    if (percentage > 0) {
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const x1 = center + radius * Math.cos((startAngle - 90) * Math.PI / 180);
      const y1 = center + radius * Math.sin((startAngle - 90) * Math.PI / 180);
      const x2 = center + radius * Math.cos((endAngle - 90) * Math.PI / 180);
      const y2 = center + radius * Math.sin((endAngle - 90) * Math.PI / 180);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      paths.push({
        path: pathData,
        color,
        label: item.label,
        value: item.value,
        percentage: (percentage * 100).toFixed(1)
      });

      currentAngle += angle;
    }
  });

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {paths.map((path, index) => (
            <path
              key={index}
              d={path.path}
              fill={path.color}
              className="transition-all duration-300 hover:opacity-80"
            />
          ))}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="ml-6 space-y-2">
        {paths.map((path, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: path.color }}
            />
            <span className="text-sm text-gray-600">{path.label}</span>
            <span className="text-sm font-medium text-gray-900">
              {path.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PieChart; 