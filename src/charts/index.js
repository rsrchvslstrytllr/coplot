/**
 * Chart Registry
 * Central export point for all chart types
 */

import verticalBar from './types/verticalBar';
import horizontalBar from './types/horizontalBar';
import groupedBar from './types/groupedBar';
import stackedBar from './types/stackedBar';
// Future imports:
// import lineChart from './types/lineChart';
// import scatterPlot from './types/scatterPlot';
// import histogram from './types/histogram';
// import boxPlot from './types/boxPlot';

export const CHART_TYPES = [
  verticalBar,
  horizontalBar,
  groupedBar,
  stackedBar,
  // lineChart,
  // scatterPlot,
  // histogram,
  // boxPlot,
];

// Helper to get chart by ID
export function getChartById(id) {
  return CHART_TYPES.find(chart => chart.id === id);
}

// Helper to get charts by category
export function getChartsByCategory(category) {
  return CHART_TYPES.filter(chart => chart.category === category);
}

export default CHART_TYPES;
