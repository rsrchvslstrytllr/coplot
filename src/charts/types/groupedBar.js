/**
 * Grouped Bar Chart Type Definition
 */

import {
  paletteControl,
  numCategoriesControl,
  numSeriesControl,
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
  referenceLineCode,
  labelRotationCode,
  spineCode,
  finishCode,
} from '../shared/codeSnippets';

import {
  seabornSetup,
  seabornCreateFigure,
  seabornTitleCode,
  seabornGridCode,
  seabornAxisLabelsCode,
  seabornYAxisRangeCode,
  seabornReferenceLineCode,
  seabornLabelRotationCode,
  seabornSpineCode,
  seabornFinishCode,
} from '../shared/seabornSnippets';

import { interpolatePalette, BLUES_PALETTE, REDS_PALETTE, GREENS_PALETTE, MULTI_PALETTE } from '../shared/palettes';

const showLegendControl = {
  key: 'showLegend',
  label: 'Show Legend',
  type: 'toggle',
};

const groupedBar = {
  id: 'grouped-bar',
  name: 'Grouped Bar Chart',
  category: 'bar',
  description: 'Compare multiple metrics across categories',
  
  sampleData: [
    { name: 'Group 1', series1: 78.2, series2: 79.5, series3: 77.8 },
    { name: 'Group 2', series1: 85.3, series2: 86.1, series3: 84.9 },
    { name: 'Group 3', series1: 88.7, series2: 89.2, series3: 88.3 },
    { name: 'Group 4', series1: 90.5, series2: 91.1, series3: 90.2 },
  ],
  
  defaultConfig: {
    useBluesPalette: true,
    useMultiColor: false,
    useRedsPalette: false,
    useGreensPalette: false,
    numCategories: 4,
    numSeries: 3,
    outputFormat: 'matplotlib',
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
    numCategoriesControl,
    numSeriesControl,
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
    const numCategories = config.numCategories || 4;
    const numSeries = config.numSeries || 3;
    
    // Get the right palette
    let palette = MULTI_PALETTE;
    let paletteName = 'Multi-color';
    if (config.useBluesPalette) { palette = BLUES_PALETTE; paletteName = 'Blues'; }
    else if (config.useRedsPalette) { palette = REDS_PALETTE; paletteName = 'Reds'; }
    else if (config.useGreensPalette) { palette = GREENS_PALETTE; paletteName = 'Greens'; }
    
    const colors = interpolatePalette(palette, numSeries);
    
    // Generate category labels
    const categories = Array.from({ length: numCategories }, (_, i) => `Group ${i + 1}`);
    
    // Seaborn output - uses long-form DataFrame (much cleaner!)
    if (config.outputFormat === 'seaborn') {
      // Generate data rows for long-form DataFrame
      const dataRows = [];
      for (let i = 0; i < numCategories; i++) {
        for (let j = 0; j < numSeries; j++) {
          const value = (75 + Math.random() * 20).toFixed(1);
          dataRows.push(`    {'group': 'Group ${i + 1}', 'series': 'Series ${j + 1}', 'value': ${value}}`);
        }
      }
      
      return `${seabornSetup()}

# ======== ADD YOUR DATA HERE ========
# Long-form DataFrame (each row is one observation)
df = pd.DataFrame([
${dataRows.join(',\n')}
])
# ====================================
${seabornCreateFigure()}

# ${paletteName} palette (${numSeries} interpolated colors)
palette = ${JSON.stringify(colors)}

# Create grouped bar chart
sns.barplot(data=df, x='group', y='value', hue='series', palette=palette,
            edgecolor='#000000', linewidth=1.0, ax=ax)
${seabornTitleCode(config)}
${seabornAxisLabelsCode(config)}
${seabornLabelRotationCode(config)}

# Add grid
${seabornGridCode(config, 'y')}

${config.showValues ? `# Add value labels on bars
for container in ax.containers:
    ax.bar_label(container, fmt='%.${config.valueDecimals || 1}f', fontsize=9, color='#000000', padding=2)` : '# Value labels disabled'}

# Set y-axis range
${seabornYAxisRangeCode(config)}

${config.showLegend ? `# Customize legend
ax.legend(title='', loc='upper right', fontsize=10)` : `# Remove legend
ax.legend_.remove()`}
${seabornReferenceLineCode(config, 'horizontal')}
${seabornSpineCode()}
${seabornFinishCode('grouped_bar_chart')}`;
    }
    
    // Matplotlib output (default)
    // Generate series data
    const seriesCode = Array.from({ length: numSeries }, (_, i) => {
      const values = Array.from({ length: numCategories }, () => (75 + Math.random() * 20).toFixed(1));
      return `series${i + 1} = [${values.join(', ')}]  # Series ${i + 1} values`;
    }).join('\n');
    
    // Generate bar creation code
    const width = (0.8 / numSeries).toFixed(2);
    const barCodes = Array.from({ length: numSeries }, (_, i) => {
      const offset = ((i - (numSeries - 1) / 2) * parseFloat(width)).toFixed(2);
      return `bars${i + 1} = ax.bar(x + ${offset}, series${i + 1}, ${width}, label='Series ${i + 1}', color=colors[${i}])`;
    }).join('\n');
    
    // Generate series list for value labels
    const barsList = Array.from({ length: numSeries }, (_, i) => `bars${i + 1}`).join(', ');

    return `${matplotlibSetup()}

# ======== ADD YOUR DATA HERE ========
categories = ${JSON.stringify(categories)}  # Group labels
${seriesCode}
# ====================================
${createFigure()}

# ${paletteName} palette (${numSeries} interpolated colors)
colors = ${JSON.stringify(colors)}

# Set up bar positions
x = np.arange(len(categories))

# Create grouped bars
${barCodes}

${config.showValues ? `# Add value labels on bars
for bars in [${barsList}]:
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.${config.valueDecimals || 1}f}',
                ha='center', va='bottom', fontsize=9, color='#000000')` : '# Value labels disabled'}
${titleCode(config)}
${axisLabelsCode(config)}

# Set x-axis ticks
ax.set_xticks(x)
ax.set_xticklabels(categories)
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

export default groupedBar;
