import React, { useRef, useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { sprites, addSprite } = useCanvasContext();
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<Position>({ x: 0, y: 0 });
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState<'move' | 'place'>('place');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // Draw grid
    ctx.beginPath();
    ctx.strokeStyle = '#eee';
    for (let x = 0; x < 2048; x += 16) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 2048);
    }
    for (let y = 0; y < 2048; y += 16) {
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
    }
    ctx.stroke();

    // Draw sprites
    sprites.forEach(sprite => {
      if (sprite.imageData) {
        ctx.putImageData(sprite.imageData, sprite.x, sprite.y);
      }
    });

    ctx.restore();
  }, [sprites, offset, zoom]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === 'move') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && tool === 'move') {
      setOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-4 flex gap-2 bg-white p-2 rounded-lg shadow-md z-10">
        <button
          onClick={() => setTool('move')}
          className={`p-2 rounded ${tool === 'move' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          title="Pan Tool"
        >
          <Move className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleZoom('in')}
          className="p-2 rounded hover:bg-gray-100"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2 rounded hover:bg-gray-100"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={2048}
        height={2048}
        className="border border-gray-200"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};