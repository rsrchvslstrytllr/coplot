/**
 * ChartPreview Component
 * Renders chart previews with fixed dimensions for consistent display
 */

import React from 'react';
import BarChartPreview from './previews/BarChartPreview';
import ScatterPlotPreview from './previews/ScatterPlotPreview';
import LineChartPreview from './previews/LineChartPreview';
import BoxPlotPreview from './previews/BoxPlotPreview';
import HistogramPreview from './previews/HistogramPreview';

// Fixed dimensions for chart preview (20% larger than before)
const CHART_WIDTH = 720;  // was 600
const CHART_HEIGHT = 480; // was 400

function ChartPreview({ chartType, config }) {
  const renderPreview = () => {
    switch (chartType.category) {
      case 'bar':
        return (
          <BarChartPreview 
            chartType={chartType}
            config={config}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
          />
        );
      
      case 'scatter':
        return (
          <ScatterPlotPreview 
            chartType={chartType}
            config={config}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
          />
        );
      
      case 'line':
        return (
          <LineChartPreview 
            chartType={chartType}
            config={config}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
          />
        );
      
      case 'distribution':
        return (
          <BoxPlotPreview 
            chartType={chartType}
            config={config}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
          />
        );
      
      case 'histogram':
        return (
          <HistogramPreview 
            chartType={chartType}
            config={config}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
          />
        );
      
      default:
        return (
          <div 
            className="flex items-center justify-center text-gray-500"
            style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}
          >
            Preview not available for this chart type
          </div>
        );
    }
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center">
      <div 
        style={{ 
          width: CHART_WIDTH, 
          height: CHART_HEIGHT,
          flexShrink: 0,
        }}
      >
        {renderPreview()}
      </div>
    </div>
  );
}

export default ChartPreview;
