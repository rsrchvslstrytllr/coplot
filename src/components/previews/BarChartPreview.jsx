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
} from 'recharts';
import { getColors } from '../../charts/shared/palettes';

// Generate dynamic sample data for simple bar charts
function generateBarData(n) {
  const data = [];
  // Use seeded random for consistent preview
  const values = [85.2, 78.5, 92.1, 88.7, 81.3, 76.9, 94.5, 83.2, 79.8, 91.4];
  for (let i = 0; i < n; i++) {
    data.push({ name: `Cat ${i + 1}`, value: values[i % values.length] });
  }
  return data;
}

// Generate dynamic sample data for grouped bar charts
function generateGroupedData(numCategories, numSeries) {
  const data = [];
  const baseValues = [78.2, 85.3, 88.7, 90.5, 82.1, 86.4, 89.2, 91.8, 84.6, 87.9];
  for (let i = 0; i < numCategories; i++) {
    const item = { name: `Group ${i + 1}` };
    for (let j = 0; j < numSeries; j++) {
      item[`series${j + 1}`] = baseValues[(i + j * 3) % baseValues.length];
    }
    data.push(item);
  }
  return data;
}

// Generate dynamic sample data for stacked bar charts
function generateStackedData(numCategories, numStacks) {
  const data = [];
  const baseValues = [45, 35, 20, 50, 30, 25, 40, 28, 32, 38];
  for (let i = 0; i < numCategories; i++) {
    const item = { name: `Cat ${i + 1}` };
    for (let j = 0; j < numStacks; j++) {
      item[`stack${j + 1}`] = baseValues[(i + j * 2) % baseValues.length];
    }
    data.push(item);
  }
  return data;
}

function BarChartPreview({ chartType, config, width, height }) {
  // Generate dynamic data based on chart type and config
  const data = useMemo(() => {
    let processedData;
    
    if (chartType.id === 'vertical-bar' || chartType.id === 'horizontal-bar') {
      processedData = generateBarData(config.numCategories || 5);
    } else if (chartType.id === 'grouped-bar') {
      processedData = generateGroupedData(config.numCategories || 4, config.numSeries || 3);
    } else if (chartType.id === 'stacked-bar') {
      processedData = generateStackedData(config.numCategories || 4, config.numStacks || 3);
    } else {
      processedData = [...chartType.sampleData];
    }
    
    if (config.barOrdering === 'ascending') {
      processedData.sort((a, b) => (a.value || 0) - (b.value || 0));
    } else if (config.barOrdering === 'descending') {
      processedData.sort((a, b) => (b.value || 0) - (a.value || 0));
    }
    
    return processedData;
  }, [chartType.id, chartType.sampleData, config.numCategories, config.numSeries, config.numStacks, config.barOrdering]);

  // Get colors based on config
  const colors = useMemo(() => {
    return getColors(config, data.length);
  }, [config, data.length]);

  // Calculate Y domain with smart defaults
  const yDomain = useMemo(() => {
    const values = data.map(d => d.value).filter(v => v !== undefined);
    const min = Math.min(...values);
    
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
    const numSeries = config.numSeries || 3;
    const seriesColors = getColors(config, numSeries);

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
          barSize={Math.max(8, 60 / numSeries)}
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
        
        {Array.from({ length: numSeries }, (_, i) => (
          <Bar 
            key={`series${i + 1}`}
            dataKey={`series${i + 1}`} 
            name={`Series ${i + 1}`} 
            fill={seriesColors[i]} 
            radius={[4, 4, 0, 0]}
          >
            {config.showValues && (
              <LabelList 
                dataKey={`series${i + 1}`} 
                position="top" 
                formatter={(value) => value?.toFixed(config.valueDecimals || 1)}
                style={{ fill: '#000000', fontSize: 9, fontWeight: 500 }}
              />
            )}
          </Bar>
        ))}

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
    const numStacks = config.numStacks || 3;
    const stackColors = getColors(config, numStacks);

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
        
        {Array.from({ length: numStacks }, (_, i) => (
          <Bar 
            key={`stack${i + 1}`}
            dataKey={`stack${i + 1}`} 
            name={`Stack ${i + 1}`} 
            stackId="a" 
            fill={stackColors[i]}
            radius={i === numStacks - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          >
            {config.showValues && (
              <LabelList 
                dataKey={`stack${i + 1}`} 
                position="center" 
                formatter={(value) => value?.toFixed(config.valueDecimals || 0)}
                style={{ fill: i === numStacks - 1 ? '#000000' : '#ffffff', fontSize: 10, fontWeight: 500 }}
              />
            )}
          </Bar>
        ))}

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
