/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import MenuDerecha from './MenuDerecha';
import { setIdFeria } from '../../../../../redux/states/user';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  descripcion?: string; 
  tipoPuesto?: string;   
  estadoPuesto?: string; 
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

interface FeriaData {
  puestos: Rectangle[];
  areas: Area[];
  calles: Street[];
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
  const { id_feria } = useParams<{ id_feria: string }>();
  const [selectedRectangleId, setSelectedRectangleId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedPuesto, setSelectedPuesto] = useState<Rectangle | null>(null); 

  const fetchFeriaData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/feria/${id_feria}`);
      const data: FeriaData = response.data;
      
      setRectangles(data.puestos);
      setAreas(data.areas);
      setStreets(data.calles);
    } catch (error) {
      console.error('Error al obtener los datos de la feria:', error);
      setError('Error al obtener los datos de la feria');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeriaData();
  }, []);

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
    setIsMenuOpen(false);
  };

  const handleRectangleClick = (id: number) => {
    const clickedRectangle = rectangles.find((rect) => rect.id === id);
    setSelectedRectangleId(id);
    setSelectedPuesto(clickedRectangle || null); 
    setIsMenuOpen(true);
  };

  const handleSavePuesto = (updatedPuesto: Partial<Rectangle>) => {
    if (selectedPuesto) {
        setRectangles(prev =>
            prev.map(rect => (rect.id === selectedRectangleId ? { ...rect, ...updatedPuesto } : rect))
        );
        setIsMenuOpen(false);
    }
};

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

  const handleSaveFeria = async () => {
    const feriaData = {
      puestos: rectangles,
      areas: areas,
      calles: streets,
      id_feria: id_feria,
    };

    try {
      const response = await fetch(`${API_URL}/api/feria`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feriaData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error('Error al guardar la feria: ' + result.error);
      }

      const feriaId = result.id_feria;
      console.log('Feria guardada con ID:', feriaId);

      dispatch(setIdFeria(feriaId)); // Usar la acción para establecer el id_feria en el estado de Redux

      alert('Feria guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la feria:', error);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Ferias Chile</h1>
      </header>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
        <div style={{ flex: 1, padding: '10px' }}>
          {isLoading && <p>Cargando...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Toolbar onAddRectangle={handleAddRectangle} onAddArea={handleAddArea} onAddStreet={handleAddStreet} />
          <Canvas
            rectangles={rectangles}
            setRectangles={setRectangles}
            onRectangleClick={handleRectangleClick}
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
          <button onClick={handleSaveFeria} disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar Feria JSON'}
          </button>
        </div>
        {isMenuOpen && (
          <MenuDerecha
            selectedPuesto={selectedPuesto} 
            onSavePuesto={handleSavePuesto} 
            onRemoveRectangle={handleRemoveRectangle}
            onClose={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Vista;
function dispatch(_arg0: { payload: any; type: "user/setIdFeria"; }) {
  throw new Error('Function not implemented.');
}