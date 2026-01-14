/**
 * Horizontal Bar Chart Type Definition
 */

import {
  colorControls,
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
    { name: 'BERT-Base', value: 45.2 },
    { name: 'GPT-2', value: 78.5 },
    { name: 'T5-Small', value: 62.3 },
    { name: 'DistilBERT', value: 28.7 },
    { name: 'RoBERTa', value: 51.8 },
  ],
  
  defaultConfig: {
    color: '#4C6EE6',
    useBluesPalette: false,
    useMultiColor: false,
    useRedsPalette: false,
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
    barOrderingControl,
    gridControl,
    showValuesControl,
    valueDecimalsControl,
    ...axisControlsHorizontal,
    ...referenceLineControls,
  ],
  
  generateCode: (config) => {
    return `${matplotlibSetup()}

# ======== ADD YOUR DATA HERE ========
models = ['BERT-Base', 'GPT-2', 'T5-Small', 'DistilBERT', 'RoBERTa']  # Category labels
inference_time = [45.2, 78.5, 62.3, 28.7, 51.8]  # Values
# ====================================
${sortingCode(config, 'inference_time', 'models')}
${createFigure()}

${generateColorCode(config, 'bar_colors')}

# Create horizontal bar chart
bars = ax.barh(models, inference_time, color=bar_colors, height=0.6,
               edgecolor='#000000', linewidth=1.0, alpha=0.85)
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
