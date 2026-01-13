import React from 'react';
import ChartPreview from './ChartPreview';

function PreviewPanel({ chartType, config }) {
  return (
    <div className="flex-1 border-b border-black bg-white overflow-auto flex items-center justify-center p-6">
      <ChartPreview chartType={chartType} config={config} />
    </div>
  );
}

export default PreviewPanel;
