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
 * Interpolate between two hex colors
 */
function interpolateColor(color1, color2, factor) {
  const hex = (c) => parseInt(c, 16);
  const r1 = hex(color1.slice(1, 3));
  const g1 = hex(color1.slice(3, 5));
  const b1 = hex(color1.slice(5, 7));
  const r2 = hex(color2.slice(1, 3));
  const g2 = hex(color2.slice(3, 5));
  const b2 = hex(color2.slice(5, 7));
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

/**
 * Generate N interpolated colors from a palette
 */
export function interpolatePalette(palette, count) {
  if (count <= 1) return [palette[Math.floor(palette.length / 2)]];
  if (count === palette.length) return [...palette];
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const position = i / (count - 1) * (palette.length - 1);
    const lower = Math.floor(position);
    const upper = Math.ceil(position);
    const factor = position - lower;
    
    if (lower === upper) {
      result.push(palette[lower]);
    } else {
      result.push(interpolateColor(palette[lower], palette[upper], factor));
    }
  }
  return result;
}

/**
 * Get colors for chart elements based on config
 */
export function getColors(config, count) {
  const numCategories = config.numCategories || count;
  
  if (config.useBluesPalette) {
    return interpolatePalette(BLUES_PALETTE, numCategories);
  } else if (config.useRedsPalette) {
    return interpolatePalette(REDS_PALETTE, numCategories);
  } else if (config.useGreensPalette) {
    return interpolatePalette(GREENS_PALETTE, numCategories);
  } else if (config.useMultiColor) {
    return interpolatePalette(MULTI_PALETTE, numCategories);
  }
  // Single color - return array of same color
  return Array(numCategories).fill(config.color || '#4C6EE6');
}

/**
 * Generate matplotlib color code based on config with interpolation
 */
export function generateColorCode(config, varName = 'bar_colors') {
  const n = config.numCategories || 5;
  
  if (config.useBluesPalette) {
    const colors = interpolatePalette(BLUES_PALETTE, n);
    return `# Blues palette (${n} interpolated colors)
${varName} = ${JSON.stringify(colors)}`;
  } else if (config.useRedsPalette) {
    const colors = interpolatePalette(REDS_PALETTE, n);
    return `# Reds palette (${n} interpolated colors)
${varName} = ${JSON.stringify(colors)}`;
  } else if (config.useGreensPalette) {
    const colors = interpolatePalette(GREENS_PALETTE, n);
    return `# Greens palette (${n} interpolated colors)
${varName} = ${JSON.stringify(colors)}`;
  } else if (config.useMultiColor) {
    const colors = interpolatePalette(MULTI_PALETTE, n);
    return `# Multi-color palette (${n} interpolated colors)
${varName} = ${JSON.stringify(colors)}`;
  }
  return `# Single color for all bars
${varName} = '${config.color || '#4C6EE6'}'`;
}
