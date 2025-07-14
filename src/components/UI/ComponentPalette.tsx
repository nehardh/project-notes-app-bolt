// components/Whiteboard/ComponentPalette.tsx
import React from 'react';

const COMPONENTS = [
  { type: 'Database', label: 'DB', color: '#FDE68A' },
  { type: 'Server', label: 'SRV', color: '#BFDBFE' },
  { type: 'Compiler', label: 'CMP', color: '#C4B5FD' },
  { type: 'Rectangle', label: 'Rect', color: '#FCA5A5' },
  { type: 'Circle', label: 'Circle', color: '#6EE7B7' }
];

export function ComponentPalette() {
  return (
    <div className="p-3 bg-white shadow rounded-lg space-y-2">
      <h3 className="font-bold text-sm">Components</h3>
      {COMPONENTS.map((comp) => (
        <div
          key={comp.type}
          draggable
          onDragStart={(e) => e.dataTransfer.setData('component/type', comp.type)}
          className="cursor-grab text-center px-3 py-1 text-xs font-medium text-black rounded shadow"
          style={{ backgroundColor: comp.color }}
        >
          {comp.label}
        </div>
      ))}
    </div>
  );
}
