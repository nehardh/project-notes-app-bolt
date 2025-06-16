import React, { useState, useRef, useEffect } from 'react';
import { Palette, Eraser, Download, Trash2, Plus } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useStickyNotes } from '../../hooks/useStickyNotes';
import { DrawingPath, WhiteboardState } from '../../types';
import { StickyNoteItem } from '../StickyNotes/StickyNoteItem';
import { FloatingActionButton } from '../UI/FloatingActionButton';

export function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  
  const [whiteboardState, setWhiteboardState] = useLocalStorage<WhiteboardState>('whiteboard', {
    paths: [],
    notes: []
  });

  const { notes: allNotes, addNote, updateNote, deleteNote } = useStickyNotes();
  
  // Filter notes that are on the whiteboard
  const whiteboardNotes = allNotes.filter(note => 
    whiteboardState.notes.some(wNote => wNote.id === note.id)
  );

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  useEffect(() => {
    redrawCanvas();
  }, [whiteboardState.paths]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all paths
    whiteboardState.paths.forEach(path => {
      if (path.points.length < 2) return;

      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      
      ctx.stroke();
    });
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPath = [...currentPath, { x, y }];
    setCurrentPath(newPath);

    // Draw current stroke
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : brushColor;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (newPath.length >= 2) {
      const lastPoint = newPath[newPath.length - 2];
      const currentPoint = newPath[newPath.length - 1];
      
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    if (currentPath.length > 1) {
      const newPath: DrawingPath = {
        id: crypto.randomUUID(),
        points: currentPath,
        color: tool === 'eraser' ? '#FFFFFF' : brushColor,
        width: tool === 'eraser' ? brushSize * 3 : brushSize,
      };

      setWhiteboardState(prev => ({
        ...prev,
        paths: [...prev.paths, newPath]
      }));
    }

    setCurrentPath([]);
  };

  const clearCanvas = () => {
    setWhiteboardState(prev => ({
      ...prev,
      paths: []
    }));
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const addNoteToWhiteboard = () => {
    const newNote = {
      content: '',
      color: '#FEF3C7',
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100
      },
      size: { width: 200, height: 150 },
    };
    
    const note = addNote(newNote);
    setWhiteboardState(prev => ({
      ...prev,
      notes: [...prev.notes, { id: note.id, x: newNote.position.x, y: newNote.position.y }]
    }));
  };

  const handleNoteDelete = (noteId: string) => {
    deleteNote(noteId);
    setWhiteboardState(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== noteId)
    }));
  };

  return (
    <div className="relative h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-4">
        {/* Tools */}
        <div className="flex space-x-2">
          <button
            onClick={() => setTool('brush')}
            className={`p-2 rounded-lg transition-colors ${
              tool === 'brush' 
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Palette className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-colors ${
              tool === 'eraser' 
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Eraser className="w-5 h-5" />
          </button>
        </div>

        {/* Colors */}
        {tool === 'brush' && (
          <div className="grid grid-cols-5 gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setBrushColor(color)}
                className={`w-6 h-6 rounded border-2 ${
                  brushColor === color ? 'border-gray-400' : 'border-gray-200 dark:border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {/* Brush size */}
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            {tool === 'brush' ? 'Brush' : 'Eraser'} Size
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
            {brushSize}px
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={clearCanvas}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
          <button
            onClick={downloadCanvas}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      {/* Sticky Notes */}
      {whiteboardNotes.map((note) => (
        <StickyNoteItem
          key={note.id}
          note={note}
          onUpdate={updateNote}
          onDelete={handleNoteDelete}
        />
      ))}

      <FloatingActionButton onClick={addNoteToWhiteboard} />
    </div>
  );
}