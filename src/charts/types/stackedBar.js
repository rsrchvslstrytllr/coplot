/**
 * Stacked Bar Chart Type Definition
 */

import {
  paletteControl,
  numCategoriesControl,
  numStacksControl,
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

import { interpolatePalette, BLUES_PALETTE, REDS_PALETTE, GREENS_PALETTE, MULTI_PALETTE } from '../shared/palettes';

const showLegendControl = {
  key: 'showLegend',
  label: 'Show Legend',
  type: 'toggle',
};

const stackedBar = {
  id: 'stacked-bar',
  name: 'Stacked Bar Chart',
  category: 'bar',
  description: 'Show composition of totals across categories',
  
  sampleData: [
    { name: 'Cat 1', stack1: 45, stack2: 35, stack3: 20 },
    { name: 'Cat 2', stack1: 60, stack2: 25, stack3: 15 },
    { name: 'Cat 3', stack1: 30, stack2: 40, stack3: 25 },
    { name: 'Cat 4', stack1: 50, stack2: 30, stack3: 30 },
  ],
  
  defaultConfig: {
    useBluesPalette: true,
    useMultiColor: false,
    useRedsPalette: false,
    useGreensPalette: false,
    numCategories: 4,
    numStacks: 3,
    labelRotation: 0,
    showGrid: true,
    showValues: false,
    valueDecimals: 0,
    ylabel: 'Time (hours)',
    xlabel: 'Model',
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
    numCategoriesControl,
    numStacksControl,
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
    const numStacks = config.numStacks || 3;
    
    // Get the right palette
    let palette = MULTI_PALETTE;
    let paletteName = 'Multi-color';
    if (config.useBluesPalette) { palette = BLUES_PALETTE; paletteName = 'Blues'; }
    else if (config.useRedsPalette) { palette = REDS_PALETTE; paletteName = 'Reds'; }
    else if (config.useGreensPalette) { palette = GREENS_PALETTE; paletteName = 'Greens'; }
    
    const colors = interpolatePalette(palette, numStacks);
    
    // Generate category labels
    const categories = Array.from({ length: numCategories }, (_, i) => `Cat ${i + 1}`);
    
    // Generate stack data
    const stackCode = Array.from({ length: numStacks }, (_, i) => {
      const values = Array.from({ length: numCategories }, () => Math.floor(20 + Math.random() * 40));
      return `stack${i + 1} = [${values.join(', ')}]  # Stack ${i + 1} values`;
    }).join('\n');
    
    // Generate bar creation code with proper bottom stacking
    const barCodes = Array.from({ length: numStacks }, (_, i) => {
      if (i === 0) {
        return `bars${i + 1} = ax.bar(categories, stack${i + 1}, label='Stack ${i + 1}', color=colors[${i}])`;
      } else {
        const bottomParts = Array.from({ length: i }, (_, j) => `np.array(stack${j + 1})`).join(' + ');
        return `bars${i + 1} = ax.bar(categories, stack${i + 1}, bottom=${bottomParts}, label='Stack ${i + 1}', color=colors[${i}])`;
      }
    }).join('\n');
    
    // Generate bars list for value labels
    const barsList = Array.from({ length: numStacks }, (_, i) => `bars${i + 1}`).join(', ');

    return `${matplotlibSetup()}

# ======== ADD YOUR DATA HERE ========
categories = ${JSON.stringify(categories)}  # Category labels
${stackCode}
# ====================================
${createFigure()}

# ${paletteName} palette (${numStacks} interpolated colors)
colors = ${JSON.stringify(colors)}

# Create stacked bars
${barCodes}

${config.showValues ? `# Add value labels centered in each segment
for bars in [${barsList}]:
    for bar in bars:
        height = bar.get_height()
        if height > 0:
            ax.text(bar.get_x() + bar.get_width()/2., bar.get_y() + height/2.,
                    f'{height:.${config.valueDecimals || 0}f}',
                    ha='center', va='center', fontsize=9, color='#000000')` : '# Value labels disabled'}
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

export default stackedBar;
