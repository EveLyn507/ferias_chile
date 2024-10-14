import { useEffect, useState } from 'react';
import axios from 'axios';

interface Puesto {
  x: number;
  y: number;
  id: string;
  fill: string;
  width: number;
  height: number;
}

interface FeriaData {
  areas: any[]; 
  calles: any[]; 
  puestos: Puesto[];
}

export const Mapa = () => {
  const [feriaData, setFeriaData] = useState<FeriaData | null>(null); 

 
  const fetchFeriaData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/feria/1'); 
      setFeriaData(response.data); 
    } catch (error) {
      console.error('Error al obtener los datos de la feria:', error);
    }
  };

  useEffect(() => {
    fetchFeriaData(); 
  }, []);

  useEffect(() => {
    if (feriaData) {
      console.log('Datos de la feria:', feriaData);
    }
  }, [feriaData]); 

  return (
    <div>
      <h2>Aquí estaría el mapa</h2>
      {feriaData ? (
        <div>
          {/* Renderización de los puestos */}
          {feriaData.puestos.map((puesto) => (
            <div key={puesto.id}>
              <p>Puesto ID: {puesto.id}</p>
              <p>Coordenadas: ({puesto.x}, {puesto.y})</p>
              <p>Tamaño: {puesto.width} x {puesto.height}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Cargando mapa...</p>
      )}
    </div>
  );
};
