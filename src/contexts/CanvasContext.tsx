import React, { createContext, useContext, useState } from 'react';

interface Sprite {
  x: number;
  y: number;
  imageData: ImageData;
  text: string;
}

interface CanvasContextType {
  sprites: Sprite[];
  addSprite: (sprite: Sprite) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sprites, setSprites] = useState<Sprite[]>([]);

  const addSprite = (sprite: Sprite) => {
    setSprites(prev => [...prev, sprite]);
  };

  return (
    <CanvasContext.Provider value={{ sprites, addSprite }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  return context;
};