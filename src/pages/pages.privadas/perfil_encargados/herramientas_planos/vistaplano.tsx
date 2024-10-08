import { useState, useEffect } from 'react';
import Canvas from './Canvas';
import Toolbar from './Toolbar';

interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

const LOCAL_STORAGE_KEY = 'puestos';

function Vista() {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [planWidth, setPlanWidth] = useState<number>(600);
  const [planHeight, setPlanHeight] = useState<number>(400);

  const handleAddRectangle = () => {
    const newRectangle: Rectangle = {
      x: 60,
      y: 60,
      width: 100,
      height: 100,
      fill: 'green',
      id: Date.now(),
    };
    setRectangles((prev) => {
      const updated = [...prev, newRectangle];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated)); 
      return updated;
    });
  };

  const handleRemoveRectangle = (id: number) => {
    const updatedRectangles = rectangles.filter(rect => rect.id !== id);
    setRectangles(updatedRectangles);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedRectangles));
  };

  useEffect(() => {
    const storedRectangles = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedRectangles) {
      setRectangles(JSON.parse(storedRectangles));
    }
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>Ferias Chile</h1>
      </header>

      <div className="main-content">
        <Toolbar onAddRectangle={handleAddRectangle} />
        <Canvas
          rectangles={rectangles}
          setRectangles={setRectangles}
          onRemoveRectangle={handleRemoveRectangle}
          planWidth={planWidth}
          planHeight={planHeight}
          setPlanWidth={setPlanWidth}  
          setPlanHeight={setPlanHeight} 
        />
      </div>
    </div>
  );
}

export default Vista;