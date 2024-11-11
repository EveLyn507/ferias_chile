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
  onFilterC: (comuna: number | null) => void;
  onFilterR: (region: number | null) => void;
}

export const Filtros_base = ({ onFilterC, onFilterR }: FiltrosBaseProps) => {
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedComuna, setSelectedComuna] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  useEffect(() => {
    // Carga ambos JSON dinámicamente y transforma los datos
    Promise.all([
      import('../../../../../assets/regiones.json')
        .then((data) =>
          setRegiones(
            data.default.map((region: { id_region: number; region: string }) => ({
              id: region.id_region,
              nombre: region.region,
            }))
          )
        ),
      import('../../../../../assets/comunas.json')
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

  const handleRegionClick = (regionId: number , ) => {
    setSelectedRegion(regionId);
    onFilterR(regionId)
    setSelectedComuna(null);
    setSearchTerm(''); // Reseteamos el término de búsqueda al cambiar de región
    onFilterC(null);
  };

  const handleComunaClick = (comunaId: number | null) => {
    setSelectedComuna(comunaId);
    onFilterC(comunaId);
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

          <input
            type="text"
            placeholder="Buscar comuna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '2px solid #007bff',
              fontSize: '16px',
              color: '#333',
              marginBottom: '10px',
            }}
          />
     

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => handleComunaClick(null)}
              style={{
                padding: '10px 15px',
                borderRadius: '6px',
                border: '2px solid #007bff',
                backgroundColor: selectedComuna === null ? '#007bff' : '#f8f9fa',
                color: selectedComuna === null ? '#fff' : '#007bff',
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
              Todas las Comunas
            </button>
            {comunas
              .filter((comuna) =>
                comuna.regionId === selectedRegion &&
                comuna.nombre.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((comuna) => (
                <button
                  key={comuna.id}
                  onClick={() => handleComunaClick(comuna.id)}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '6px',
                    border: '2px solid #007bff',
                    backgroundColor: selectedComuna === comuna.id ? '#007bff' : '#f8f9fa',
                    color: selectedComuna === comuna.id ? '#fff' : '#007bff',
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
                  {comuna.nombre}
                  {selectedComuna === comuna.id && (
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
        </div>
      )}
    </div>
  );
};
