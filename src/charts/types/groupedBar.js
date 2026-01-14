/**
 * Grouped Bar Chart Type Definition
 */

import {
  paletteControl,
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
} from '../shared/codeSnippets';

const showLegendControl = {
  key: 'showLegend',
  label: 'Show Legend',
  type: 'toggle',
};

export default {
  id: 'grouped-bar',
  name: 'Grouped Bar Chart',
  category: 'bar',
  description: 'Compare multiple metrics across categories',
  
  sampleData: [
    { name: 'Epoch 5', run1: 78.2, run2: 79.5, run3: 77.8 },
    { name: 'Epoch 10', run1: 85.3, run2: 86.1, run3: 84.9 },
    { name: 'Epoch 15', run1: 88.7, run2: 89.2, run3: 88.3 },
    { name: 'Epoch 20', run1: 90.5, run2: 91.1, run3: 90.2 },
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
    ylabel: 'Validation Accuracy (%)',
    xlabel: 'Training Epoch',
    title: '',
    yMin: '',
    yMax: '',
    showReferenceLine: false,
    referenceValue: '',
    referenceLabel: 'Baseline',
    barOrdering: 'original',
    showLegend: true,
  },
  
  controls: [
    paletteControl,
    barOrderingControl,
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
epochs = ['Epoch 5', 'Epoch 10', 'Epoch 15', 'Epoch 20']  # Category labels
run1 = [78.2, 85.3, 88.7, 90.5]  # Series 1 values
run2 = [79.5, 86.1, 89.2, 91.1]  # Series 2 values
run3 = [77.8, 84.9, 88.3, 90.2]  # Series 3 values
# ====================================
${createFigure()}

${paletteCode}

# Set up bar positions
x = np.arange(len(epochs))
width = 0.25

# Create grouped bars
bars1 = ax.bar(x - width, run1, width, label='Run 1', color=colors[0], alpha=0.85)
bars2 = ax.bar(x, run2, width, label='Run 2', color=colors[1], alpha=0.85)
bars3 = ax.bar(x + width, run3, width, label='Run 3', color=colors[2], alpha=0.85)
${titleCode(config)}
${axisLabelsCode(config)}

# Set x-axis ticks
ax.set_xticks(x)
ax.set_xticklabels(epochs)
${labelRotationCode(config)}

# Add grid
${gridCode(config, 'y')}

# Set y-axis range
${hasYMin || hasYMax ? `ax.set_ylim(${hasYMin ? `bottom=${config.yMin}` : ''}${hasYMin && hasYMax ? ', ' : ''}${hasYMax ? `top=${config.yMax}` : ''})` : '# Auto y-axis range'}

${config.showLegend ? `# Add legend
ax.legend(loc='upper right', fontsize=10)` : '# Legend disabled'}
${referenceLineCode(config, 'horizontal')}
${spineCode()}
${finishCode('grouped_bar_chart')}`;
  },
};
