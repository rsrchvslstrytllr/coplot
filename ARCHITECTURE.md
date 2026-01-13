# Co/Plot Architecture Overview

## Component Hierarchy

```
App.jsx (routing & state)
    │
    ├─── HomePage.jsx
    │    └── Displays chart type grid
    │
    └─── ChartPage.jsx
         ├── ChartPreview.jsx (live visualization)
         ├── ChartControls.jsx (dynamic controls)
         └── CodeDisplay.jsx (generated code)
```

## Data Flow

```
User selects chart type
    ↓
chartTypes.js provides:
    - sampleData
    - defaultConfig
    - controls array
    - generateCode function
    ↓
ChartPage manages config state
    ↓
    ├─→ ChartPreview renders with config
    ├─→ ChartControls renders with config
    └─→ generateCode() produces Matplotlib code
```

## Key Files for Customization

### 1. `src/config/chartTypes.js` ⭐
**This is where you'll spend most of your time.**

Defines all available charts. Each chart is a self-contained object with everything needed to render and generate code.

### 2. `src/components/ChartControls.jsx`
Renders controls based on type (color, slider, select, toggle, text). Extend this if you need new control types.

### 3. `src/components/ChartPreview.jsx`
Handles rendering different chart types. Add cases here when you add new chart types that need special rendering logic.

## Adding a New Chart Type - Workflow

1. **Add chart definition** to `chartTypes.js`:
   ```javascript
   {
     id: 'my-new-chart',
     name: 'My New Chart',
     sampleData: [...],
     defaultConfig: {...},
     controls: [...],
     generateCode: (config) => { ... }
   }
   ```

2. **If needed**, update `ChartPreview.jsx` to handle rendering:
   ```javascript
   case 'my-new-chart':
     return <CustomChartComponent data={data} config={config} />;
   ```

3. **Test**:
   - Preview renders correctly
   - Controls work as expected
   - Generated code is valid Python/Matplotlib
   - Code produces the expected output

4. **Done!** Your chart appears on the homepage automatically.

## Control Type Reference

| Type | Use Case | Config |
|------|----------|--------|
| `color` | Color selection | `options: ['#hex1', '#hex2']` |
| `slider` | Numeric range | `min, max, step, unit` |
| `select` | Dropdown menu | `options: [{label, value}]` |
| `toggle` | Boolean on/off | No extra config |
| `text` | Text input | `placeholder` (optional) |

## Extension Points

### Add New Control Type
Edit `ChartControls.jsx`, add new case in `renderControl()` switch statement.

### Add Data Upload
Create new component, integrate with ChartPage to pass uploaded data to preview/code generation.

### Add Save/Load
Use localStorage or add backend API calls in App.jsx or new service layer.

### Multi-Series Support
Extend `sampleData` structure and update preview components to handle arrays of series.

## Code Generation Pattern

All `generateCode()` functions follow this pattern:

```javascript
generateCode: (config) => {
  return `import matplotlib.pyplot as plt

# Data section
# ... sample data ...

# Figure setup
fig, ax = plt.subplots(figsize=(10, 6))

# Chart creation with config
ax.plot(..., color='${config.color}', ...)

# Customization based on config
${config.showLegend ? 'ax.legend()' : '# Legend disabled'}

# Display
plt.show()`;
}
```

**Tips:**
- Use template literals for clean interpolation
- Use ternary operators for conditional code
- Keep generated code clean and well-commented
- Include sample data so code runs immediately

## State Management

Current implementation: Single state object in `ChartPage.jsx`

```javascript
const [config, setConfig] = useState(chartType.defaultConfig);
```

For v2, consider:
- Context API for global state
- Redux for complex state management
- URL params for shareable configurations

## Performance Considerations

- Live preview updates on every config change (fast with Recharts)
- Code generation is synchronous (instant)
- No backend calls = zero latency
- For large datasets, consider debouncing preview updates

## Testing Strategy

1. **Visual testing**: Each chart renders correctly with various configs
2. **Code validation**: Generated code runs without errors in Python
3. **Control testing**: All control types work as expected
4. **Edge cases**: Min/max values, empty states, long text inputs
