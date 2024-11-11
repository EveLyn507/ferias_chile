import { useState, useEffect } from 'react';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import MenuDerecha from './MenuDerecha';
import { setIdFeria } from '../../../../../redux/states/user';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './plano.css';

export interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  descripcion?: string;
  tipoPuesto?: string;
  estadoPuesto?: string;
  numero?: number;
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
  height: number;
  x: number;
  y: number;
}

interface FeriaData {
  puestos: Rectangle[];
  areas: Area[];
  calles: Street[];
  planWidth: number;
  planHeight: number;
}

const API_URL = 'http://localhost:5000';

const Vista = () => {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  console.log(rectangles);
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
  const [totalPuestos, setTotalPuestos] = useState<number>(0);
  const dispatch = useDispatch();

  const fetchFeriaData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/feria/${id_feria}`);
      const data: FeriaData = response.data;
      setRectangles(data.puestos);
      setAreas(data.areas);
      setStreets(data.calles);
      setPlanWidth(data.planWidth);
      setPlanHeight(data.planHeight);
    } catch (error) {
      console.error('Error al obtener los datos de la feria:', error);
      setError('Error al obtener los datos de la feria');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeriaData();
  }, [id_feria]);

  useEffect(() => {
    const fetchTotalPuestos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/puestos/${id_feria}`);
        setTotalPuestos(response.data);
      } catch (error) {
        console.error('Error al obtener el total de puestos:', error);
      }
    };

    fetchTotalPuestos();
  }, []);

  const handleAddRectangle = async (totalPuestos: number) => {
    await setTotalPuestos(totalPuestos + 1);
    const newRectangle: Rectangle = {
      x: 60,
      y: 60,
      width: 100,
      height: 100,
      fill: 'green',
      id: Date.now(),
      numero: totalPuestos + 1,
    };
    setRectangles((prev) => [...prev, newRectangle]);
  };

  const handleRemoveRectangle = (id: number) => {
    setRectangles((prev) => prev.filter((rect) => rect.id !== id));
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
      setRectangles((prev) =>
        prev.map((rect) => (rect.id === selectedRectangleId ? { ...rect, ...updatedPuesto } : rect))
      );
      setIsMenuOpen(false);
    }
  };

  const handleAddStreet = () => {
    const newStreet: Street = {
      id: Date.now(),
      x: 60,
      y: 60,
      points: [0, 0, 100, 100],
      width: 50,
      height: 100,
    };
    setStreets((streets) => [...streets, newStreet]);
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

  const handleRemoveArea = (id: number) => {
    setAreas(areas.filter((area) => area.id !== id));
  };

  const handleUpdateArea = (id: number, updatedProps: Partial<Area>) => {
    setAreas(areas.map((area) => (area.id === id ? { ...area, ...updatedProps } : area)));
  };

  const handleUpdateStreet = (id: number, updatedProps: Partial<Street>) => {
    setStreets(streets.map((street) => (street.id === id ? { ...street, ...updatedProps } : street)));
  };

  const handleRemoveStreet = (id: number) => {
    setStreets(streets.filter((street) => street.id !== id));
  };

  const handleSaveFeria = async () => {
    const feriaData = {
      puestos: rectangles,
      areas: areas,
      calles: streets,
      id_feria: id_feria,
      planWidth: planWidth,
      planHeight: planHeight,
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

      dispatch(setIdFeria(feriaId));

      alert('Feria guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la feria:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Ferias Chile</h1>
      </header>

      <div className="main-content">
        <div className="canvas-container">
          {isLoading && <p>Cargando...</p>}
          <Toolbar
            onAddRectangle={() => handleAddRectangle(totalPuestos)}
            onAddArea={handleAddArea}
            onAddStreet={handleAddStreet}
          />
          {error && <p className="error">{error}</p>}
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
        </div>

        <div className="menu-derecha">
          {isMenuOpen && selectedPuesto && (
            <MenuDerecha
              selectedPuesto={selectedPuesto}
              onSavePuesto={handleSavePuesto}
              onRemoveRectangle={handleRemoveRectangle}
              onClose={() => setIsMenuOpen(false)}
              onSaveFeria={handleSaveFeria}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Vista;
