# Co/Plot - Quick Start Guide

## Get Running in 2 Minutes

1. **Navigate to the project:**
   ```bash
   cd coplot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the app:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   - App automatically opens at `http://localhost:3000`
   - If not, manually navigate to that URL

## What You'll See

- **Homepage**: Grid of 3 chart types (Vertical Bar, Horizontal Bar, Line Chart)
- **Chart Page**: Live preview + customization controls + generated Matplotlib code

## Try It Out

1. Click any chart type on the homepage
2. Adjust the controls on the right side
3. Watch the preview update in real-time
4. Copy the generated Matplotlib code
5. Paste and run in your Python environment

## Adding Your First Chart

Open `src/config/chartTypes.js` and follow the documented pattern. Each chart needs:
- Sample data
- Default config
- Control definitions
- Code generation function

See the README.md for detailed examples.

## Project Structure

```
coplot/
├── src/
│   ├── App.jsx                    # Main routing
│   ├── components/                # All React components
│   └── config/
│       └── chartTypes.js          # ⭐ Add your charts here
├── package.json
└── README.md                      # Full documentation
```

## Questions?

Read the full README.md for architecture details and how to extend the system.
