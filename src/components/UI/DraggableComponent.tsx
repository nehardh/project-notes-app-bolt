// components/Whiteboard/DraggableComponent.tsx
import React from 'react';

interface DraggableComponentProps {
  type: string;
  position: { x: number; y: number };
}

export function DraggableComponent({ type, position }: DraggableComponentProps) {
  const COLORS: Record<string, string> = {
    Database: '#FDE68A',
    Server: '#BFDBFE',
    Compiler: '#C4B5FD',
    Rectangle: '#FCA5A5',
    Circle: '#6EE7B7',
  };

  return (
    <div
      className="absolute px-4 py-2 text-xs font-semibold text-black border rounded shadow"
      style={{
        left: position.x,
        top: position.y,
        backgroundColor: COLORS[type] || '#E5E7EB',
      }}
    >
      {type}
    </div>
  );
}
