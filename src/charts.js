/**
 * Chart Types Registry
 * Exports all available chart types for the application
 */

import verticalBar from './charts/types/verticalBar';
import horizontalBar from './charts/types/horizontalBar';
import stackedBar from './charts/types/stackedBar';
import groupedBar from './charts/types/groupedBar';
import scatterPlot from './charts/types/scatterPlot';
import lineChart from './charts/types/lineChart';
import boxPlot from './charts/types/boxPlot';
import histogram from './charts/types/histogram';

export const CHART_TYPES = [
  verticalBar,
  horizontalBar,
  stackedBar,
  groupedBar,
  scatterPlot,
  lineChart,
  boxPlot,
  histogram,
  // Add more chart types here as they're implemented
];

export default CHART_TYPES;
