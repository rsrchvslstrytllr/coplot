/**
 * LineChartPreview Component
 * Handles rendering for line charts with multiple series
 */

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

function LineChartPreview({ chartType, config, width, height }) {
  const rawData = chartType.sampleData;

  // Transform data from array of {x, y, series} to Recharts format
  // Result: [{ x: 0, Transformers: 45, CNNs: 52, RNNs: 40 }, ...]
  const chartData = useMemo(() => {
    const dataMap = {};
    
    rawData.forEach(point => {
      if (!dataMap[point.x]) {
        dataMap[point.x] = { x: point.x };
      }
      dataMap[point.x][point.series] = point.y;
    });
    
    return Object.values(dataMap).sort((a, b) => a.x - b.x);
  }, [rawData]);

  // Get unique series names
  const seriesNames = useMemo(() => {
    const names = new Set();
    rawData.forEach(point => names.add(point.series));
    return Array.from(names);
  }, [rawData]);

  // Get colors for each series based on palette selection
  const seriesColors = useMemo(() => {
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
    
    const colorMap = {};
    seriesNames.forEach((series, idx) => {
      colorMap[series] = colors[idx % colors.length];
    });
    return colorMap;
  }, [config, seriesNames]);

  // Calculate domains
  const xDomain = useMemo(() => {
    const xValues = chartData.map(d => d.x);
    const xMin = config.xMin && config.xMin.trim() !== '' 
      ? parseFloat(config.xMin) 
      : Math.min(...xValues);
    const xMax = config.xMax && config.xMax.trim() !== '' 
      ? parseFloat(config.xMax) 
      : Math.max(...xValues);
    return [xMin, xMax];
  }, [chartData, config.xMin, config.xMax]);

  const yDomain = useMemo(() => {
    const yValues = [];
    chartData.forEach(point => {
      seriesNames.forEach(series => {
        if (point[series] !== undefined) {
          yValues.push(point[series]);
        }
      });
    });
    
    const yMin = config.yMin && config.yMin.trim() !== '' 
      ? parseFloat(config.yMin) 
      : Math.floor(Math.min(...yValues) * 0.95);
    const yMax = config.yMax && config.yMax.trim() !== '' 
      ? parseFloat(config.yMax) 
      : Math.ceil(Math.max(...yValues) * 1.05);
    return [yMin, yMax];
  }, [chartData, seriesNames, config.yMin, config.yMax]);

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
      <LineChart 
        data={chartData}
        width={width} 
        height={height}
        margin={{ 
          top: config.title ? 40 : 20, 
          right: config.legendPosition === 'right' ? 150 : 80, 
          bottom: config.legendPosition === 'bottom' ? 80 : 60, 
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
          dataKey="x"
          type="number"
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
            iconType="line"
            iconSize={20}
          />
        )}
        
        {seriesNames.map((series) => (
          <Line 
            key={series}
            type="monotone"
            dataKey={series}
            stroke={seriesColors[series]}
            strokeWidth={config.lineWidth || 2}
            dot={config.showMarkers ? { 
              fill: seriesColors[series], 
              r: config.markerSize || 6,
              strokeWidth: 0 
            } : false}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </div>
  );
}

export default LineChartPreview;
