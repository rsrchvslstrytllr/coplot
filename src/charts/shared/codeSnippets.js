/**
 * Matplotlib Code Snippets
 * Reusable code generation building blocks
 */

/**
 * Standard imports and font setup
 */
export function matplotlibSetup() {
  return `import matplotlib.pyplot as plt
import numpy as np
import matplotlib.font_manager as fm

# Load custom font
font_path = 'fonts/CohereText-Regular.ttf'  # Adjust path as needed
try:
    prop = fm.FontProperties(fname=font_path)
    plt.rcParams['font.family'] = prop.get_name()
except:
    print("Custom font not found, using default")

# Set darker styling for all text and lines
plt.rcParams['text.color'] = '#000000'
plt.rcParams['axes.labelcolor'] = '#000000'
plt.rcParams['xtick.color'] = '#000000'
plt.rcParams['ytick.color'] = '#000000'
plt.rcParams['axes.edgecolor'] = '#000000'

# Keep grid subtle
plt.rcParams['grid.color'] = '#CCCCCC'
plt.rcParams['grid.alpha'] = 0.3`;
}

/**
 * Figure creation
 */
export function createFigure(width = 5.5, height = 4.5, dpi = 300) {
  return `
# Create figure and axis with publication-quality settings
fig, ax = plt.subplots(figsize=(${width}, ${height}), dpi=${dpi})`;
}

/**
 * Title code generation
 */
export function titleCode(config) {
  if (!config.title) return '';
  return `
# Add title (outside plot area, top left)
fig.suptitle('${config.title}', fontsize=14, x=0.125, y=0.98, ha='left', color='#000000')`;
}

/**
 * Grid code generation
 */
export function gridCode(config, axis = 'y') {
  if (!config.showGrid) return "# Grid disabled";
  return `ax.grid(axis='${axis}', alpha=0.3, linestyle='--', linewidth=0.5, zorder=0)
ax.set_axisbelow(True)`;
}

/**
 * Axis labels code generation
 */
export function axisLabelsCode(config) {
  return `
# Customize axes with dark black text
ax.set_xlabel('${config.xlabel || ''}', fontsize=12, labelpad=10, color='#000000')
ax.set_ylabel('${config.ylabel || ''}', fontsize=12, color='#000000', labelpad=10)`;
}

/**
 * Y-axis range code generation
 */
export function yAxisRangeCode(config) {
  const hasYMin = config.yMin && config.yMin.trim() !== '';
  const hasYMax = config.yMax && config.yMax.trim() !== '';
  
  if (!hasYMin && !hasYMax) return '# Auto y-axis range';
  
  const parts = [];
  if (hasYMin) parts.push(`bottom=${config.yMin}`);
  if (hasYMax) parts.push(`top=${config.yMax}`);
  
  return `ax.set_ylim(${parts.join(', ')})`;
}

/**
 * X-axis range code generation (for horizontal charts)
 */
export function xAxisRangeCode(config) {
  const hasXMin = config.xMin && config.xMin.trim() !== '';
  const hasXMax = config.xMax && config.xMax.trim() !== '';
  
  if (!hasXMin && !hasXMax) return '# Auto x-axis range';
  
  const parts = [];
  if (hasXMin) parts.push(`left=${config.xMin}`);
  if (hasXMax) parts.push(`right=${config.xMax}`);
  
  return `ax.set_xlim(${parts.join(', ')})`;
}

/**
 * Reference line code generation
 */
export function referenceLineCode(config, axis = 'horizontal') {
  const hasReferenceLine = config.showReferenceLine && 
    config.referenceValue && 
    config.referenceValue.trim() !== '';
  
  if (!hasReferenceLine) return '';
  
  if (axis === 'horizontal') {
    return `
# Add reference line
ax.axhline(y=${config.referenceValue}, color='red', linestyle='--', 
          linewidth=2, alpha=0.7, label='${config.referenceLabel || 'Reference'}')
ax.legend(loc='best', fontsize=10)`;
  } else {
    return `
# Add reference line
ax.axvline(x=${config.referenceValue}, color='red', linestyle='--', 
           linewidth=2, alpha=0.7, label='${config.referenceLabel || 'Reference'}')
ax.legend(loc='best', fontsize=10)`;
  }
}

/**
 * Label rotation code
 */
export function labelRotationCode(config, axis = 'x') {
  if (!config.labelRotation || config.labelRotation === 0) return '';
  
  const ha = config.labelRotation !== 0 ? 'right' : 'center';
  return `
# Rotate ${axis}-axis labels
plt.${axis}ticks(rotation=${config.labelRotation}, ha='${ha}')`;
}

/**
 * Spine styling (remove top/right, style bottom/left)
 */
export function spineCode() {
  return `
# Remove top and right spines for cleaner look
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['bottom'].set_linewidth(1)
ax.spines['left'].set_linewidth(1)

# Adjust spine positions
ax.spines['left'].set_position(('outward', 2))
ax.spines['bottom'].set_position(('outward', 2))`;
}

/**
 * Figure finish (tight layout + show)
 */
export function finishCode(saveName = null) {
  let code = `
# Tight layout
plt.tight_layout(rect=[0, 0.03, 1, 0.97])`;

  if (saveName) {
    code += `

# Save figure (uncomment to save)
# plt.savefig('${saveName}.png', dpi=300, bbox_inches='tight')`;
  }

  code += `

# Display the plot
plt.show()`;

  return code;
}

/**
 * Bar ordering/sorting code
 */
export function sortingCode(config, dataVar = 'values', labelsVar = 'labels') {
  if (config.barOrdering === 'original' || !config.barOrdering) return '';
  
  const direction = config.barOrdering === 'descending' ? '[::-1]' : '';
  
  return `
# Sort data
sorted_indices = np.argsort(${dataVar})${direction}
${labelsVar} = [${labelsVar}[i] for i in sorted_indices]
${dataVar} = [${dataVar}[i] for i in sorted_indices]`;
}

/**
 * Value labels on bars code
 */
export function valueLabelsCode(config, orientation = 'vertical') {
  if (!config.showValues) return '# Value labels disabled';
  
  const decimals = config.valueDecimals ?? 1;
  
  if (orientation === 'vertical') {
    return `# Add value labels on bars
for bar in bars:
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2., height,
            f'{height:.${decimals}f}',
            ha='center', va='bottom', fontsize=10, color='#000000')`;
  } else {
    return `# Add value labels on bars
for bar in bars:
    width = bar.get_width()
    ax.text(width, bar.get_y() + bar.get_height()/2.,
            f'{width:.${decimals}f}',
            ha='left', va='center', fontsize=10, color='#000000',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor='none', alpha=0.7))`;
  }
}
