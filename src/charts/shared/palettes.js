/**
 * Color Palettes
 * Centralized color definitions used across all chart types
 */

// Single color options for bar/line charts
export const SINGLE_COLORS = [
  { value: '#1E265C', label: 'Dark Blue (AB-900)' },
  { value: '#2D4DB9', label: 'Blue (AB-700)' },
  { value: '#4C6EE6', label: 'Medium Blue (AB-600)' },
  { value: '#C44B3D', label: 'Red (RC-700)' },
  { value: '#9E4FA5', label: 'Purple (PC-700)' },
  { value: '#3B5F5C', label: 'Dark Green (GG-700)' },
  { value: '#5F8E89', label: 'Green (GG-600)' },
];

// Sequential palettes (light to dark)
export const BLUES_PALETTE = ['#DBE0F2', '#8FA6F9', '#4C6EE6', '#2D4DB9', '#1E265C'];
export const REDS_PALETTE = ['#FFD9D0', '#FFA18C', '#FF7759', '#CA492D', '#662F24'];
export const GREENS_PALETTE = ['#CFE9B4', '#91D49E', '#5BBF8A', '#357A4D', '#16270D'];

// Categorical palette for multi-series
export const MULTI_PALETTE = ['#2D4DB9', '#C44B3D', '#9E4FA5', '#3B5F5C', '#FF7759'];

/**
 * Get colors for chart elements based on config
 */
export function getColors(config, count) {
  if (config.useBluesPalette) {
    return BLUES_PALETTE.slice(0, count);
  } else if (config.useRedsPalette) {
    return REDS_PALETTE.slice(0, count);
  } else if (config.useGreensPalette) {
    return GREENS_PALETTE.slice(0, count);
  } else if (config.useMultiColor) {
    return MULTI_PALETTE.slice(0, count);
  }
  // Single color - return array of same color
  return Array(count).fill(config.color || '#4C6EE6');
}

/**
 * Generate matplotlib color code based on config
 */
export function generateColorCode(config, varName = 'bar_colors') {
  if (config.useBluesPalette) {
    return `# Blues sequential palette
blues_palette = ${JSON.stringify(BLUES_PALETTE)}
${varName} = [blues_palette[i % len(blues_palette)] for i in range(len(data))]`;
  } else if (config.useRedsPalette) {
    return `# Reds sequential palette
reds_palette = ${JSON.stringify(REDS_PALETTE)}
${varName} = [reds_palette[i % len(reds_palette)] for i in range(len(data))]`;
  } else if (config.useGreensPalette) {
    return `# Greens sequential palette
greens_palette = ${JSON.stringify(GREENS_PALETTE)}
${varName} = [greens_palette[i % len(greens_palette)] for i in range(len(data))]`;
  } else if (config.useMultiColor) {
    return `# Multi-color palette
multi_palette = ${JSON.stringify(MULTI_PALETTE)}
${varName} = [multi_palette[i % len(multi_palette)] for i in range(len(data))]`;
  }
  return `# Single color for all bars
${varName} = '${config.color || '#4C6EE6'}'`;
}
