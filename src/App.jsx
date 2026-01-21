import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ControlsPanel from './components/ControlsPanel';
import PreviewPanel from './components/PreviewPanel';
import CodePanel from './components/CodePanel';
import MobileGate from './components/MobileGate';
import { CHART_TYPES } from './charts';

function App() {
  const [selectedChartId, setSelectedChartId] = useState(null);
  const [config, setConfig] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile/small screens
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get selected chart type object
  const selectedChart = CHART_TYPES.find(c => c.id === selectedChartId);

  // Update config when chart selection changes
  useEffect(() => {
    if (selectedChart) {
      setConfig(selectedChart.defaultConfig);
    }
  }, [selectedChartId, selectedChart]);

  const handleChartSelect = (chartId) => {
    setSelectedChartId(chartId);
  };

  const handleGoHome = () => {
    setSelectedChartId(null);
    setConfig({});
  };

  const handleConfigChange = (key, value) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      
      // Make palette options mutually exclusive
      if (key === 'useBluesPalette' && value === true) {
        newConfig.useMultiColor = false;
        newConfig.useRedsPalette = false;
        newConfig.useGreensPalette = false;
      } else if (key === 'useRedsPalette' && value === true) {
        newConfig.useBluesPalette = false;
        newConfig.useMultiColor = false;
        newConfig.useGreensPalette = false;
      } else if (key === 'useGreensPalette' && value === true) {
        newConfig.useBluesPalette = false;
        newConfig.useRedsPalette = false;
        newConfig.useMultiColor = false;
      } else if (key === 'useMultiColor' && value === true) {
        newConfig.useBluesPalette = false;
        newConfig.useRedsPalette = false;
        newConfig.useGreensPalette = false;
      }
      
      return newConfig;
    });
  };

  // Generate code (handles both matplotlib and seaborn based on config.outputFormat)
  const generatedCode = selectedChart ? selectedChart.generateCode(config) : '';
  
  // Check if chart supports seaborn (has outputFormat in defaultConfig)
  const supportsSeaborn = selectedChart?.defaultConfig?.outputFormat !== undefined;

  // Show mobile gate for small screens
  if (isMobile) {
    return <MobileGate />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Left sidebar - Chart type navigation */}
      <Sidebar 
        chartTypes={CHART_TYPES}
        selectedChartId={selectedChartId}
        onChartSelect={handleChartSelect}
        onGoHome={handleGoHome}
      />

      {/* Middle column - Controls (only show when chart selected) */}
      {selectedChart && (
        <ControlsPanel 
          chartType={selectedChart}
          config={config}
          onChange={handleConfigChange}
        />
      )}

      {/* Right column - Preview and Code */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {selectedChart ? (
          <>
            <PreviewPanel 
              chartType={selectedChart}
              config={config}
            />
            <CodePanel 
              code={generatedCode}
              supportsSeaborn={supportsSeaborn}
              outputFormat={config.outputFormat}
              onOutputFormatChange={(value) => handleConfigChange('outputFormat', value)}
            />
          </>
        ) : (
          <HomeState />
        )}
      </div>
    </div>
  );
}

