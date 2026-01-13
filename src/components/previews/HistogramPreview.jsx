/**
 * HistogramPreview Component
 * Handles rendering for histograms
 */

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts';

function HistogramPreview({ chartType, config, width, height }) {
  const rawData = chartType.sampleData;

  // Calculate histogram bins
  const histogramData = useMemo(() => {
    const numBins = config.numBins || 12;
    const min = Math.min(...rawData);
    const max = Math.max(...rawData);
    const binWidth = (max - min) / numBins;
    
    // Initialize bins
    const bins = Array.from({ length: numBins }, (_, i) => ({
      binStart: min + i * binWidth,
      binEnd: min + (i + 1) * binWidth,
      count: 0,
      label: `${Math.round(min + i * binWidth)}-${Math.round(min + (i + 1) * binWidth)}`,
    }));
    
    // Count values in each bin
    rawData.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
      bins[binIndex].count++;
    });
    
    return bins;
  }, [rawData, config.numBins]);

  // Get color from config
  const barColor = config.color || '#4C6EE6';

  // Calculate Y domain
  const yDomain = useMemo(() => {
    const maxCount = Math.max(...histogramData.map(d => d.count));
    
    const yMin = config.yMin && config.yMin.trim() !== '' 
      ? parseFloat(config.yMin) 
      : 0;
    const yMax = config.yMax && config.yMax.trim() !== '' 
      ? parseFloat(config.yMax) 
      : Math.ceil(maxCount * 1.1);
    return [yMin, yMax];
  }, [histogramData, config.yMin, config.yMax]);

  // Common axis props
  const axisStyle = {
    tick: { fill: '#000000', fontSize: 11 },
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
      <BarChart 
        data={histogramData}
        width={width} 
        height={height}
        margin={{ top: config.title ? 40 : 20, right: 80, bottom: 60, left: 70 }}
        barCategoryGap={0}
      >
        {config.showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#CCCCCC" 
            opacity={0.3}
            vertical={false}
          />
        )}
        
        <XAxis 
          dataKey="label"
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
          label={{ 
            value: config.xlabel || '', 
            position: 'insideBottom', 
            offset: -5,
            style: { fill: '#000000', fontSize: 14 }
          }}
          {...axisStyle}
          tick={{ fill: '#000000', fontSize: 9 }}
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
        
        <Bar 
          dataKey="count"
          fill={barColor}
          fillOpacity={config.barAlpha || 0.7}
          stroke={config.showEdges ? '#000000' : 'none'}
          strokeWidth={config.showEdges ? 1 : 0}
        >
          {histogramData.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}

export default HistogramPreview;
