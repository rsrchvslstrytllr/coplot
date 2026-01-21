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

import { generateColorCode, interpolatePalette, BLUES_PALETTE, REDS_PALETTE, GREENS_PALETTE, MULTI_PALETTE } from '../shared/palettes';

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
    outputFormat: 'matplotlib',
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
    
    // Get palette colors
    let palette = MULTI_PALETTE;
    let paletteName = 'Multi-color';
    if (config.useBluesPalette) { palette = BLUES_PALETTE; paletteName = 'Blues'; }
    else if (config.useRedsPalette) { palette = REDS_PALETTE; paletteName = 'Reds'; }
    else if (config.useGreensPalette) { palette = GREENS_PALETTE; paletteName = 'Greens'; }
    
    const usesPalette = config.useBluesPalette || config.useRedsPalette || config.useGreensPalette || config.useMultiColor;
    const colors = usesPalette ? interpolatePalette(palette, n) : null;
    
    // Seaborn output
    if (config.outputFormat === 'seaborn') {
      const orderCode = config.barOrdering === 'ascending' 
        ? `\ndf = df.sort_values('value', ascending=True)`
        : config.barOrdering === 'descending'
          ? `\ndf = df.sort_values('value', ascending=False)`
          : '';
      
      const paletteCode = usesPalette 
        ? `palette = ${JSON.stringify(colors)}  # ${paletteName} palette`
        : `palette = ['${config.color || '#4C6EE6'}'] * len(df)  # Single color`;
      
      return `${seabornSetup()}

# ======== ADD YOUR DATA HERE ========
df = pd.DataFrame({
    'category': ${JSON.stringify(categories)},
    'value': [${values.join(', ')}]
})
# ====================================${orderCode}
${seabornCreateFigure()}

# Define colors
${paletteCode}

# Create bar chart
sns.barplot(data=df, x='category', y='value', palette=palette, 
            edgecolor='#000000', linewidth=1.0, ax=ax)
${seabornTitleCode(config)}
${seabornAxisLabelsCode(config)}
${seabornLabelRotationCode(config)}

# Add grid
${seabornGridCode(config, 'y')}

${config.showValues ? `# Add value labels on bars
for container in ax.containers:
    ax.bar_label(container, fmt='%.${config.valueDecimals || 1}f', fontsize=10, color='#000000', padding=3)` : '# Value labels disabled'}

# Set y-axis range
${seabornYAxisRangeCode(config)}
${seabornReferenceLineCode(config, 'horizontal')}
${seabornSpineCode()}
${seabornFinishCode('vertical_bar_chart')}`;
    }
    
    // Matplotlib output (default)
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
