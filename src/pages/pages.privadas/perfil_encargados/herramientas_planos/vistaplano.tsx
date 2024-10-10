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

const API_URL = 'http://localhost:5000'; // Cambia a la URL de tu servidor

const Vista = () => {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [planWidth, setPlanWidth] = useState<number>(600);
  const [planHeight, setPlanHeight] = useState<number>(400);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    setRectangles((prev) => [...prev, newRectangle]);
  };

  const handleRemoveRectangle = (id: number) => {
    setRectangles((prev) => prev.filter(rect => rect.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [rectanglesRes, planRes] = await Promise.all([
          fetch(`${API_URL}/puestos`),
          fetch(`${API_URL}/plano`)
        ]);
        if (!rectanglesRes.ok || !planRes.ok) {
          throw new Error('Error al obtener los datos');
        }
        const rectanglesData = await rectanglesRes.json();
        const planData = await planRes.json();
        setRectangles(rectanglesData);
        setPlanWidth(planData.width);
        setPlanHeight(planData.height);
      } catch (error) {
        console.error('Error al cargar los datos', error);
        setError('Error al cargar los datos del servidor');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
  

  const saveData = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Datos a guardar:', { rectangles, planWidth, planHeight, areas, streets }); // Para depuración
    try {
      const response = await fetch(`${API_URL}/puestos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rectangles, planWidth, planHeight, areas, streets }),
      });
      if (!response.ok) {
        throw new Error('Error al guardar los datos');
      }
      console.log('Datos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      setError('Error al guardar los datos en la base de datos');
    } finally {
      setIsLoading(false);
    }
  };  
  

  return (
    <div className="App">
      <header className="header">
        <h1>Ferias Chile</h1>
      </header>

      <div className="main-content">
        {isLoading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Toolbar onAddRectangle={handleAddRectangle} onAddArea={handleAddArea} onAddStreet={handleAddStreet} />
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
          onUpdateStreet={handleUpdateStreet}
          onRemoveStreet={handleRemoveStreet}
        />
        <button onClick={saveData} disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar en la base de datos'}
        </button>
      </div>
    </div>
  );
};


export default Vista;