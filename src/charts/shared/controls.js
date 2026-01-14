/**
 * Reusable Control Definitions
 * Building blocks for chart control panels
 */

import { SINGLE_COLORS, BLUES_PALETTE, REDS_PALETTE, GREENS_PALETTE, MULTI_PALETTE } from './palettes';

// ============================================
// COLOR CONTROLS
// ============================================

export const colorControl = {
  key: 'color',
  label: 'Single Color (or use palette below)',
  type: 'color',
  options: SINGLE_COLORS.map(c => c.value),
};

export const paletteControl = {
  key: 'paletteGroup',
  label: 'Color Palettes',
  type: 'paletteGroup',
  options: [
    { key: 'useBluesPalette', label: 'Blues', colors: BLUES_PALETTE },
    { key: 'useRedsPalette', label: 'Reds', colors: REDS_PALETTE },
    { key: 'useGreensPalette', label: 'Greens', colors: GREENS_PALETTE },
    { key: 'useMultiColor', label: 'Multi-Color', colors: MULTI_PALETTE },
  ],
};

// ============================================
// AXIS CONTROLS
// ============================================

export const xLabelControl = {
  key: 'xlabel',
  label: 'X-axis Label',
  type: 'text',
  placeholder: 'Enter x-axis label',
};

export const yLabelControl = {
  key: 'ylabel',
  label: 'Y-axis Label',
  type: 'text',
  placeholder: 'Enter y-axis label',
};

export const yMinControl = {
  key: 'yMin',
  label: 'Y-axis Minimum',
  type: 'text',
  placeholder: 'Auto (leave empty for 0)',
};

export const yMaxControl = {
  key: 'yMax',
  label: 'Y-axis Maximum',
  type: 'text',
  placeholder: 'Auto (leave empty)',
};

export const xMinControl = {
  key: 'xMin',
  label: 'X-axis Minimum',
  type: 'text',
  placeholder: 'Auto (leave empty for 0)',
};

export const xMaxControl = {
  key: 'xMax',
  label: 'X-axis Maximum',
  type: 'text',
  placeholder: 'Auto (leave empty)',
};

export const titleControl = {
  key: 'title',
  label: 'Chart Title',
  type: 'text',
  placeholder: 'Enter chart title',
};

// ============================================
// DISPLAY CONTROLS
// ============================================

export const gridControl = {
  key: 'showGrid',
  label: 'Show Grid',
  type: 'toggle',
};

export const labelRotationControl = {
  key: 'labelRotation',
  label: 'X-axis Label Rotation',
  type: 'slider',
  min: 0,
  max: 90,
  step: 15,
  unit: '°',
};

export const showValuesControl = {
  key: 'showValues',
  label: 'Show Values on Bars',
  type: 'toggle',
};

export const valueDecimalsControl = {
  key: 'valueDecimals',
  label: 'Value Decimal Places',
  type: 'slider',
  min: 0,
  max: 3,
  step: 1,
  unit: '',
};

// ============================================
// REFERENCE LINE CONTROLS
// ============================================

export const referenceLineControls = [
  {
    key: 'showReferenceLine',
    label: 'Show Reference Line',
    type: 'toggle',
  },
  {
    key: 'referenceValue',
    label: 'Reference Line Value',
    type: 'text',
    placeholder: 'e.g., 85.0',
  },
  {
    key: 'referenceLabel',
    label: 'Reference Line Label',
    type: 'text',
    placeholder: 'e.g., Baseline',
  },
];

// ============================================
// BAR CHART SPECIFIC CONTROLS
// ============================================

export const barOrderingControl = {
  key: 'barOrdering',
  label: 'Bar Ordering',
  type: 'select',
  options: [
    { label: 'Original Order', value: 'original' },
    { label: 'Ascending (Low to High)', value: 'ascending' },
    { label: 'Descending (High to Low)', value: 'descending' },
  ],
};

// ============================================
// LEGEND CONTROLS
// ============================================

export const legendControls = [
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
];

// ============================================
// CONTROL GROUPS (commonly used together)
// ============================================

export const axisControls = [
  xLabelControl,
  yLabelControl,
  titleControl,
  yMinControl,
  yMaxControl,
];

export const axisControlsHorizontal = [
  xLabelControl,
  yLabelControl,
  titleControl,
  xMinControl,
  xMaxControl,
];

export const colorControls = [
  colorControl,
  paletteControl,
];

export const barDisplayControls = [
  barOrderingControl,
  labelRotationControl,
  gridControl,
  showValuesControl,
  valueDecimalsControl,
];
