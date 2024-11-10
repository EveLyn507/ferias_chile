import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MapaFeriaProps {
  id_feria: number | null; // Acepta null para manejar posibles valores faltantes
}

const MapaFeria: React.FC<MapaFeriaProps> = ({ id_feria }) => {
  const [mapaUrl, setMapaUrl] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_feria || isNaN(id_feria)) {
      setError('ID de feria no válido');
      setCargando(false);
      return;
    }

    const fetchMapa = async () => {
      try {
        setCargando(true);
        const response = await axios.get('http://localhost:5000/api/supervisor/feria/mapa', {
          params: { id_feria },
        });
        
        if (response.data && response.data.url) {
          setMapaUrl(response.data.url);
          setError(null);
        } else {
          setError('No se encontró el mapa para la feria solicitada');
        }
      } catch (error) {
        console.error('Error al cargar el mapa de la feria:', error);
        setError('Error al cargar el mapa de la feria');
      } finally {
        setCargando(false);
      }
    };

    fetchMapa();
  }, [id_feria]);

  return (
    <div>
      <h2>Mapa de la Feria</h2>
      {cargando ? (
        <p>Cargando el mapa...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        mapaUrl && <img src={mapaUrl} alt="Mapa de la feria" style={{ width: '100%' }} />
      )}
    </div>
  );
};

export default MapaFeria;
