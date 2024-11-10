import { useState, useEffect } from 'react';

// Interfaces para tipar los datos
interface Region {
  id: number;
  nombre: string;
}

interface Comuna {
  id: number;
  regionId: number;
  nombre: string;
}

interface FiltrosBaseProps {
  onFilter: (comuna: string) => void;
}

export const Filtros_base = ({ onFilter }: FiltrosBaseProps) => {
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedComuna, setSelectedComuna] = useState('');

  useEffect(() => {
    // Carga ambos JSON dinámicamente y transforma los datos
    Promise.all([
      import('../../../../pages.privadas/perfil_encargado/components/formulario/regiones.json')
        .then((data) =>
          setRegiones(
            data.default.map((region: { id_region: number; region: string }) => ({
              id: region.id_region,
              nombre: region.region,
            }))
          )
        ),
      import('../../../../pages.privadas/perfil_encargado/components/formulario/comunas.json')
        .then((data) =>
          setComunas(
            data.default.map((comuna: { id_comuna: number; id_region: number; comuna: string }) => ({
              id: comuna.id_comuna,
              regionId: comuna.id_region,
              nombre: comuna.comuna,
            }))
          )
        ),
    ]).catch((error) => console.error('Error al cargar los JSON:', error));
  }, []);

  const handleRegionClick = (regionId: number) => {
    setSelectedRegion(regionId);
    setSelectedComuna(''); // Reseteamos la comuna al seleccionar una nueva región
    onFilter(''); // Reseteamos el filtro al cambiar de región
  };

  const handleComunaChange = (comuna: string) => {
    setSelectedComuna(comuna);
    onFilter(comuna);
  };

  return (
    <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        {regiones.map((region) => (
          <button
            key={region.id}
            onClick={() => handleRegionClick(region.id)}
            style={{
              padding: '10px 15px',
              borderRadius: '6px',
              border: '2px solid #007bff',
              backgroundColor: selectedRegion === region.id ? '#007bff' : '#f8f9fa',
              color: selectedRegion === region.id ? '#fff' : '#007bff',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'left',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {region.nombre}
            {selectedRegion === region.id && (
              <span
                style={{
                  fontSize: '18px',
                  color: '#fff',
                }}
              >
                &#x2714;
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedRegion && (
        <div style={{ marginTop: '20px' }}>
          <label
            style={{
              fontWeight: 'bold',
              marginBottom: '10px',
              display: 'block',
              fontSize: '16px',
              color: '#007bff',
            }}
          >
            Selecciona una Comuna:
          </label>
          <select
            value={selectedComuna}
            onChange={(e) => handleComunaChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '2px solid #007bff',
              fontSize: '16px',
              color: '#333',
              fontWeight: 'bold',
              transition: 'border-color 0.3s ease',
            }}
          >
            <option value="">Todas las Comunas</option>
            {comunas
              .filter((comuna) => comuna.regionId === selectedRegion) // Filtra las comunas por la región seleccionada
              .map((comuna) => (
                <option key={comuna.id} value={comuna.nombre}>
                  {comuna.nombre}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
};
