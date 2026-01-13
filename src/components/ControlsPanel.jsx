import React from 'react';

function ControlsPanel({ chartType, config, onChange }) {
  return (
    <div className="w-64 border-r border-black flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Header - same height as sidebar header */}
      <div className="h-14 px-4 border-b border-black flex items-center">
        <h2 className="text-sm font-medium">{chartType.name}</h2>
      </div>

      {/* Scrollable controls */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {chartType.controls.map((control) => (
            <ControlRenderer 
              key={control.key}
              control={control}
              value={config[control.key]}
              config={config}
              onChange={onChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlRenderer({ control, value, config, onChange }) {
  switch (control.type) {
    case 'toggle':
      return (
        <label className="flex items-center gap-3 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(control.key, e.target.checked)}
          />
          <span>{control.label}</span>
        </label>
      );

    case 'text':
      return (
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {control.label}
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(control.key, e.target.value)}
            placeholder={control.placeholder || ''}
          />
        </div>
      );

    case 'slider':
      return (
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {control.label}: {value}{control.unit || ''}
          </label>
          <input
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={value || control.min}
            onChange={(e) => onChange(control.key, Number(e.target.value))}
          />
        </div>
      );

    case 'select':
      return (
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {control.label}
          </label>
          <select
            value={value || ''}
            onChange={(e) => onChange(control.key, e.target.value)}
          >
            {control.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'color':
      return (
        <div>
          <label className="block text-xs text-gray-500 mb-2">
            {control.label}
          </label>
          <div className="flex flex-wrap gap-2">
            {control.options.map((color) => (
              <button
                key={color}
                onClick={() => onChange(control.key, color)}
                className={`
                  w-6 h-6 border-2 
                  ${value === color ? 'border-black' : 'border-gray-300'}
                `}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      );

    case 'paletteGroup':
      return (
        <div>
          <label className="block text-xs text-gray-500 mb-2">
            {control.label}
          </label>
          <div className="space-y-2">
            {control.options.map((option) => (
              <label key={option.key} className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={config[option.key] || false}
                  onChange={(e) => onChange(option.key, e.target.checked)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default ControlsPanel;
