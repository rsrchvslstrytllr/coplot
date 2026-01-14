/**
 * Stacked Bar Chart Type Definition
 */

import {
  paletteControl,
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
} from '../shared/codeSnippets';

const showLegendControl = {
  key: 'showLegend',
  label: 'Show Legend',
  type: 'toggle',
};

export default {
  id: 'stacked-bar',
  name: 'Stacked Bar Chart',
  category: 'bar',
  description: 'Show composition of totals across categories',
  
  sampleData: [
    { name: 'ResNet', training: 45, validation: 35, test: 20 },
    { name: 'VGG', training: 60, validation: 25, test: 15 },
    { name: 'MobileNet', training: 30, validation: 40, test: 25 },
    { name: 'EfficientNet', training: 50, validation: 30, test: 30 },
  ],
  
  defaultConfig: {
    useBluesPalette: true,
    useMultiColor: false,
    useRedsPalette: false,
    useGreensPalette: false,
    labelRotation: 0,
    showGrid: true,
    showValues: false,
    valueDecimals: 1,
    ylabel: 'Time (hours)',
    xlabel: 'Model Architecture',
    title: '',
    yMin: '',
    yMax: '',
    showReferenceLine: false,
    referenceValue: '',
    referenceLabel: 'Target',
    showLegend: true,
  },
  
  controls: [
    paletteControl,
    labelRotationControl,
    gridControl,
    showValuesControl,
    valueDecimalsControl,
    showLegendControl,
    ...axisControls,
    ...referenceLineControls,
  ],
  
  generateCode: (config) => {
    const hasYMin = config.yMin && config.yMin.trim() !== '';
    const hasYMax = config.yMax && config.yMax.trim() !== '';
    
    const paletteCode = config.useBluesPalette 
      ? `colors = ['#1E265C', '#4C6EE6', '#8FA6F9']  # Blues palette`
      : config.useRedsPalette 
        ? `colors = ['#662F24', '#C44B3D', '#FFA18C']  # Reds palette`
        : config.useGreensPalette
          ? `colors = ['#16270D', '#5BBF8A', '#CFE9B4']  # Greens palette`
          : `colors = ['#2D4DB9', '#C44B3D', '#9E4FA5']  # Multi-color palette`;

    return `${matplotlibSetup()}

# ======== ADD YOUR DATA HERE ========
models = ['ResNet', 'VGG', 'MobileNet', 'EfficientNet']  # Category labels
training = [45, 60, 30, 50]  # Stack 1 values
validation = [35, 25, 40, 30]  # Stack 2 values
test = [20, 15, 25, 30]  # Stack 3 values
# ====================================
${createFigure()}

${paletteCode}

# Create stacked bars
bars1 = ax.bar(models, training, label='Training', color=colors[0], alpha=0.85)
bars2 = ax.bar(models, validation, bottom=training, label='Validation', color=colors[1], alpha=0.85)
bars3 = ax.bar(models, test, bottom=np.array(training) + np.array(validation), label='Test', color=colors[2], alpha=0.85)
${titleCode(config)}
${axisLabelsCode(config)}
${labelRotationCode(config)}

# Add grid
${gridCode(config, 'y')}

# Set y-axis range
${hasYMin || hasYMax ? `ax.set_ylim(${hasYMin ? `bottom=${config.yMin}` : ''}${hasYMin && hasYMax ? ', ' : ''}${hasYMax ? `top=${config.yMax}` : ''})` : '# Auto y-axis range'}

${config.showLegend ? `# Add legend
ax.legend(loc='upper right', fontsize=10)` : '# Legend disabled'}
${referenceLineCode(config, 'horizontal')}
${spineCode()}
${finishCode('stacked_bar_chart')}`;
  },
};
