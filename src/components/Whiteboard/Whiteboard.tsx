import React, { useRef, useEffect, useState } from 'react';
import { PenTool, Eraser, Square, Circle, Type, Download, Trash2, Undo, Redo } from 'lucide-react';

interface DrawingTool {
  type: 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text';
  color: string;
  size: number;
}

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<DrawingTool>({
    type: 'pen',
    color: '#000000',
    size: 2,
  });
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
  ];

  const sizes = [1, 2, 4, 8, 16];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Set default styles
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Save initial state
      saveState();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(imageData);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryStep(prev => Math.min(prev + 1, 49));
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setHistoryStep(prev => prev - 1);
      ctx.putImageData(history[historyStep - 1], 0, 0);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setHistoryStep(prev => prev + 1);
      ctx.putImageData(history[historyStep + 1], 0, 0);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool.type === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = tool.color;
      ctx.lineWidth = tool.size;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool.type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = tool.size * 2;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (confirm('Are you sure you want to clear the whiteboard?')) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Drawing Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTool(prev => ({ ...prev, type: 'pen' }))}
              className={`p-3 rounded-lg transition-colors ${
                tool.type === 'pen'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <PenTool className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTool(prev => ({ ...prev, type: 'eraser' }))}
              className={`p-3 rounded-lg transition-colors ${
                tool.type === 'eraser'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Eraser className="w-5 h-5" />
            </button>
          </div>

          {/* Colors */}
          <div className="flex items-center space-x-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setTool(prev => ({ ...prev, color }))}
                className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                  color === tool.color ? 'border-gray-900 dark:border-white' : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Brush Size */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Size:</span>
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setTool(prev => ({ ...prev, size }))}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center hover:scale-110 transition-transform ${
                  size === tool.size 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div 
                  className="rounded-full bg-gray-800 dark:bg-gray-200"
                  style={{ 
                    width: Math.min(size * 2, 16), 
                    height: Math.min(size * 2, 16) 
                  }}
                />
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={undo}
              disabled={historyStep <= 0}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyStep >= history.length - 1}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Redo className="w-5 h-5" />
            </button>
            <button
              onClick={downloadCanvas}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={clearCanvas}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-4">
        <div className="w-full h-full bg-white dark:bg-gray-100 rounded-lg shadow-sm overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Click and drag to draw • Use the eraser to remove parts • Download your creation when finished
          </p>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;