import React from 'react';

function MobileGate() {
  return (
    <div className="h-screen flex items-center justify-center p-8 bg-white">
      <div className="text-center max-w-sm">
        <h1 className="text-4xl font-medium tracking-tight mb-6">co/plot</h1>
        <p className="text-sm text-gray-600 mb-4">
          This tool is designed for desktop use.
        </p>
        <p className="text-sm">
          Please expand your window or visit on a larger screen.
        </p>
        <div className="mt-8 text-xs text-gray-400">
          Minimum width: 1024px
        </div>
      </div>
    </div>
  );
}

export default MobileGate;
