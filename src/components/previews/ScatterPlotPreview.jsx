/**
 * ScatterPlotPreview Component
 * Handles rendering for scatter plots with multiple categories
 */

import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ZAxis,
  Legend,
} from 'recharts';

function ScatterPlotPreview({ chartType, config, width, height }) {
  const data = chartType.sampleData;

  // Group data by category
  const groupedData = useMemo(() => {
    const groups = {};
    data.forEach(point => {
      if (!groups[point.category]) {
        groups[point.category] = [];
      }
      groups[point.category].push(point);
    });
    return groups;
  }, [data]);

  // Get colors for each category based on palette selection
  const categoryColors = useMemo(() => {
    let colors;
    if (config.useBluesPalette) {
      colors = ['#1E265C', '#4C6EE6', '#8FA6F9'];
    } else if (config.useRedsPalette) {
      colors = ['#662F24', '#C44B3D', '#FFA18C'];
    } else if (config.useGreensPalette) {
      colors = ['#16270D', '#5BBF8A', '#CFE9B4'];
    } else {
      // Default to multi-color palette
      colors = ['#2D4DB9', '#C44B3D', '#9E4FA5'];
    }
    
    const categories = Object.keys(groupedData);
    const colorMap = {};
    categories.forEach((category, idx) => {
      colorMap[category] = colors[idx % colors.length];
    });
    return colorMap;
  }, [config, groupedData]);

  // Calculate domains
  const xDomain = useMemo(() => {
    const xValues = data.map(d => d.x);
    const xMin = config.xMin && config.xMin.trim() !== '' 
      ? parseFloat(config.xMin) 
      : Math.floor(Math.min(...xValues) * 0.9);
    const xMax = config.xMax && config.xMax.trim() !== '' 
      ? parseFloat(config.xMax) 
      : Math.ceil(Math.max(...xValues) * 1.1);
    return [xMin, xMax];
  }, [data, config.xMin, config.xMax]);

  const yDomain = useMemo(() => {
    const yValues = data.map(d => d.y);
    const yMin = config.yMin && config.yMin.trim() !== '' 
      ? parseFloat(config.yMin) 
      : Math.floor(Math.min(...yValues) * 0.9);
    const yMax = config.yMax && config.yMax.trim() !== '' 
      ? parseFloat(config.yMax) 
      : Math.ceil(Math.max(...yValues) * 1.1);
    return [yMin, yMax];
  }, [data, config.yMin, config.yMax]);

  // Common axis props
  const axisStyle = {
    tick: { fill: '#000000', fontSize: 12 },
    stroke: '#000000',
  };

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
      <ScatterChart 
        width={width} 
        height={height}
        margin={{ 
          top: config.title ? 40 : (config.showLegend && config.legendPosition === 'top' ? 40 : 20), 
          right: config.showLegend && config.legendPosition === 'right' ? 150 : 80, 
          bottom: config.showLegend && config.legendPosition === 'bottom' ? 80 : 60, 
          left: 70 
        }}
      >
        {config.showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#CCCCCC" 
            opacity={0.3}
          />
        )}
        
        <XAxis 
          type="number"
          dataKey="x"
          domain={xDomain}
          label={{ 
            value: config.xlabel || '', 
            position: 'insideBottom', 
            offset: -10,
            style: { fill: '#000000', fontSize: 14 }
          }}
          {...axisStyle}
        />
        
        <YAxis 
          type="number"
          dataKey="y"
          domain={yDomain}
          label={{ 
            value: config.ylabel || '', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#000000', fontSize: 14, textAnchor: 'middle' },
            dy: 25
          }}
          {...axisStyle}
        />

        <ZAxis 
          range={[config.markerSize || 100, config.markerSize || 100]} 
        />

        {config.showLegend && (
          <Legend 
            verticalAlign={config.legendPosition === 'bottom' ? 'bottom' : config.legendPosition === 'right' ? 'middle' : 'top'}
            align={config.legendPosition === 'right' ? 'right' : 'center'}
            wrapperStyle={{ 
              paddingTop: config.legendPosition === 'top' ? 5 : 10,
              paddingBottom: config.legendPosition === 'bottom' ? 5 : 0
            }}
            formatter={(value) => <span style={{ color: '#000000', fontSize: 11 }}>{value}</span>}
            layout={config.legendPosition === 'right' ? 'vertical' : 'horizontal'}
            iconType="circle"
            iconSize={10}
          />
        )}
        
        {Object.entries(groupedData).map(([category, points]) => (
          <Scatter 
            key={category}
            name={category}
            data={points} 
            fill={categoryColors[category]}
            fillOpacity={config.markerAlpha || 0.7}
            stroke="#000000"
            strokeWidth={1}
          />
        ))}
      </ScatterChart>
    </div>
  );
}

export default ScatterPlotPreview;
