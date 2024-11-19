import { useState, useEffect } from 'react';
import '../../../../../css/base.css';
import './filtros.css';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    Promise.all([
      import('../../../../../assets/regiones.json').then((data) =>
        setRegiones(
          data.default.map((region: { id_region: number; region: string }) => ({
            id: region.id_region,
            nombre: region.region,
          }))
        )
      ),
      import('../../../../../assets/comunas.json').then((data) =>
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      const halfPage = document.documentElement.scrollHeight / 4.5;

      setIsFixed(scrollPosition >= halfPage);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegionClick = (regionId: number) => {
    setSelectedRegion(regionId);
    onFilterR(regionId);
    setSelectedComuna(null);
    setSearchTerm('');
    onFilterC(null);
  };

  const handleComunaClick = (comunaId: number | null) => {
    setSelectedComuna(comunaId);
    onFilterC(comunaId);
  };

  return (
    <div className={`filtros-base ${isFixed ? 'fixed' : ''}`}>
      <div className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </div>

      <div className={`region-container ${isMenuOpen ? 'active' : ''}`}>
        {regiones.map((region) => (
          <button
            key={region.id}
            onClick={() => handleRegionClick(region.id)}
            className={`region-btn ${selectedRegion === region.id ? 'selected' : ''}`}
          >
            {region.nombre}
            {selectedRegion === region.id && <span className="checkmark">✔</span>}
          </button>
        ))}
      </div>

      {selectedRegion && (
        <div className={`comuna-container ${isMenuOpen ? 'active' : ''}`}>
          <label className="comuna-label">Selecciona una Comuna:</label>
          <input
            type="text"
            placeholder="Buscar comuna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="comuna-buttons">
            <button
              onClick={() => handleComunaClick(null)}
              className={`comuna-btn ${selectedComuna === null ? 'selected' : ''}`}
            >
              Todas las Comunas
            </button>
            {comunas
              .filter(
                (comuna) =>
                  comuna.regionId === selectedRegion &&
                  comuna.nombre.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((comuna) => (
                <button
                  key={comuna.id}
                  onClick={() => handleComunaClick(comuna.id)}
                  className={`comuna-btn ${selectedComuna === comuna.id ? 'selected' : ''}`}
                >
                  {comuna.nombre}
                  {selectedComuna === comuna.id && <span className="checkmark">✔</span>}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
