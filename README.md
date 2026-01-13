# Co/Plot

A data visualization tool that helps teams quickly create and customize charts, then export clean Matplotlib code.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
coplot/
├── src/
│   ├── App.jsx                      # Main app with routing logic
│   ├── components/
│   │   ├── HomePage.jsx             # Chart type selection grid
│   │   ├── ChartPage.jsx            # Main chart customization page
│   │   ├── ChartPreview.jsx         # Live chart preview using Recharts
│   │   ├── ChartControls.jsx        # Dynamic control renderer
│   │   └── CodeDisplay.jsx          # Code output with copy button
│   ├── config/
│   │   └── chartTypes.js            # ⭐ Chart library configuration
│   ├── index.js                     # React entry point
│   └── index.css                    # Tailwind styles
├── public/
│   └── index.html
├── package.json
└── tailwind.config.js
```

## Architecture

### Chart Type Definition

All charts are defined in `src/config/chartTypes.js`. Each chart type is an object with:

- **id**: Unique identifier
- **name**: Display name
- **sampleData**: Array of data for preview rendering
- **defaultConfig**: Default values for all controls
- **controls**: Array of control definitions (see below)
- **generateCode**: Function that takes config and returns Matplotlib code string

### Control Types

The system supports five control types:

1. **color**: Color picker with predefined swatches
2. **slider**: Numeric range input
3. **select**: Dropdown menu
4. **toggle**: Checkbox for boolean values
5. **text**: Text input field

### Adding a New Chart Type

1. Open `src/config/chartTypes.js`
2. Add a new object to the `CHART_TYPES` array
3. Define your chart's configuration (see example below)
4. If needed, update `ChartPreview.jsx` to handle rendering your chart type

**Example: Adding a Scatter Plot**

```javascript
{
  id: 'scatter-plot',
  name: 'Scatter Plot',
  description: 'Show correlation between variables',
  
  sampleData: [
    { x: 10, y: 20 },
    { x: 30, y: 45 },
    { x: 50, y: 60 },
    // ... more data
  ],
  
  defaultConfig: {
    color: '#4a6fa5',
    markerSize: 50,
    showGrid: true,
  },
  
  controls: [
    {
      key: 'color',
      label: 'Marker Color',
      type: 'color',
      options: ['#4a6fa5', '#e85d75', '#50c878']
    },
    {
      key: 'markerSize',
      label: 'Marker Size',
      type: 'slider',
      min: 20,
      max: 200,
      step: 10
    },
    {
      key: 'showGrid',
      label: 'Show Grid',
      type: 'toggle'
    }
  ],
  
  generateCode: (config) => {
    return `import matplotlib.pyplot as plt

# Sample data
x = [10, 30, 50, 70, 90]
y = [20, 45, 60, 80, 95]

# Create scatter plot
plt.figure(figsize=(10, 6))
plt.scatter(x, y, 
           color='${config.color}',
           s=${config.markerSize},
           alpha=0.6)

# Customize
plt.xlabel('X Variable')
plt.ylabel('Y Variable')
${config.showGrid ? "plt.grid(alpha=0.3)" : ""}

plt.tight_layout()
plt.show()`;
  }
}
```

## Key Features

### Live Preview
Charts update in real-time as you adjust controls. Uses Recharts for fast, React-native rendering.

### Code Generation
Each chart type has a `generateCode` function that transforms the configuration into clean, executable Matplotlib code.

### Extensible Controls
The control system is fully data-driven. Add new control types in `ChartControls.jsx` if needed.

## Future Enhancements

Potential additions for v2:

- Data upload (CSV/Excel)
- Save configurations to localStorage
- Export charts as PNG/SVG
- Multiple data series support
- Custom chart templates
- Shareable URLs
- User authentication
- Chart library backed by database/API

## Technical Decisions

**Why Recharts?**
- React-native (no D3 complexity)
- Good performance for live updates
- Similar visual style to Matplotlib

**Why client-side only?**
- Faster iteration for v1
- No deployment complexity
- Easy to share and demo
- Can add backend later without major refactor

**Why Tailwind?**
- Rapid prototyping
- Consistent design system
- No CSS file management

## Contributing

To add a new chart type:
1. Define it in `chartTypes.js`
2. Test the preview renders correctly
3. Verify the generated code is valid Matplotlib
4. Submit a PR with your chart type

## License

Internal tool - proprietary
