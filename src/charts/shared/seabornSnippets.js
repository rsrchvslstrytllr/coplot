/**
 * Seaborn Code Snippets
 * Reusable code generation building blocks for seaborn charts
 */

/**
 * Standard imports and setup for seaborn
 */
export function seabornSetup() {
  return `import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
import matplotlib.font_manager as fm

# Load custom font
font_path = 'fonts/CohereText-Regular.ttf'  # Adjust path as needed
try:
    prop = fm.FontProperties(fname=font_path)
    plt.rcParams['font.family'] = prop.get_name()
except:
    print("Custom font not found, using default")

# Set styling
plt.rcParams['text.color'] = '#000000'
plt.rcParams['axes.labelcolor'] = '#000000'
plt.rcParams['xtick.color'] = '#000000'
plt.rcParams['ytick.color'] = '#000000'
plt.rcParams['axes.edgecolor'] = '#000000'
plt.rcParams['grid.color'] = '#CCCCCC'
plt.rcParams['grid.alpha'] = 0.3

# Set seaborn style
sns.set_style("white")`;
}

/**
 * Create figure for seaborn
 */
export function seabornCreateFigure(width = 5.5, height = 4.5, dpi = 300) {
  return `
# Create figure
fig, ax = plt.subplots(figsize=(${width}, ${height}), dpi=${dpi})`;
}

/**
 * Title code for seaborn
 */
export function seabornTitleCode(config) {
  if (!config.title) return '';
  return `
# Add title
fig.suptitle('${config.title}', fontsize=14, x=0.125, y=0.98, ha='left', color='#000000')`;
}

/**
 * Grid code for seaborn
 */
export function seabornGridCode(config, axis = 'y') {
  if (!config.showGrid) return "# Grid disabled";
  return `ax.grid(axis='${axis}', alpha=0.3, linestyle='--', linewidth=0.5, zorder=0)
ax.set_axisbelow(True)`;
}

/**
 * Axis labels for seaborn
 */
export function seabornAxisLabelsCode(config) {
  return `
# Customize axes
ax.set_xlabel('${config.xlabel || ''}', fontsize=12, labelpad=10, color='#000000')
ax.set_ylabel('${config.ylabel || ''}', fontsize=12, color='#000000', labelpad=10)`;
}

/**
 * Y-axis range for seaborn
 */
export function seabornYAxisRangeCode(config) {
  const hasYMin = config.yMin && config.yMin.trim() !== '';
  const hasYMax = config.yMax && config.yMax.trim() !== '';
  
  if (!hasYMin && !hasYMax) return '# Auto y-axis range';
  
  const parts = [];
  if (hasYMin) parts.push(`bottom=${config.yMin}`);
  if (hasYMax) parts.push(`top=${config.yMax}`);
  
  return `ax.set_ylim(${parts.join(', ')})`;
}

/**
 * X-axis range for seaborn
 */
export function seabornXAxisRangeCode(config) {
  const hasXMin = config.xMin && config.xMin.trim() !== '';
  const hasXMax = config.xMax && config.xMax.trim() !== '';
  
  if (!hasXMin && !hasXMax) return '# Auto x-axis range';
  
  const parts = [];
  if (hasXMin) parts.push(`left=${config.xMin}`);
  if (hasXMax) parts.push(`right=${config.xMax}`);
  
  return `ax.set_xlim(${parts.join(', ')})`;
}

/**
 * Spine styling for seaborn
 */
export function seabornSpineCode() {
  return `
# Remove top and right spines
sns.despine()
ax.spines['bottom'].set_linewidth(1)
ax.spines['left'].set_linewidth(1)`;
}

/**
 * Finish code for seaborn
 */
export function seabornFinishCode(saveName = null) {
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
 * Reference line code for seaborn
 */
export function seabornReferenceLineCode(config, axis = 'horizontal') {
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
 * Label rotation for seaborn
 */
export function seabornLabelRotationCode(config, axis = 'x') {
  if (!config.labelRotation || config.labelRotation === 0) return '';
  
  const ha = config.labelRotation !== 0 ? 'right' : 'center';
  return `
# Rotate ${axis}-axis labels
plt.xticks(rotation=${config.labelRotation}, ha='${ha}')`;
}
