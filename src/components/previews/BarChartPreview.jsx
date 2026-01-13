/**
 * BarChartPreview Component
 * Handles rendering for vertical, horizontal, grouped, and stacked bar charts
 */

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Cell,
  LabelList,
  Legend,
  Text,
} from 'recharts';
import { getColors } from '../../charts/shared/palettes';

// Custom title component that positions based on chart type
function ChartTitle({ title, hasLegend }) {
  if (!title) return null;
  
  // Position title lower if there's a legend above it
  const topOffset = hasLegend ? 45 : 12;
  
  return (
    <text
      x={70}
      y={topOffset}
      style={{
        fontSize: 18,
        fontWeight: 600,
        fill: '#000000',
      }}
    >
      {title}
    </text>
  );
}

function BarChartPreview({ chartType, config, width, height }) {
  // Process and sort data if needed
  const data = useMemo(() => {
    let processedData = [...chartType.sampleData];
    
    if (config.barOrdering === 'ascending') {
      processedData.sort((a, b) => a.value - b.value);
    } else if (config.barOrdering === 'descending') {
      processedData.sort((a, b) => b.value - a.value);
    }
    
    return processedData;
  }, [chartType.sampleData, config.barOrdering]);

  // Get colors based on config
  const colors = useMemo(() => {
    return getColors(config, data.length);
  }, [config, data.length]);

  // Calculate Y domain with smart defaults
  const yDomain = useMemo(() => {
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // If user specified values, use them
    const yMin = config.yMin && config.yMin.trim() !== '' 
      ? parseFloat(config.yMin) 
      : Math.floor(min * 0.9); // Default to 90% of min for better visualization
    
    const yMax = config.yMax && config.yMax.trim() !== '' 
      ? parseFloat(config.yMax) 
      : 'auto';
    
    return [yMin, yMax];
  }, [data, config.yMin, config.yMax]);

  // Calculate X domain for horizontal bars
  const xDomain = useMemo(() => {
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    
    const xMin = config.xMin && config.xMin.trim() !== '' 
      ? parseFloat(config.xMin) 
      : 0;
    
    const xMax = config.xMax && config.xMax.trim() !== '' 
      ? parseFloat(config.xMax) 
      : Math.ceil(max * 1.1);
    
    return [xMin, xMax];
  }, [data, config.xMin, config.xMax]);

  // Common axis props
  const axisStyle = {
    tick: { fill: '#000000', fontSize: 12 },
    stroke: '#000000',
  };

  // Render vertical bar chart
  if (chartType.id === 'vertical-bar') {
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
          data={data} 
          width={width} 
          height={height}
          margin={{ top: config.title ? 40 : 20, right: 80, bottom: 60, left: 70 }}
          barSize={40}
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
            dataKey="name"
            angle={-config.labelRotation || 0}
            textAnchor={config.labelRotation ? 'end' : 'middle'}
            height={config.labelRotation ? 80 : 40}
            interval={0}
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
          
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
          {config.showValues && (
            <LabelList 
              dataKey="value" 
              position="top" 
              formatter={(value) => value.toFixed(config.valueDecimals || 1)}
              style={{ fill: '#000000', fontSize: 11, fontWeight: 500 }}
            />
          )}
        </Bar>

        {config.showReferenceLine && config.referenceValue && (
          <ReferenceLine 
            y={parseFloat(config.referenceValue)} 
            stroke="#C44B3D" 
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{ 
              value: config.referenceLabel || 'Reference', 
              position: 'insideTopRight',
              style: { fill: '#C44B3D', fontSize: 12 }
            }}
          />
        )}
        </BarChart>
      </div>
    );
  }

  // Render horizontal bar chart
  if (chartType.id === 'horizontal-bar') {
    return (
      <div style={{ width, height, position: 'relative' }}>
        {config.title && (
          <div style={{ 
            position: 'absolute', 
            top: 8, 
            left: 100, 
            fontSize: 18, 
            fontWeight: 600 
          }}>
            {config.title}
          </div>
        )}
        <BarChart 
          data={data} 
          width={width} 
          height={height}
          layout="vertical"
          margin={{ top: config.title ? 40 : 20, right: 60, bottom: 50, left: 100 }}
          barSize={35}
        >
          {config.showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#CCCCCC" 
              opacity={0.3}
              horizontal={false}
          />
        )}
        
        <XAxis 
          type="number"
          domain={xDomain}
          label={{ 
            value: config.xlabel || '', 
            position: 'insideBottom', 
            offset: -5,
            style: { fill: '#000000', fontSize: 14 }
          }}
          {...axisStyle}
        />
        
        <YAxis 
          type="category"
          dataKey="name"
          width={90}
          label={{ 
            value: config.ylabel || '', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#000000', fontSize: 14, textAnchor: 'middle' },
            dx: -30
          }}
          {...axisStyle}
        />
        
        <Bar 
          dataKey="value" 
          radius={[0, 4, 4, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
          {config.showValues && (
            <LabelList 
              dataKey="value" 
              position="right" 
              formatter={(value) => value.toFixed(config.valueDecimals || 1)}
              style={{ fill: '#000000', fontSize: 11, fontWeight: 500 }}
            />
          )}
        </Bar>

        {config.showReferenceLine && config.referenceValue && (
          <ReferenceLine 
            x={parseFloat(config.referenceValue)} 
            stroke="#C44B3D" 
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{ 
              value: config.referenceLabel || 'Reference', 
              position: 'insideTopRight',
              style: { fill: '#C44B3D', fontSize: 12 }
            }}
          />
        )}
        </BarChart>
      </div>
    );
  }

  // Render grouped bar chart
  if (chartType.id === 'grouped-bar') {
    const groupedColors = config.useBluesPalette 
      ? ['#1E265C', '#4C6EE6', '#8FA6F9']
      : config.useRedsPalette 
        ? ['#662F24', '#C44B3D', '#FFA18C']
        : config.useGreensPalette
          ? ['#16270D', '#5BBF8A', '#CFE9B4']
          : ['#2D4DB9', '#C44B3D', '#9E4FA5'];

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
          data={data} 
          width={width} 
          height={height}
          margin={{ top: config.title ? 60 : 40, right: 80, bottom: 60, left: 70 }}
          barSize={20}
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
          dataKey="name"
          angle={-config.labelRotation || 0}
          textAnchor={config.labelRotation ? 'end' : 'middle'}
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
            verticalAlign="top"
            wrapperStyle={{ 
              paddingTop: 5,
              paddingBottom: 5
            }}
            formatter={(value) => <span style={{ color: '#000000', fontSize: 11 }}>{value}</span>}
            iconType="square"
            iconSize={10}
          />
        )}
        
        <Bar dataKey="run1" name="Run 1" fill={groupedColors[0]} radius={[4, 4, 0, 0]}>
          {config.showValues && (
            <LabelList 
              dataKey="run1" 
              position="top" 
              formatter={(value) => value.toFixed(config.valueDecimals || 1)}
              style={{ fill: '#000000', fontSize: 9, fontWeight: 500 }}
            />
          )}
        </Bar>
        <Bar dataKey="run2" name="Run 2" fill={groupedColors[1]} radius={[4, 4, 0, 0]}>
          {config.showValues && (
            <LabelList 
              dataKey="run2" 
              position="top" 
              formatter={(value) => value.toFixed(config.valueDecimals || 1)}
              style={{ fill: '#000000', fontSize: 9, fontWeight: 500 }}
            />
          )}
        </Bar>
        <Bar dataKey="run3" name="Run 3" fill={groupedColors[2]} radius={[4, 4, 0, 0]}>
          {config.showValues && (
            <LabelList 
              dataKey="run3" 
              position="top" 
              formatter={(value) => value.toFixed(config.valueDecimals || 1)}
              style={{ fill: '#000000', fontSize: 9, fontWeight: 500 }}
            />
          )}
        </Bar>

        {config.showReferenceLine && config.referenceValue && (
          <ReferenceLine 
            y={parseFloat(config.referenceValue)} 
            stroke="#C44B3D" 
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{ 
              value: config.referenceLabel || 'Reference', 
              position: 'insideTopRight',
              style: { fill: '#C44B3D', fontSize: 12 }
            }}
          />
        )}
        </BarChart>
      </div>
    );
  }

  // Render stacked bar chart
  if (chartType.id === 'stacked-bar') {
    const stackColors = config.useBluesPalette 
      ? ['#1E265C', '#4C6EE6', '#8FA6F9']
      : config.useRedsPalette 
        ? ['#662F24', '#C44B3D', '#FFA18C']
        : config.useGreensPalette
          ? ['#16270D', '#5BBF8A', '#CFE9B4']
          : ['#2D4DB9', '#C44B3D', '#9E4FA5'];

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
          data={data} 
          width={width} 
          height={height}
          margin={{ top: config.title ? 60 : 40, right: 80, bottom: 60, left: 70 }}
          barSize={50}
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
          dataKey="name"
          angle={-config.labelRotation || 0}
          textAnchor={config.labelRotation ? 'end' : 'middle'}
          label={{ 
            value: config.xlabel || '', 
            position: 'insideBottom', 
            offset: -10,
            style: { fill: '#000000', fontSize: 14 }
          }}
          {...axisStyle}
        />
        
        <YAxis 
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
            verticalAlign="top"
            wrapperStyle={{ 
              paddingTop: 5,
              paddingBottom: 5
            }}
            formatter={(value) => <span style={{ color: '#000000', fontSize: 11 }}>{value}</span>}
            iconType="square"
            iconSize={10}
          />
        )}
        
        <Bar dataKey="training" name="Training" stackId="a" fill={stackColors[0]}>
          {config.showValues && (
            <LabelList 
              dataKey="training" 
              position="center" 
              formatter={(value) => value.toFixed(config.valueDecimals || 0)}
              style={{ fill: '#ffffff', fontSize: 10, fontWeight: 500 }}
            />
          )}
        </Bar>
        <Bar dataKey="validation" name="Validation" stackId="a" fill={stackColors[1]}>
          {config.showValues && (
            <LabelList 
              dataKey="validation" 
              position="center" 
              formatter={(value) => value.toFixed(config.valueDecimals || 0)}
              style={{ fill: '#ffffff', fontSize: 10, fontWeight: 500 }}
            />
          )}
        </Bar>
        <Bar dataKey="test" name="Test" stackId="a" fill={stackColors[2]} radius={[4, 4, 0, 0]}>
          {config.showValues && (
            <LabelList 
              dataKey="test" 
              position="center" 
              formatter={(value) => value.toFixed(config.valueDecimals || 0)}
              style={{ fill: '#000000', fontSize: 10, fontWeight: 500 }}
            />
          )}
        </Bar>

        {config.showReferenceLine && config.referenceValue && (
          <ReferenceLine 
            y={parseFloat(config.referenceValue)} 
            stroke="#C44B3D" 
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{ 
              value: config.referenceLabel || 'Reference', 
              position: 'insideTopRight',
              style: { fill: '#C44B3D', fontSize: 12 }
            }}
          />
        )}
        </BarChart>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      Unknown bar chart type: {chartType.id}
    </div>
  );
}

export default BarChartPreview;
