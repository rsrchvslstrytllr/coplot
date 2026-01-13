/**
 * Vertical Bar Chart Type Definition
 */

import {
  colorControls,
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

export default {
  id: 'vertical-bar',
  name: 'Vertical Bar Chart',
  category: 'bar',
  description: 'Compare values across categories',
  
  sampleData: [
    { name: 'ResNet', value: 92.1 },
    { name: 'VGG', value: 88.5 },
    { name: 'MobileNet', value: 89.7 },
    { name: 'EfficientNet', value: 94.3 },
    { name: 'ViT', value: 91.2 },
  ],
  
  defaultConfig: {
    color: '#4C6EE6',
    useBluesPalette: false,
    useMultiColor: false,
    useRedsPalette: false,
    labelRotation: 0,
    showGrid: true,
    showValues: false,
    valueDecimals: 1,
    ylabel: 'Accuracy (%)',
    xlabel: 'Model Architecture',
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
    barOrderingControl,
    labelRotationControl,
    gridControl,
    showValuesControl,
    valueDecimalsControl,
    ...axisControls,
    ...referenceLineControls,
  ],
  
  generateCode: (config) => {
    return `${matplotlibSetup()}

# Model accuracy data
models = ['ResNet', 'VGG', 'MobileNet', 'EfficientNet', 'ViT']
accuracy = [92.1, 88.5, 89.7, 94.3, 91.2]
${sortingCode(config, 'accuracy', 'models')}
${createFigure()}

${generateColorCode(config, 'bar_colors')}

# Create bar chart
bars = ax.bar(models, accuracy, color=bar_colors, width=0.6,
              edgecolor='#000000', linewidth=1.0, alpha=0.85)
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
