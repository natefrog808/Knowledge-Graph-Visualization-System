import React, { useState, useCallback, useRef } from 'react';

const InteractiveAreaChart = ({
  data,
  width = 200,
  height = 40,
  color = "#4CAF50"
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [pinnedPoints, setPinnedPoints] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const svgRef = useRef(null);
  
  // Calculate scales
  const xScale = width / (data.length - 1);
  const yScale = height / Math.max(...data.map(d => d.value));
  
  const handleClick = useCallback((point) => {
    setPinnedPoints(prev => {
      if (prev.find(p => p.timestamp === point.timestamp)) {
        return prev.filter(p => p.timestamp !== point.timestamp);
      }
      if (prev.length >= 2) {
        return [prev[1], point];
      }
      return [...prev, point];
    });
  }, []);
  
  // Generate area path
  const areaPath = data.map((point, i) => {
    const x = i * xScale;
    const y = height - point.value * yScale;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y} ${
      i === data.length - 1 ? `L ${x} ${height} L 0 ${height} Z` : ''
    }`;
  }).join(' ');
  
  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-gray-50 rounded cursor-pointer"
        onMouseMove={(e) => {
          const svgRect = svgRef.current.getBoundingClientRect();
          const mouseX = e.clientX - svgRect.left;
          const index = Math.min(
            data.length - 1,
            Math.max(0, Math.round(mouseX / xScale))
          );
          setHoveredPoint(data[index]);
        }}
        onMouseLeave={() => setHoveredPoint(null)}
        onClick={() => hoveredPoint && handleClick(hoveredPoint)}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(y => (
          <line
            key={y}
            x1="0"
            y1={height * y}
            x2={width}
            y2={height * y}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Area path */}
        <path
          d={areaPath}
          fill={color}
          fillOpacity="0.1"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((point, i) => {
          const isPinned = pinnedPoints.find(p => p.timestamp === point.timestamp);
          const isHovered = hoveredPoint === point;
          
          return (
            <circle
              key={i}
              cx={i * xScale}
              cy={height - point.value * yScale}
              r={isPinned ? 4 : (isHovered ? 3 : 2)}
              fill={isPinned ? "#ff4444" : color}
              className="transition-all duration-150"
            />
          );
        })}
        
        {/* Comparison line */}
        {comparisonMode && pinnedPoints.length === 2 && (
          <line
            x1={data.indexOf(pinnedPoints[0]) * xScale}
            y1={height - pinnedPoints[0].value * yScale}
            x2={data.indexOf(pinnedPoints[1]) * xScale}
            y2={height - pinnedPoints[1].value * yScale}
            stroke="#666"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        )}
      </svg>
      
      {/* Hover tooltip */}
      {hoveredPoint && (
        <div
          className="absolute bg-white px-2 py-1 rounded shadow-sm text-xs"
          style={{
            left: Math.min(
              width - 100,
              (data.indexOf(hoveredPoint) * xScale)
            ),
            top: -25
          }}
        >
          {new Date(hoveredPoint.timestamp).toLocaleDateString()}:
          {(hoveredPoint.value * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default InteractiveAreaChart;
