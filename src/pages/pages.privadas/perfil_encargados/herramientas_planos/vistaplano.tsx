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

interface Area {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Street {
  id: number;
  points: number[];
  width: number;
}

const LOCAL_STORAGE_KEY = 'puestos';

function Vista() {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [planWidth, setPlanWidth] = useState<number>(600);
  const [planHeight, setPlanHeight] = useState<number>(400);

  const [areas, setAreas] = useState<Area[]>([]);
  const [streets, setStreets] = useState<Street[]>([]);


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

  const handleAddArea = () => {
    const newArea: Area = {
      id: Date.now(),
      name: `Área ${areas.length + 1}`,
      x: 200,
      y: 200,
      width: 150,
      height: 150,
    };
    setAreas([...areas, newArea]);
  };

  const handleAddStreet = () => {
    const newStreet: Street = {
      id: Date.now(),
      points: [300, 300, 500, 300],
      width: 5,
    };
    setStreets([...streets, newStreet]);
  };

  const handleRemoveArea = (id: number) => {
    setAreas(areas.filter(area => area.id !== id));
  };

  const handleUpdateArea = (id: number, updatedProps: Partial<Area>) => {
    setAreas(areas.map(area => (area.id === id ? { ...area, ...updatedProps } : area)));
  };

  const handleUpdateStreet = (id: number, updatedProps: Partial<Street>) => {
    setStreets(streets.map(street => (street.id === id ? { ...street, ...updatedProps } : street)));
  };

  const handleRemoveStreet = (id: number) => {
    setStreets(streets.filter(street => street.id !== id));
  };

  

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
          areas={areas}
          onRemoveArea={handleRemoveArea}
          streets={streets}
          onUpdateArea={handleUpdateArea}
          onAddStreet={handleAddStreet}
          onRemoveStreet={handleRemoveStreet}
          onUpdateStreet={handleUpdateStreet}
        />
      </div>
    </div>
  );
}

export default Vista;