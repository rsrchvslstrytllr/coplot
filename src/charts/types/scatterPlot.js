/**
 * Scatter Plot Chart Type Definition
 */

import {
  paletteControl,
  gridControl,
  titleControl,
  xLabelControl,
  yLabelControl,
  xMinControl,
  xMaxControl,
  yMinControl,
  yMaxControl,
} from '../shared/controls';

import {
  matplotlibSetup,
  createFigure,
  titleCode,
  gridCode,
  axisLabelsCode,
  xAxisRangeCode,
  yAxisRangeCode,
  spineCode,
  finishCode,
} from '../shared/codeSnippets';

import { generateColorCode } from '../shared/palettes';

export default {
  id: 'scatter-plot',
  name: 'Scatter Plot',
  category: 'scatter',
  description: 'Visualize relationships between two variables',
  
  sampleData: [
    // Transformers
    { x: 12, y: 10, category: 'Transformers', label: 'BERT-Base' },
    { x: 18, y: 11, category: 'Transformers', label: 'GPT-2' },
    { x: 22, y: 1, category: 'Transformers', label: 'T5-Small' },
    { x: 35, y: 20, category: 'Transformers', label: 'LLaMA-7B' },
    { x: 45, y: 25, category: 'Transformers', label: '' },
    { x: 48, y: 18, category: 'Transformers', label: '' },
    // CNNs
    { x: 25, y: 22, category: 'CNNs', label: 'ResNet-50' },
    { x: 30, y: 17, category: 'CNNs', label: 'EfficientNet' },
    { x: 32, y: 17, category: 'CNNs', label: '' },
    { x: 40, y: 50, category: 'CNNs', label: 'ConvNeXt' },
    { x: 33, y: 19, category: 'CNNs', label: '' },
    // Diffusion Models
    { x: 21, y: 17, category: 'Diffusion Models', label: 'DDPM' },
    { x: 28, y: 2, category: 'Diffusion Models', label: 'Stable Diffusion' },
    { x: 34, y: 6, category: 'Diffusion Models', label: 'DALL-E 2' },
    { x: 15, y: 4, category: 'Diffusion Models', label: 'Imagen' },
    { x: 47, y: 18, category: 'Diffusion Models', label: '' },
  ],
  
  defaultConfig: {
    useBluesPalette: false,
    useMultiColor: true,
    useRedsPalette: false,
    showGrid: true,
    markerSize: 100,
    markerAlpha: 1.0,
    showLegend: true,
    legendPosition: 'top',
    xlabel: 'Training Time (GPU Hours)',
    ylabel: 'Model Accuracy (%)',
    title: '',
    xMin: '',
    xMax: '',
    yMin: '',
    yMax: '',
  },
  
  controls: [
    paletteControl,
    {
      key: 'markerSize',
      label: 'Marker Size',
      type: 'slider',
      min: 20,
      max: 300,
      step: 20,
      unit: 'px',
    },
    {
      key: 'markerAlpha',
      label: 'Marker Transparency',
      type: 'slider',
      min: 0.1,
      max: 1.0,
      step: 0.1,
      unit: '',
    },
    gridControl,
    {
      key: 'showLegend',
      label: 'Show Legend',
      type: 'toggle',
    },
    {
      key: 'legendPosition',
      label: 'Legend Position',
      type: 'select',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Right', value: 'right' },
      ],
    },
    xLabelControl,
    yLabelControl,
    titleControl,
    xMinControl,
    xMaxControl,
    yMinControl,
    yMaxControl,
  ],
  
  generateCode: (config) => {
    // Determine colors based on palette selection
    let colors;
    if (config.useBluesPalette) {
      colors = "['#1E265C', '#4C6EE6', '#8FA6F9']";
    } else if (config.useRedsPalette) {
      colors = "['#662F24', '#C44B3D', '#FFA18C']";
    } else if (config.useGreensPalette) {
      colors = "['#16270D', '#5BBF8A', '#CFE9B4']";
    } else {
      // Default to multi-color palette
      colors = "['#2D4DB9', '#C44B3D', '#9E4FA5']";
    }

    return `${matplotlibSetup()}

# ======== ADD YOUR DATA HERE ========
categories = {
    'Transformers': {
        'x': [12, 18, 22, 35, 45, 48],  # X values for category 1
        'y': [10, 11, 1, 20, 25, 18]  # Y values for category 1
    },
    'CNNs': {
        'x': [25, 30, 32, 40, 33],  # X values for category 2
        'y': [22, 17, 17, 50, 19]  # Y values for category 2
    },
    'Diffusion Models': {
        'x': [21, 28, 34, 15, 47],  # X values for category 3
        'y': [17, 2, 6, 4, 18]  # Y values for category 3
    }
}
# ====================================
${createFigure()}

# Define colors for each model category
colors = ${colors}

# Create scatter plot for each category
for idx, (category, data) in enumerate(categories.items()):
    ax.scatter(data['x'], data['y'],
              s=${config.markerSize || 100},
              c=colors[idx % len(colors)],
              alpha=${config.markerAlpha || 0.7},
              edgecolors='#000000',
              linewidths=1.0,
              label=category,
              zorder=3)
${titleCode(config)}
${axisLabelsCode(config)}

# Add grid
${gridCode(config, 'both')}

${config.showLegend ? `# Add legend
ax.legend(loc='${config.legendPosition === 'top' ? 'upper center' : config.legendPosition === 'bottom' ? 'lower center' : 'center left'}',
         bbox_to_anchor=(${config.legendPosition === 'top' ? '0.5, 1.12' : config.legendPosition === 'bottom' ? '0.5, -0.15' : '1.05, 0.5'}),
         frameon=False, fontsize=10, ncol=${config.legendPosition === 'right' ? '1' : '3'})` : '# Legend disabled'}

# Set axis ranges
${xAxisRangeCode(config)}
${yAxisRangeCode(config)}
${spineCode()}
${finishCode('scatter_plot')}`;
  },
};