// Cohere Labs Logo Component (black version)
function CohereLogo({ className = "" }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 968.1 103.1">
      <g fill="#000000">
        <path d="M134.3,51.5C134.3,19.2,150,.4,177.3.4s34.1,12.4,37.9,33.8h-13.2c-3.4-14.8-11.9-22.3-24.9-22.3-19.3,0-30,14.5-30,39.7s10.3,39.7,29.6,39.7,21.6-7.3,25.2-22.3h13.2c-3.9,21.6-17.8,33.8-38.4,33.8s-42.4-19-42.4-51.2h0Z"/>
        <path d="M227,65.2c0-22.3,14.9-37.5,36.4-37.5s36.4,15.2,36.4,37.5-14.9,37.5-36.4,37.5-36.4-15.2-36.4-37.5ZM287.7,65.2c0-15.7-9.8-27-24.3-27s-24.3,11.4-24.3,27,9.8,27,24.3,27,24.3-11.4,24.3-27Z"/>
        <path d="M379.4,59.6v42.3h-11.8v-41.5c0-14.2-7-21.8-19.4-21.8s-21.6,9.8-21.6,25.3v38.1h-11.8V1.2h11.8v37.5c5.2-7,13.5-11.1,23.6-11.1,18,0,29.2,10.9,29.2,31.9h0Z"/>
        <path d="M406.1,67.8v.7c.4,13.9,9.2,23.7,23.1,23.7s18.4-5.5,20.8-14.9h11.9c-2.9,14.7-14.9,25.4-31.9,25.4s-36.4-15.1-36.4-37.5,14.1-37.5,34.8-37.5,34.2,13.1,34.8,34.8c0,1.1-.1,3.6-.3,5.3h-56.9.1ZM406.8,57.7h43.8c-1.1-12.6-9.8-19.7-22-19.7s-20.7,7.8-21.8,19.7Z"/>
        <path d="M534,28.5v11.5h-9.5c-17.1,0-22.1,13.1-22.1,24.7v26.3h21.4v10.8h-49.6v-10.8h16.4v-51.7h-16.4v-10.8h27.6l.4,12.4c3.3-5.8,9.9-12.4,23.9-12.4,0,0,7.9,0,7.9,0Z"/>
        <path d="M555,67.8v.7c.4,13.9,9.2,23.7,23.1,23.7s18.4-5.5,20.8-14.9h11.9c-2.9,14.7-14.9,25.4-31.9,25.4s-36.4-15.1-36.4-37.5,14.1-37.5,34.8-37.5,34.2,13.1,34.8,34.8c0,1.1,0,3.6-.3,5.3h-56.9.1ZM555.8,57.7h43.8c-1.2-12.6-9.8-19.7-22-19.7s-20.7,7.8-21.8,19.7Z"/>
        <path d="M673.9,101.8V1.2h12.5v89.1h45.1v11.5s-57.6,0-57.6,0Z"/>
        <path d="M810.2,91.1v10.8h-6.5c-9.8,0-13.1-4.2-13.2-11.4-4.6,6.6-11.9,12.2-24.6,12.2s-27-8-27-21.4,10.2-22.9,29.5-22.9h21.6v-5c0-9.5-6.8-15.2-18.3-15.2s-17.2,4.9-18.7,12.4h-11.8c1.7-14.4,13.4-22.9,31-22.9s29.5,9.3,29.5,26.4v32.1c0,3.9,1.4,4.9,4.7,4.9h3.8ZM789.9,68.4h-22.7c-10.5,0-16.4,3.9-16.4,12.2s6.2,12.1,16,12.1c14.7,0,23.1-8.5,23.1-20.7v-3.6h0Z"/>
        <path d="M894.8,65.2c0,22.4-14.9,37.5-35.2,37.5s-20.7-5-25.2-12.1l-1.6,11.2h-10.2V1.2h11.8v39.1c4.9-6.8,12.8-12.6,25.2-12.6,20.3,0,35.2,13.7,35.2,37.5ZM882.7,65.2c0-16-9.8-27-24.3-27s-24.1,11.1-24.1,26.7,9.8,27.3,24.1,27.3,24.3-11.1,24.3-27Z"/>
        <path d="M905.5,77.7h12.1c.4,8.6,8,14.9,20.3,14.9s17.7-4.5,17.7-11.2-8-9.9-19-11.2c-16.4-2-29.5-5.3-29.5-20.6s12.2-22,28.7-22,28.7,7.9,29.9,23.1h-12.1c-.9-7.5-7.8-13.1-17.8-13.1s-17.1,4.3-17.1,11.1,7.8,9.1,18.4,10.3c16.7,2,30,5.2,30,21.4s-13.1,22.1-29.3,22.1-32.1-8.9-32.3-25v.2Z"/>
      </g>
      <path fill="#000000" d="M75.2,16.3l8.7-8.4c1.9-1.8,4.9-1.8,6.7,0,1.8,1.9,1.8,4.9,0,6.7l-13.9,13.4c-12.3,11.9-12,31.8.8,43.3l14.3,12.9c1.9,1.8,2.1,4.8.3,6.7s-4.8,2.1-6.7.3l-13.8-12.5,3.9,18.3c.6,2.6-1.1,5.1-3.7,5.6-2.6.6-5.1-1.1-5.6-3.7l-4-18.9c-3.6-16.8-20.6-27-37.1-22.3l-18.6,5.3c-2.5.7-5.2-.7-5.9-3.3-.7-2.5.7-5.2,3.3-5.9l12-3.4-10.6-3.2c-2.5-.8-3.9-3.4-3.2-5.9.8-2.5,3.4-3.9,5.9-3.2l18.5,5.6c16.4,5,33.6-4.9,37.5-21.7l4.4-18.8c.6-2.5,3.1-4.1,5.7-3.5,2.6.6,4.1,3.1,3.6,5.7l-2.4,10.5h0v.3ZM58.8,57.1c-.6-3.2-.9-6.4-.7-9.6-2.3,1.7-4.8,3.1-7.3,4.2,2.9,1.5,5.6,3.3,8,5.4Z"/>
    </svg>
  );
}

