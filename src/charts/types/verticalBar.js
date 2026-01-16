/**
 * Vertical Bar Chart Type Definition
 */

import {
  colorControls,
  numCategoriesControl,
  barOrderingControl,
  labelRotationControl,
  gridControl,
  showValuesControl,
  valueDecimalsControl,
  axisControls,
  referenceLineControls,
} from '../shared/controls';

import {
  matplotlibSetup,
  createFigure,
  titleCode,
  gridCode,
  axisLabelsCode,
  yAxisRangeCode,
  referenceLineCode,
  labelRotationCode,
  spineCode,
  finishCode,
  sortingCode,
  valueLabelsCode,
} from '../shared/codeSnippets';

import { generateColorCode } from '../shared/palettes';

// Generate dynamic sample data based on numCategories
function generateSampleData(n) {
  const data = [];
  for (let i = 1; i <= n; i++) {
    data.push({ name: `Cat ${i}`, value: 75 + Math.random() * 20 });
  }
  return data;
}

const verticalBar = {
  id: 'vertical-bar',
  name: 'Vertical Bar Chart',
  category: 'bar',
  description: 'Compare values across categories',
  
  // Dynamic sample data based on config
  getSampleData: (config) => generateSampleData(config.numCategories || 5),
  
  // Static fallback for initial render
  sampleData: [
    { name: 'Cat 1', value: 85.2 },
    { name: 'Cat 2', value: 78.5 },
    { name: 'Cat 3', value: 92.1 },
    { name: 'Cat 4', value: 88.7 },
    { name: 'Cat 5', value: 81.3 },
  ],
  
  defaultConfig: {
    color: '#4C6EE6',
    useBluesPalette: false,
    useMultiColor: false,
    useRedsPalette: false,
    useGreensPalette: false,
    numCategories: 5,
    labelRotation: 0,
    showGrid: true,
    showValues: false,
    valueDecimals: 1,
    ylabel: 'Accuracy (%)',
    xlabel: 'Model',
    title: '',
    yMin: '',
    yMax: '',
    showReferenceLine: false,
    referenceValue: '',
    referenceLabel: 'Baseline',
    barOrdering: 'original',
  },
  
  controls: [
    ...colorControls,
    numCategoriesControl,
    barOrderingControl,
    labelRotationControl,
    gridControl,
    showValuesControl,
    valueDecimalsControl,
    ...axisControls,
    ...referenceLineControls,
  ],
  
  generateCode: (config) => {
    const n = config.numCategories || 5;
    const categories = Array.from({ length: n }, (_, i) => `Cat ${i + 1}`);
    const values = Array.from({ length: n }, () => (75 + Math.random() * 20).toFixed(1));
    
    return `${matplotlibSetup()}

# ======== ADD YOUR DATA HERE ========
categories = ${JSON.stringify(categories)}  # Category labels
values = [${values.join(', ')}]  # Values
# ====================================
${sortingCode(config, 'values', 'categories')}
${createFigure()}

${generateColorCode(config, 'bar_colors')}

# Create bar chart
bars = ax.bar(categories, values, color=bar_colors, width=0.6,
              edgecolor='#000000', linewidth=1.0)
${titleCode(config)}
${axisLabelsCode(config)}
${labelRotationCode(config)}

# Add grid
${gridCode(config, 'y')}

${valueLabelsCode(config, 'vertical')}

# Set y-axis range
${yAxisRangeCode(config)}
${referenceLineCode(config, 'horizontal')}
${spineCode()}
${finishCode('vertical_bar_chart')}`;
  },
};

export default verticalBar;
