/**
 * Horizontal Bar Chart Type Definition
 */

import {
  colorControls,
  numCategoriesControl,
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

import {
  seabornSetup,
  seabornCreateFigure,
  seabornTitleCode,
  seabornGridCode,
  seabornAxisLabelsCode,
  seabornXAxisRangeCode,
  seabornReferenceLineCode,
  seabornSpineCode,
  seabornFinishCode,
} from '../shared/seabornSnippets';

import { generateColorCode, interpolatePalette, BLUES_PALETTE, REDS_PALETTE, GREENS_PALETTE, MULTI_PALETTE } from '../shared/palettes';

const horizontalBar = {
  id: 'horizontal-bar',
  name: 'Horizontal Bar Chart',
  category: 'bar',
  description: 'Compare values with horizontal bars',
  
  sampleData: [
    { name: 'Cat 1', value: 45.2 },
    { name: 'Cat 2', value: 78.5 },
    { name: 'Cat 3', value: 62.3 },
    { name: 'Cat 4', value: 28.7 },
    { name: 'Cat 5', value: 51.8 },
  ],
  
  defaultConfig: {
    color: '#4C6EE6',
    useBluesPalette: false,
    useMultiColor: false,
    useRedsPalette: false,
    useGreensPalette: false,
    numCategories: 5,
    outputFormat: 'matplotlib',
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
    numCategoriesControl,
    barOrderingControl,
    gridControl,
    showValuesControl,
    valueDecimalsControl,
    ...axisControlsHorizontal,
    ...referenceLineControls,
  ],
  
  generateCode: (config) => {
    const n = config.numCategories || 5;
    const categories = Array.from({ length: n }, (_, i) => `Cat ${i + 1}`);
    const values = Array.from({ length: n }, () => (30 + Math.random() * 50).toFixed(1));
    
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

# Create horizontal bar chart
sns.barplot(data=df, x='value', y='category', palette=palette, 
            edgecolor='#000000', linewidth=1.0, orient='h', ax=ax)
${seabornTitleCode(config)}
${seabornAxisLabelsCode(config)}

# Add grid
${seabornGridCode(config, 'x')}

${config.showValues ? `# Add value labels on bars
for container in ax.containers:
    ax.bar_label(container, fmt='%.${config.valueDecimals || 1}f', fontsize=10, color='#000000', padding=3)` : '# Value labels disabled'}

# Set x-axis range
${seabornXAxisRangeCode(config)}
${seabornReferenceLineCode(config, 'vertical')}
${seabornSpineCode()}
${seabornFinishCode('horizontal_bar_chart')}`;
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

# Create horizontal bar chart
bars = ax.barh(categories, values, color=bar_colors, height=0.6,
               edgecolor='#000000', linewidth=1.0)
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

export default horizontalBar;
