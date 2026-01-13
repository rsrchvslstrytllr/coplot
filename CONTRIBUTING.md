# Contributing to Co/Plot

## Adding a New Chart Type

Follow this checklist to add a new chart type to the library.

### Step 1: Define Your Chart

Open `src/config/chartTypes.js` and add a new object to the `CHART_TYPES` array:

```javascript
{
  id: 'your-chart-id',           // Unique, kebab-case
  name: 'Your Chart Name',        // Display name
  description: 'Brief description',
  
  // Step 2: Add sample data
  sampleData: [
    { name: 'A', value: 100 },
    { name: 'B', value: 200 },
    // ... more data points
  ],
  
  // Step 3: Define default configuration
  defaultConfig: {
    color: '#4a6fa5',
    // ... other defaults
  },
  
  // Step 4: Define controls
  controls: [
    {
      key: 'color',
      label: 'Chart Color',
      type: 'color',
      options: ['#4a6fa5', '#e85d75', '#50c878']
    },
    // ... more controls
  ],
  
  // Step 5: Write code generator
  generateCode: (config) => {
    return `import matplotlib.pyplot as plt
# Your matplotlib code here
# Use ${config.propertyName} for dynamic values
plt.show()`;
  }
}
```

### Step 2: Sample Data Format

Format your sample data to match your chart's needs:

**Bar/Line Charts:**
```javascript
sampleData: [
  { name: 'Category 1', value: 100 },
  { name: 'Category 2', value: 200 }
]
```

**Scatter Plots:**
```javascript
sampleData: [
  { x: 10, y: 20 },
  { x: 30, y: 40 }
]
```

**Multi-Series:**
```javascript
sampleData: [
  { name: 'Q1', series1: 100, series2: 150 },
  { name: 'Q2', series1: 200, series2: 180 }
]
```

### Step 3: Control Types

Choose from these control types:

#### Color Picker
```javascript
{
  key: 'color',
  label: 'Chart Color',
  type: 'color',
  options: ['#4a6fa5', '#e85d75', '#50c878', '#ffa500', '#9b59b6']
}
```

#### Slider
```javascript
{
  key: 'lineWidth',
  label: 'Line Width',
  type: 'slider',
  min: 1,
  max: 10,
  step: 0.5,
  unit: 'px'  // optional
}
```

#### Dropdown
```javascript
{
  key: 'legendPosition',
  label: 'Legend Position',
  type: 'select',
  options: [
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' }
  ]
}
```

#### Toggle
```javascript
{
  key: 'showGrid',
  label: 'Show Grid',
  type: 'toggle'
}
```

#### Text Input
```javascript
{
  key: 'chartTitle',
  label: 'Chart Title',
  type: 'text',
  placeholder: 'Enter title...'
}
```

### Step 4: Code Generation

Write clean, runnable Matplotlib code:

```javascript
generateCode: (config) => {
  return `import matplotlib.pyplot as plt
import numpy as np

# Sample data (user can replace this)
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]

# Create figure
fig, ax = plt.subplots(figsize=(10, 6))

# Create chart
ax.plot(x, y, 
        color='${config.color}',
        linewidth=${config.lineWidth},
        label='${config.seriesName}')

# Conditional features
${config.showGrid ? "ax.grid(alpha=0.3)" : ""}
${config.showLegend ? "ax.legend()" : ""}

# Labels
ax.set_xlabel('${config.xLabel || 'X Axis'}')
ax.set_ylabel('${config.yLabel || 'Y Axis'}')
${config.title ? `ax.set_title('${config.title}')` : ""}

# Display
plt.tight_layout()
plt.show()`;
}
```

**Tips:**
- Include all necessary imports
- Add comments for clarity
- Use template literals: `${config.value}`
- Use ternary operators for conditionals: `${config.show ? 'code' : ''}`
- Keep it runnable - user should be able to copy & paste directly

### Step 5: Update Preview (if needed)

If Recharts doesn't support your chart type out of the box, update `src/components/ChartPreview.jsx`:

```javascript
case 'your-chart-id':
  return (
    <YourCustomChart 
      data={data}
      config={config}
    />
  );
```

### Step 6: Test Your Chart

1. **Visual test**: Select your chart, verify it appears correctly
2. **Controls test**: Adjust each control, verify preview updates
3. **Code test**: Copy generated code, run in Python, verify output
4. **Edge cases**: Test min/max values, empty states, long strings

### Testing Checklist

- [ ] Chart appears on homepage
- [ ] Preview renders correctly
- [ ] All controls work as expected
- [ ] Preview updates in real-time
- [ ] Generated code is syntactically correct
- [ ] Generated code runs without errors
- [ ] Generated code produces expected output
- [ ] Colors match between preview and generated code
- [ ] All config options are reflected in code

### Common Patterns

#### Multiple Data Series
```javascript
controls: [
  {
    key: 'series1Color',
    label: 'Series 1 Color',
    type: 'color',
    options: [...]
  },
  {
    key: 'series2Color',
    label: 'Series 2 Color',
    type: 'color',
    options: [...]
  }
]
```

#### Conditional Code Generation
```javascript
generateCode: (config) => {
  let code = `import matplotlib.pyplot as plt\n\n`;
  
  if (config.showGrid) {
    code += `ax.grid(alpha=0.3)\n`;
  }
  
  if (config.showLegend) {
    code += `ax.legend(loc='${config.legendPosition}')\n`;
  }
  
  return code;
}
```

#### Dynamic Axis Labels
```javascript
{
  key: 'xLabel',
  label: 'X-Axis Label',
  type: 'text',
  placeholder: 'X Axis'
},
{
  key: 'yLabel',
  label: 'Y-Axis Label',
  type: 'text',
  placeholder: 'Y Axis'
}
```

## Style Guide

### Naming Conventions
- Chart IDs: `kebab-case` (e.g., `scatter-plot`)
- Config keys: `camelCase` (e.g., `labelRotation`)
- Component names: `PascalCase` (e.g., `ChartPreview`)

### Color Palette
Use these default colors for consistency:
- Primary blue: `#4a6fa5`
- Pink/Red: `#e85d75`
- Green: `#50c878`
- Orange: `#ffa500`
- Purple: `#9b59b6`
- Dark gray: `#34495e`

### Code Comments
- Add clear comments in generated code
- Explain non-obvious calculations
- Keep comments concise

## Getting Help

- Check existing chart types for examples
- Read ARCHITECTURE.md for system overview
- Ask in team chat for code reviews

## Pull Request Process

1. Add your chart to `chartTypes.js`
2. Test thoroughly using the checklist
3. Update README.md if adding new functionality
4. Submit PR with description of the new chart
5. Request review from a teammate

## Tips for Success

- **Start simple**: Get basic functionality working first
- **Copy & modify**: Use existing charts as templates
- **Test early**: Check preview and code generation frequently
- **Document**: Add comments for complex logic
- **Think reusable**: Consider if your controls could benefit other charts
