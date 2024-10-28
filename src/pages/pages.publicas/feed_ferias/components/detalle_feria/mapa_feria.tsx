import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Canvas from '../../../../pages.privadas/perfil_encargado/components/herramientas_planos/Canvas';

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
  planWidth: number; 
  planHeight: number; 
}

const API_URL = 'http://localhost:5000';

export const Mapa = () => {  
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [planWidth, setPlanWidth] = useState<number>(600);
  const [planHeight, setPlanHeight] = useState<number>(400);
  const [areas, setAreas] = useState<Area[]>([]);
  const [streets, setStreets] = useState<Street[]>([]);
  const { id_feria } = useParams<{ id_feria: string }>();

  const fetchFeriaData = async () => {
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
    }
  };

  useEffect(() => {
    fetchFeriaData();
  }, [id_feria]);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Mapa de Feria</h1>
      </header>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
        <div 
          style={{ flex: 1, padding: '10px' }} 
          onClick={handleClick} 
        >
          <Canvas
            rectangles={rectangles}
            planWidth={planWidth}
            planHeight={planHeight}
            areas={areas}
            streets={streets}
            setRectangles={() => {}}
            setPlanWidth={() => {}}
            setPlanHeight={() => {}}
            onRectangleClick={() => {}} 
            onRemoveArea={() => {}}
            onUpdateArea={() => {}}
            onUpdateStreet={() => {}}
            onRemoveStreet={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Mapa;
