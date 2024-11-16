import React from 'react';
import { Canvas } from './components/Canvas';
import { SpriteEditor } from './components/SpriteEditor';
import { CanvasProvider } from './contexts/CanvasContext';
import { Palette } from 'lucide-react';

function App() {
  return (
    <CanvasProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Palette className="w-8 h-8 text-blue-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Pixel Art Map</h1>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
            <div className="bg-white p-4 rounded-lg shadow-lg min-h-[600px]">
              <Canvas />
            </div>
            <div className="space-y-6">
              <SpriteEditor />
            </div>
          </div>
        </main>
      </div>
    </CanvasProvider>
  );
}

export default App;