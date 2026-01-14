/**
 * BoxPlotPreview Component
 * Handles rendering for box plots with proper sizing
 */

import React, { useMemo } from 'react';

function BoxPlotPreview({ chartType, config, width, height }) {
  const data = chartType.sampleData;

  // Chart margins
  const margin = { top: config.title ? 40 : 20, right: 80, bottom: 60, left: 70 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Get colors for each category based on palette selection
  const categoryColors = useMemo(() => {
    let colors;
    if (config.useBluesPalette) {
      colors = ['#1E265C', '#4C6EE6', '#8FA6F9', '#A5C4FF'];
    } else if (config.useRedsPalette) {
      colors = ['#662F24', '#C44B3D', '#FFA18C', '#FFB8A8'];
    } else if (config.useGreensPalette) {
      colors = ['#16270D', '#357A4D', '#5BBF8A', '#CFE9B4'];
    } else {
      // Default to multi-color palette
      colors = ['#2D4DB9', '#C44B3D', '#9E4FA5', '#4C6EE6'];
    }
    return colors;
  }, [config]);

  // Calculate Y domain
  const yDomain = useMemo(() => {
    const allValues = data.flatMap(d => [d.min, d.max, ...d.outliers]);
    
    const yMin = config.yMin && config.yMin.trim() !== '' 
      ? parseFloat(config.yMin) 
      : Math.floor(Math.min(...allValues) - 5);
    const yMax = config.yMax && config.yMax.trim() !== '' 
      ? parseFloat(config.yMax) 
      : Math.ceil(Math.max(...allValues) + 5);
    return [yMin, yMax];
  }, [data, config.yMin, config.yMax]);

  // Scale functions
  const yScale = (value) => {
    const [yMin, yMax] = yDomain;
    return margin.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;
  };

  const xScale = (index) => {
    const categoryWidth = chartWidth / data.length;
    return margin.left + categoryWidth * index + categoryWidth / 2;
  };

  // Generate Y-axis ticks
  const yTicks = useMemo(() => {
    const [yMin, yMax] = yDomain;
    const tickCount = 5;
    const step = (yMax - yMin) / (tickCount - 1);
    return Array.from({ length: tickCount }, (_, i) => Math.round(yMin + step * i));
  }, [yDomain]);

  // Box width calculation
  const boxWidth = (chartWidth / data.length) * (config.boxWidth || 0.4);

  return (
    <div style={{ width, height, position: 'relative' }}>
      {config.title && (
        <div style={{ 
          position: 'absolute', 
          top: 8, 
          left: 70, 
          fontSize: 18, 
          fontWeight: 600 
        }}>
          {config.title}
        </div>
      )}
      
      <svg width={width} height={height}>
        {/* Grid lines */}
        {config.showGrid && yTicks.map((tick) => (
          <line
            key={`grid-${tick}`}
            x1={margin.left}
            y1={yScale(tick)}
            x2={width - margin.right}
            y2={yScale(tick)}
            stroke="#CCCCCC"
            strokeDasharray="3 3"
            opacity={0.5}
          />
        ))}

        {/* Y-axis */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          stroke="#000000"
          strokeWidth={1}
        />

        {/* X-axis */}
        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="#000000"
          strokeWidth={1}
        />

        {/* Y-axis ticks and labels */}
        {yTicks.map((tick) => (
          <g key={`ytick-${tick}`}>
            <line
              x1={margin.left - 5}
              y1={yScale(tick)}
              x2={margin.left}
              y2={yScale(tick)}
              stroke="#000000"
              strokeWidth={1}
            />
            <text
              x={margin.left - 10}
              y={yScale(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={12}
              fill="#000000"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Y-axis label */}
        <text
          x={-(margin.top + chartHeight / 2)}
          y={20}
          transform="rotate(-90)"
          textAnchor="middle"
          fontSize={14}
          fill="#000000"
        >
          {config.ylabel || ''}
        </text>

        {/* X-axis label */}
        <text
          x={margin.left + chartWidth / 2}
          y={height - 15}
          textAnchor="middle"
          fontSize={14}
          fill="#000000"
        >
          {config.xlabel || ''}
        </text>

        {/* X-axis category labels */}
        {data.map((item, idx) => (
          <text
            key={`xlabel-${idx}`}
            x={xScale(idx)}
            y={height - margin.bottom + 20}
            textAnchor="middle"
            fontSize={12}
            fill="#000000"
          >
            {item.category}
          </text>
        ))}

        {/* Box plots */}
        {data.map((item, idx) => {
          const centerX = xScale(idx);
          const color = categoryColors[idx % categoryColors.length];
          
          // Y positions
          const minY = yScale(item.min);
          const maxY = yScale(item.max);
          const q1Y = yScale(item.q1);
          const q3Y = yScale(item.q3);
          const medianY = yScale(item.median);
          
          const halfBox = boxWidth / 2;
          const capWidth = boxWidth / 3;

          return (
            <g key={`box-${idx}`}>
              {/* Lower whisker (min to Q1) */}
              <line
                x1={centerX}
                y1={minY}
                x2={centerX}
                y2={q1Y}
                stroke="#000000"
                strokeWidth={1.5}
              />
              
              {/* Upper whisker (Q3 to max) */}
              <line
                x1={centerX}
                y1={q3Y}
                x2={centerX}
                y2={maxY}
                stroke="#000000"
                strokeWidth={1.5}
              />
              
              {/* Min cap */}
              <line
                x1={centerX - capWidth}
                y1={minY}
                x2={centerX + capWidth}
                y2={minY}
                stroke="#000000"
                strokeWidth={1.5}
              />
              
              {/* Max cap */}
              <line
                x1={centerX - capWidth}
                y1={maxY}
                x2={centerX + capWidth}
                y2={maxY}
                stroke="#000000"
                strokeWidth={1.5}
              />
              
              {/* Box (Q1 to Q3) */}
              <rect
                x={centerX - halfBox}
                y={q3Y}
                width={boxWidth}
                height={q1Y - q3Y}
                fill={color}
                stroke="#000000"
                strokeWidth={1.5}
                rx={4}
                ry={4}
              />
              
              {/* Median line */}
              <line
                x1={centerX - halfBox}
                y1={medianY}
                x2={centerX + halfBox}
                y2={medianY}
                stroke="#000000"
                strokeWidth={2}
              />
              
              {/* Outliers */}
              {config.showOutliers && item.outliers && item.outliers.map((outlier, oIdx) => (
                <text
                  key={`outlier-${idx}-${oIdx}`}
                  x={centerX}
                  y={yScale(outlier)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={16}
                  fontWeight="bold"
                  fill="#000000"
                >
                  *
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default BoxPlotPreview;
