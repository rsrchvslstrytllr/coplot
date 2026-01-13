/**
 * Histogram Chart Type Definition
 */

import {
  colorControl,
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

export default {
  id: 'histogram',
  name: 'Histogram',
  category: 'histogram',
  description: 'Visualize frequency distribution of values',
  
  // Sample data: Model inference times in milliseconds
  sampleData: [
    45, 52, 48, 61, 55, 53, 49, 58, 62, 51,
    47, 56, 59, 54, 50, 63, 57, 46, 60, 52,
    55, 48, 64, 53, 49, 57, 51, 58, 54, 50,
    67, 72, 44, 69, 55, 52, 61, 48, 56, 53,
    71, 47, 59, 54, 65, 51, 58, 49, 62, 55,
    43, 68, 52, 57, 50, 63, 54, 48, 60, 53,
    66, 51, 56, 49, 61, 55, 58, 52, 64, 47,
    70, 54, 59, 50, 62, 53, 57, 48, 65, 51,
  ],
  
  defaultConfig: {
    color: '#4C6EE6',
    showGrid: true,
    numBins: 12,
    showEdges: true,
    barAlpha: 0.7,
    xlabel: 'Inference Time (ms)',
    ylabel: 'Frequency',
    title: '',
    yMin: '',
    yMax: '',
  },
  
  controls: [
    colorControl,
    {
      key: 'numBins',
      label: 'Number of Bins',
      type: 'slider',
      min: 5,
      max: 25,
      step: 1,
      unit: '',
    },
    {
      key: 'barAlpha',
      label: 'Bar Transparency',
      type: 'slider',
      min: 0.3,
      max: 1.0,
      step: 0.1,
      unit: '',
    },
    {
      key: 'showEdges',
      label: 'Show Bar Edges',
      type: 'toggle',
    },
    gridControl,
    xLabelControl,
    yLabelControl,
    titleControl,
    yMinControl,
    yMaxControl,
  ],
  
  generateCode: (config) => {
    const edgeColor = config.showEdges ? "'#000000'" : "'none'";

    return `${matplotlibSetup()}

# Sample inference time data (milliseconds)
inference_times = [
    45, 52, 48, 61, 55, 53, 49, 58, 62, 51,
    47, 56, 59, 54, 50, 63, 57, 46, 60, 52,
    55, 48, 64, 53, 49, 57, 51, 58, 54, 50,
    67, 72, 44, 69, 55, 52, 61, 48, 56, 53,
    71, 47, 59, 54, 65, 51, 58, 49, 62, 55,
    43, 68, 52, 57, 50, 63, 54, 48, 60, 53,
    66, 51, 56, 49, 61, 55, 58, 52, 64, 47,
    70, 54, 59, 50, 62, 53, 57, 48, 65, 51,
]
${createFigure()}

# Create histogram
n, bins, patches = ax.hist(inference_times,
                           bins=${config.numBins || 12},
                           color='${config.color || '#4C6EE6'}',
                           alpha=${config.barAlpha || 0.7},
                           edgecolor=${edgeColor},
                           linewidth=1.2)
${titleCode(config)}
${axisLabelsCode(config)}

# Add grid
${gridCode(config, 'y')}

# Set y-axis range
${yAxisRangeCode(config)}
${spineCode()}
${finishCode('histogram')}`;
  },
};
