/**
 * Box Plot Chart Type Definition
 */

import {
  paletteControl,
  gridControl,
  titleControl,
  xLabelControl,
  yLabelControl,
  yMinControl,
  yMaxControl,
} from '../shared/controls';

import {
  matplotlibSetup,
  createFigure,
  titleCode,
  gridCode,
  axisLabelsCode,
  yAxisRangeCode,
  spineCode,
  finishCode,
} from '../shared/codeSnippets';

const boxPlot = {
  id: 'box-plot',
  name: 'Box Plot',
  category: 'distribution',
  description: 'Compare distributions and identify outliers',
  
  sampleData: [
    // GPT-4 - consistent high performer
    { category: 'GPT-4', values: [82, 86, 89, 91, 93, 94, 95, 95, 96, 97, 98, 99, 99], median: 95, q1: 90, q3: 97, min: 82, max: 99, outliers: [] },
    // Claude - strong and stable
    { category: 'Claude', values: [78, 82, 85, 88, 90, 91, 92, 93, 94, 95, 96, 97, 98], median: 92, q1: 87, q3: 95, min: 78, max: 98, outliers: [] },
    // Gemini - variable with outlier
    { category: 'Gemini', values: [75, 80, 84, 87, 89, 90, 91, 92, 93, 94, 95, 96, 65], median: 90, q1: 84, q3: 94, min: 75, max: 96, outliers: [65] },
    // LLaMA - developing performance
    { category: 'LLaMA', values: [70, 74, 78, 81, 84, 86, 87, 88, 90, 91, 93, 95, 97], median: 87, q1: 80, q3: 92, min: 70, max: 97, outliers: [] },
  ],
  
  defaultConfig: {
    useBluesPalette: false,
    useMultiColor: true,
    useRedsPalette: false,
    useGreensPalette: false,
    showGrid: true,
    showOutliers: true,
    boxWidth: 0.4,
    ylabel: 'Performance Score (%)',
    xlabel: 'Model Architecture',
    title: '',
    yMin: '',
    yMax: '',
  },
  
  controls: [
    paletteControl,
    {
      key: 'showOutliers',
      label: 'Show Outliers',
      type: 'toggle',
    },
    {
      key: 'boxWidth',
      label: 'Box Width',
      type: 'slider',
      min: 0.3,
      max: 0.9,
      step: 0.1,
      unit: '',
    },
    gridControl,
    xLabelControl,
    yLabelControl,
    titleControl,
    yMinControl,
    yMaxControl,
  ],
  
  generateCode: (config) => {
    // Determine colors based on palette selection
    let colors;
    if (config.useBluesPalette) {
      colors = "['#1E265C', '#4C6EE6', '#8FA6F9', '#A5C4FF']";
    } else if (config.useRedsPalette) {
      colors = "['#662F24', '#C44B3D', '#FFA18C', '#FFB8A8']";
    } else if (config.useGreensPalette) {
      colors = "['#16270D', '#357A4D', '#5BBF8A', '#CFE9B4']";
    } else {
      // Default to multi-color palette
      colors = "['#2D4DB9', '#C44B3D', '#9E4FA5', '#4C6EE6']";
    }

    const showOutliersCode = config.showOutliers 
      ? "showfliers=True, flierprops=dict(marker='*', markersize=8, markerfacecolor='#000000', markeredgecolor='#000000')"
      : "showfliers=False";

    return `${matplotlibSetup()}

# ======== ADD YOUR DATA HERE ========
data = {
    'GPT-4': [82, 86, 89, 91, 93, 94, 95, 95, 96, 97, 98, 99, 99],  # Category 1 values
    'Claude': [78, 82, 85, 88, 90, 91, 92, 93, 94, 95, 96, 97, 98],  # Category 2 values
    'Gemini': [75, 80, 84, 87, 89, 90, 91, 92, 93, 94, 95, 96, 65],  # Category 3 (with outlier)
    'LLaMA': [70, 74, 78, 81, 84, 86, 87, 88, 90, 91, 93, 95, 97]  # Category 4 values
}
# ====================================

# Prepare data for box plot
models = list(data.keys())
values = list(data.values())
${createFigure()}

# Define colors for each box
colors = ${colors}

# Create box plot
bp = ax.boxplot(values,
               labels=models,
               patch_artist=True,
               widths=${config.boxWidth || 0.4},
               ${showOutliersCode},
               medianprops=dict(color='#000000', linewidth=2),
               boxprops=dict(linewidth=1.5, edgecolor='#000000'),
               whiskerprops=dict(color='#000000', linewidth=1.5),
               capprops=dict(color='#000000', linewidth=1.5))

# Color each box
for patch, color in zip(bp['boxes'], colors):
    patch.set_facecolor(color)
${titleCode(config)}
${axisLabelsCode(config)}

# Add grid
${gridCode(config, 'y')}

# Set y-axis range
${yAxisRangeCode(config)}
${spineCode()}
${finishCode('box_plot')}`;
  },
};

export default boxPlot;