// Single Spark SVG component (the pinwheel shape from the logo)
function Spark({ className = "", style = {} }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 103.1" width="24" height="24">
      <path fill="#000000" d="M75.2,16.3l8.7-8.4c1.9-1.8,4.9-1.8,6.7,0,1.8,1.9,1.8,4.9,0,6.7l-13.9,13.4c-12.3,11.9-12,31.8.8,43.3l14.3,12.9c1.9,1.8,2.1,4.8.3,6.7s-4.8,2.1-6.7.3l-13.8-12.5,3.9,18.3c.6,2.6-1.1,5.1-3.7,5.6-2.6.6-5.1-1.1-5.6-3.7l-4-18.9c-3.6-16.8-20.6-27-37.1-22.3l-18.6,5.3c-2.5.7-5.2-.7-5.9-3.3-.7-2.5.7-5.2,3.3-5.9l12-3.4-10.6-3.2c-2.5-.8-3.9-3.4-3.2-5.9.8-2.5,3.4-3.9,5.9-3.2l18.5,5.6c16.4,5,33.6-4.9,37.5-21.7l4.4-18.8c.6-2.5,3.1-4.1,5.7-3.5,2.6.6,4.1,3.1,3.6,5.7l-2.4,10.5h0v.3ZM58.8,57.1c-.6-3.2-.9-6.4-.7-9.6-2.3,1.7-4.8,3.1-7.3,4.2,2.9,1.5,5.6,3.3,8,5.4Z"/>
    </svg>
  );
}

// Animated Bar Chart with falling sparks
function SparkBarChart() {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    // Small delay before starting animation
    const timer = setTimeout(() => setAnimationStarted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const barHeights = [3, 6, 4, 7, 4];
  const sparkSize = 32;
  const barGap = 10;
  const barWidth = sparkSize;
  
  // Spacing multiplier - sparks spread apart on hover
  const spacingMultiplier = isHovered ? 1.6 : 1.2;
  const effectiveSparkHeight = sparkSize * spacingMultiplier;
  
  // Generate all sparks with their positions
  const sparks = [];
  let sparkIndex = 0;
  
  const maxBarHeight = Math.max(...barHeights);
  
  barHeights.forEach((height, barIndex) => {
    for (let i = 0; i < height; i++) {
      sparks.push({
        id: `${barIndex}-${i}`,
        barIndex,
        positionInBar: i,
        x: barIndex * (barWidth + barGap),
        // Final Y position (bottom-up stacking, affected by spacing)
        baseY: (maxBarHeight - 1 - i),
        delay: sparkIndex * 0.08 + Math.random() * 0.05,
      });
      sparkIndex++;
    }
  });

  const maxHeight = maxBarHeight * sparkSize * 1.6; // Account for expanded state
  const totalWidth = 5 * (barWidth + barGap) - barGap;

  return (
    <div 
      className="relative cursor-pointer"
      style={{ 
        width: totalWidth, 
        height: maxHeight,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {sparks.map((spark) => {
        const finalY = spark.baseY * effectiveSparkHeight + (maxHeight - maxBarHeight * effectiveSparkHeight);
        
        return (
          <div
            key={spark.id}
            className="absolute"
            style={{
              left: spark.x,
              top: animationStarted ? finalY : -50,
              opacity: animationStarted ? 1 : 0,
              transform: animationStarted ? 'rotate(0deg)' : 'rotate(-180deg)',
              transition: animationStarted 
                ? `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)` 
                : `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${spark.delay}s`,
            }}
          >
            <Spark style={{ width: sparkSize, height: sparkSize }} />
          </div>
        );
      })}
    </div>
  );
}

// Home state when no chart is selected
function HomeState() {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="flex items-end gap-12">
        {/* Left side - text content */}
        <div>
          <div className="flex items-center gap-3 mb-8 overflow-visible">
            <span className="text-xs text-gray-500">a tool from</span>
            <CohereLogo className="w-32 overflow-visible" />
          </div>
          <h1 className="text-6xl font-medium tracking-tight mb-8">co/plot</h1>
          <p className="text-sm text-gray-600 mb-2">
            Preview chart styles → adjust your parameters →
          </p>
          <p className="text-sm text-gray-600 mb-8">
            copy and paste styles code
          </p>
          <p className="text-sm">Choose a plot type to get started.</p>
        </div>
        
        {/* Right side - animated bar chart */}
        <SparkBarChart />
      </div>
    </div>
  );
}

export default App;
