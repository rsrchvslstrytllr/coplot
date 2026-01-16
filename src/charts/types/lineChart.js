/**
 * Line Chart Type Definition
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

const lineChart = {
  id: 'line-chart',
  name: 'Line Chart',
  category: 'line',
  description: 'Show trends and changes over time',
  
  sampleData: [
    // GPT Models
    { x: 0, y: 35, series: 'GPT Models' },
    { x: 10, y: 58, series: 'GPT Models' },
    { x: 20, y: 72, series: 'GPT Models' },
    { x: 30, y: 81, series: 'GPT Models' },
    { x: 40, y: 87, series: 'GPT Models' },
    { x: 50, y: 91, series: 'GPT Models' },
    { x: 60, y: 93, series: 'GPT Models' },
    { x: 70, y: 94, series: 'GPT Models' },
    // BERT Models
    { x: 0, y: 42, series: 'BERT Models' },
    { x: 10, y: 61, series: 'BERT Models' },
    { x: 20, y: 74, series: 'BERT Models' },
    { x: 30, y: 82, series: 'BERT Models' },
    { x: 40, y: 87, series: 'BERT Models' },
    { x: 50, y: 90, series: 'BERT Models' },
    { x: 60, y: 91.5, series: 'BERT Models' },
    { x: 70, y: 92, series: 'BERT Models' },
    // LLaMA Models
    { x: 0, y: 30, series: 'LLaMA Models' },
    { x: 10, y: 54, series: 'LLaMA Models' },
    { x: 20, y: 68, series: 'LLaMA Models' },
    { x: 30, y: 78, series: 'LLaMA Models' },
    { x: 40, y: 85, series: 'LLaMA Models' },
    { x: 50, y: 89, series: 'LLaMA Models' },
    { x: 60, y: 92, series: 'LLaMA Models' },
    { x: 70, y: 94, series: 'LLaMA Models' },
  ],
  
  defaultConfig: {
    useBluesPalette: false,
    useMultiColor: true,
    useRedsPalette: false,
    useGreensPalette: false,
    showGrid: true,
    lineWidth: 2,
    showMarkers: true,
    markerSize: 6,
    showLegend: true,
    legendPosition: 'top',
    xlabel: 'Training Epoch',
    ylabel: 'Validation Accuracy (%)',
    title: '',
    xMin: '',
    xMax: '',
    yMin: '',
    yMax: '',
  },
  
  controls: [
    paletteControl,
    {
      key: 'lineWidth',
      label: 'Line Width',
      type: 'slider',
      min: 1,
      max: 5,
      step: 0.5,
      unit: 'px',
    },
    {
      key: 'showMarkers',
      label: 'Show Markers',
      type: 'toggle',
    },
    {
      key: 'markerSize',
      label: 'Marker Size',
      type: 'slider',
      min: 3,
      max: 12,
      step: 1,
      unit: 'px',
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

    const markerStyle = config.showMarkers ? `marker='o', markersize=${config.markerSize || 6},` : '';

    return `${matplotlibSetup()}

# ======== ADD YOUR DATA HERE ========
epochs = [0, 10, 20, 30, 40, 50, 60, 70]  # X-axis values

series_data = {
    'GPT Models': [35, 58, 72, 81, 87, 91, 93, 94],  # Series 1
    'BERT Models': [42, 61, 74, 82, 87, 90, 91.5, 92],  # Series 2
    'LLaMA Models': [30, 54, 68, 78, 85, 89, 92, 94]  # Series 3
}
# ====================================
${createFigure()}

# Define colors for each series
colors = ${colors}

# Plot each series
for idx, (series_name, values) in enumerate(series_data.items()):
    ax.plot(epochs, values,
           color=colors[idx % len(colors)],
           linewidth=${config.lineWidth || 2},
           ${markerStyle}
           label=series_name,
           alpha=0.9)
${titleCode(config)}
${axisLabelsCode(config)}

# Add grid
${gridCode(config, 'both')}

${config.showLegend ? `# Add legend
ax.legend(loc='${config.legendPosition === 'top' ? 'upper center' : config.legendPosition === 'bottom' ? 'lower center' : 'center left'}',
         bbox_to_anchor=(${config.legendPosition === 'top' ? '0.5, 1.12' : config.legendPosition === 'bottom' ? '0.5, -0.15' : '1.05, 0.5'}),
         frameon=False, fontsize=10${config.legendPosition === 'right' ? '' : ', ncol=3'})` : '# Legend disabled'}

# Set axis ranges
${xAxisRangeCode(config)}
${yAxisRangeCode(config)}
${spineCode()}
${finishCode('line_chart')}`;
  },
};

export default lineChart;
