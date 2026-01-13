import React from 'react';

function Sidebar({ chartTypes, selectedChartId, onChartSelect, onGoHome }) {
  // Define which charts are implemented
  const implementedCharts = [
    'vertical-bar',
    'horizontal-bar',
    'stacked-bar',
    'grouped-bar',
    'line-chart',
    'scatter-plot',
    'histogram',
    'box-plot'
  ];

  const isImplemented = (chartId) => implementedCharts.includes(chartId);

  return (
    <div className="w-48 border-r border-black flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Logo - clickable to go home */}
      <div className="h-14 px-4 border-b border-black flex items-center">
        <button 
          onClick={onGoHome}
          className="text-lg font-medium tracking-tight hover:opacity-70 transition-opacity"
        >
          co/plot
        </button>
      </div>

      {/* Chart list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
          Charts
        </div>
        
        <nav className="space-y-1">
          {chartTypes.map((chart) => {
            const implemented = isImplemented(chart.id);
            const isSelected = selectedChartId === chart.id;
            
            return (
              <button
                key={chart.id}
                onClick={() => implemented && onChartSelect(chart.id)}
                disabled={!implemented}
                className={`
                  w-full text-left text-sm py-1 flex items-start gap-2
                  ${implemented ? 'cursor-pointer hover:bg-gray-100' : 'cursor-not-allowed opacity-40'}
                  ${isSelected ? 'font-medium' : ''}
                `}
              >
                <span className="font-mono text-xs flex-shrink-0 w-6">
                  [{isSelected ? 'x' : '\u00A0'}]
                </span>
                <span className="leading-tight">{chart.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
