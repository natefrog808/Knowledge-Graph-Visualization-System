import React, { useState, useRef, useMemo, useCallback } from 'react';

const CandlestickChart = ({
  data,
  width = 200,
  height = 40,
  upColor = "#4CAF50",
  downColor = "#FF5252"
}) => {
  const svgRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  // Calculate price ranges for scaling
  const priceRange = useMemo(() => {
    const values = data.flatMap(d => [d.high, d.low]);
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }, [data]);
  
  // Calculate scales
  const xScale = width / (data.length + 1);
  const yScale = height / (priceRange.max - priceRange.min);
  
  const renderCandle = useCallback((d, i) => {
    const x = (i + 0.5) * xScale;
    const isUp = d.close >= d.open;
    const color = isUp ? upColor : downColor;
    
    const bodyTop = height - Math.max(d.open, d.close) * yScale;
    const bodyBottom = height - Math.min(d.open, d.close) * yScale;
    const bodyHeight = Math.abs(bodyTop - bodyBottom);
    
    const wickTop = height - d.high * yScale;
    const wickBottom = height - d.low * yScale;
    
    return (
      <g key={i} className="candle">
        {/* Wick */}
        <line
          x1={x}
          y1={wickTop}
          x2={x}
          y2={wickBottom}
          stroke={color}
          strokeWidth="1"
        />
        
        {/* Body */}
        <rect
          x={x - xScale * 0.3}
          y={bodyTop}
          width={xScale * 0.6}
          height={bodyHeight || 1}
          fill={color}
          opacity={hoveredPoint === d ? 1 : 0.8}
        />
      </g>
    );
  }, [xScale, yScale, hoveredPoint, upColor, downColor, height]);
  
  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-gray-50 rounded"
        onMouseMove={(e) => {
          const svgRect = svgRef.current.getBoundingClientRect();
          const mouseX = e.clientX - svgRect.left;
          const index = Math.floor(mouseX / xScale);
          setHoveredPoint(data[index]);
        }}
        onMouseLeave={() => setHoveredPoint(null)}
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
        
        {/* Candles */}
        {data.map((d, i) => renderCandle(d, i))}
      </svg>
      
      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute bg-white px-2 py-1 rounded shadow-sm text-xs"
          style={{
            left: Math.min(width - 120, data.indexOf(hoveredPoint) * xScale),
            top: -45
          }}
        >
          <div>{new Date(hoveredPoint.timestamp).toLocaleDateString()}</div>
          <div className="grid grid-cols-2 gap-x-2">
            <span>O: {hoveredPoint.open.toFixed(2)}</span>
            <span>C: {hoveredPoint.close.toFixed(2)}</span>
            <span>H: {hoveredPoint.high.toFixed(2)}</span>
            <span>L: {hoveredPoint.low.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandlestickChart;
