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
  }, [selectedChartId]);

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

  // Generate code
  const generatedCode = selectedChart ? selectedChart.generateCode(config) : '';

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
      {selectedChart ? (
        <ControlsPanel 
          chartType={selectedChart}
          config={config}
          onChange={handleConfigChange}
        />
      ) : (
        <div className="w-64 border-r border-black flex-shrink-0" />
      )}

      {/* Right column - Preview and Code */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {selectedChart ? (
          <>
            <PreviewPanel 
              chartType={selectedChart}
              config={config}
            />
            <CodePanel code={generatedCode} />
          </>
        ) : (
          <HomeState />
        )}
      </div>
    </div>
  );
}

// Home state when no chart is selected
function HomeState() {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center">
        <h1 className="text-6xl font-medium tracking-tight mb-8">co/plot</h1>
        <p className="text-sm text-gray-600 mb-2">
          Preview chart styles â†’ adjust your parameters â†’
        </p>
        <p className="text-sm text-gray-600 mb-8">
          copy and paste styles code
        </p>
        <p className="text-sm">Choose a plot type to get started.</p>
      </div>
    </div>
  );
}

export default App;
