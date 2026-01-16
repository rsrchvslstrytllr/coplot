/**
 * Horizontal Bar Chart Type Definition
 */

import {
  colorControls,
  numCategoriesControl,
  barOrderingControl,
  gridControl,
  showValuesControl,
  valueDecimalsControl,
  axisControlsHorizontal,
  referenceLineControls,
} from '../shared/controls';

import {
  matplotlibSetup,
  createFigure,
  titleCode,
  gridCode,
  axisLabelsCode,
  xAxisRangeCode,
  referenceLineCode,
  spineCode,
  finishCode,
  sortingCode,
  valueLabelsCode,
} from '../shared/codeSnippets';

import { generateColorCode } from '../shared/palettes';

export default {
  id: 'horizontal-bar',
  name: 'Horizontal Bar Chart',
  category: 'bar',
  description: 'Compare values with horizontal bars',
  
  sampleData: [
    { name: 'Cat 1', value: 45.2 },
    { name: 'Cat 2', value: 78.5 },
    { name: 'Cat 3', value: 62.3 },
    { name: 'Cat 4', value: 28.7 },
    { name: 'Cat 5', value: 51.8 },
  ],
  
  defaultConfig: {
    color: '#4C6EE6',
    useBluesPalette: false,
    useMultiColor: false,
    useRedsPalette: false,
    useGreensPalette: false,
    numCategories: 5,
    showGrid: true,
    showValues: true,
    valueDecimals: 1,
    ylabel: 'Model',
    xlabel: 'Inference Time (ms)',
    title: '',
    xMin: '',
    xMax: '',
    showReferenceLine: false,
    referenceValue: '',
    referenceLabel: 'Baseline',
    barOrdering: 'original',
  },
  
  controls: [
    ...colorControls,
    numCategoriesControl,
    barOrderingControl,
    gridControl,
    showValuesControl,
    valueDecimalsControl,
    ...axisControlsHorizontal,
    ...referenceLineControls,
  ],
  
  generateCode: (config) => {
    const n = config.numCategories || 5;
    const categories = Array.from({ length: n }, (_, i) => `Cat ${i + 1}`);
    const values = Array.from({ length: n }, () => (30 + Math.random() * 50).toFixed(1));
    
    return `${matplotlibSetup()}

# ======== ADD YOUR DATA HERE ========
categories = ${JSON.stringify(categories)}  # Category labels
values = [${values.join(', ')}]  # Values
# ====================================
${sortingCode(config, 'values', 'categories')}
${createFigure()}

${generateColorCode(config, 'bar_colors')}

# Create horizontal bar chart
bars = ax.barh(categories, values, color=bar_colors, height=0.6,
               edgecolor='#000000', linewidth=1.0)
${titleCode(config)}
${axisLabelsCode(config)}

# Add grid
${gridCode(config, 'x')}

${valueLabelsCode(config, 'horizontal')}

# Set x-axis range
${xAxisRangeCode(config)}
${referenceLineCode(config, 'vertical')}
${spineCode()}
${finishCode('horizontal_bar_chart')}`;
  },
};
