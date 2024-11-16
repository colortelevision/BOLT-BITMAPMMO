import React, { useRef, useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { Eraser, Paintbrush, Save } from 'lucide-react';

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#C0C0C0',
  '#800000', '#808000', '#008000', '#800080', '#008080',
  '#000080', '#FFA500', '#A52A2A', '#FFC0CB', '#90EE90'
];

export const SpriteEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [isDrawing, setIsDrawing] = useState(false);
  const { addSprite } = useCanvasContext();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 16, 16);
  }, []);

  const drawPixel = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixelX = Math.floor(x / (canvas.clientWidth / 16));
    const pixelY = Math.floor(y / (canvas.clientHeight / 16));

    ctx.fillStyle = tool === 'eraser' ? '#FFFFFF' : selectedColor;
    ctx.fillRect(pixelX, pixelY, 1, 1);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawPixel(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawPixel(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, 16, 16);
    addSprite({
      x: 0,
      y: 0,
      imageData,
      text: 'New Sprite'
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Sprite Editor</h2>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <canvas
            ref={canvasRef}
            width={16}
            height={16}
            className="border border-gray-300 w-64 h-64 image-rendering-pixelated cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setTool('brush')}
              className={`p-2 rounded ${tool === 'brush' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              title="Brush Tool"
            >
              <Paintbrush className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              title="Eraser Tool"
            >
              <Eraser className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              className="p-2 rounded hover:bg-gray-100"
              title="Save Sprite"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded ${
                selectedColor === color ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};