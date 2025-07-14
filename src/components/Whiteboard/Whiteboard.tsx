import React, { useState, useRef, useEffect } from 'react';
import { Palette, Eraser, Download, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useStickyNotes } from '../../hooks/useStickyNotes';
import { DrawingPath, WhiteboardState } from '../../types';
import { StickyNoteItem } from '../StickyNotes/StickyNoteItem';
import { FloatingActionButton } from '../UI/FloatingActionButton';
import { ComponentPalette } from '../UI/ComponentPalette';
import { DraggableComponent } from '../UI/DraggableComponent';

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
  const whiteboardNotes = allNotes.filter(note => whiteboardState.notes.some(wNote => wNote.id === note.id));

  const [droppedComponents, setDroppedComponents] = useState<
    { id: string; type: string; position: { x: number; y: number } }[]
  >([]);

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPath = [...currentPath, { x, y }];
    setCurrentPath(newPath);

    const ctx = canvasRef.current!.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : brushColor;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (newPath.length >= 2) {
      const last = newPath[newPath.length - 2];
      const curr = newPath[newPath.length - 1];
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(curr.x, curr.y);
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
      setWhiteboardState(prev => ({ ...prev, paths: [...prev.paths, newPath] }));
    }
    setCurrentPath([]);
  };

  const clearCanvas = () => {
    setWhiteboardState(prev => ({ ...prev, paths: [] }));
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
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      size: { width: 200, height: 150 },
    };
    const note = addNote(newNote);
    setWhiteboardState(prev => ({ ...prev, notes: [...prev.notes, { id: note.id, x: newNote.position.x, y: newNote.position.y }] }));
  };

  const handleNoteDelete = (noteId: string) => {
    deleteNote(noteId);
    setWhiteboardState(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== noteId) }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('component/type');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDroppedComponents(prev => [...prev, { id: crypto.randomUUID(), type, position: { x, y } }]);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="relative h-screen overflow-hidden bg-white dark:bg-gray-900" onDrop={handleDrop} onDragOver={handleDragOver}>
      {/* Tools */}
      <div className="absolute top-4 left-4 z-30 space-y-4">
        <ComponentPalette />
        <div className="bg-white p-4 rounded-lg shadow-lg space-y-4">
          <div className="flex space-x-2">
            <button onClick={() => setTool('brush')} className={`p-2 rounded-lg ${tool === 'brush' ? 'bg-indigo-200' : 'bg-gray-100'}`}><Palette /></button>
            <button onClick={() => setTool('eraser')} className={`p-2 rounded-lg ${tool === 'eraser' ? 'bg-indigo-200' : 'bg-gray-100'}`}><Eraser /></button>
          </div>
          {tool === 'brush' && (
            <div className="grid grid-cols-5 gap-2">
              {colors.map(color => (
                <button key={color} onClick={() => setBrushColor(color)} className="w-6 h-6 rounded border" style={{ backgroundColor: color }} />
              ))}
            </div>
          )}
          <input type="range" min={1} max={20} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
          <button onClick={clearCanvas} className="w-full text-red-600">Clear</button>
          <button onClick={downloadCanvas} className="w-full text-gray-600">Download</button>
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
        <StickyNoteItem key={note.id} note={note} onUpdate={updateNote} onDelete={handleNoteDelete} />
      ))}

      {/* Dropped Components */}
      {droppedComponents.map((comp) => (
        <DraggableComponent key={comp.id} type={comp.type} position={comp.position} />
      ))}

      <FloatingActionButton onClick={addNoteToWhiteboard} />
    </div>
  );
}