import { useState } from 'react';
import Feed_d_ferias from './components/listado_ferias/carga_feria';
import { Filtros_base } from './components/listado_ferias/filtros';
import '../../../css/base.css';

const View_feed = () => {
  const [selectedComuna, setSelectedComuna] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
    console.log('idcomuna',selectedComuna, 'idregion',selectedRegion );
    
  return (
    <div className="container">
      <Filtros_base onFilterC={(comuna) => setSelectedComuna(comuna)} onFilterR={(region) => setSelectedRegion(region)} />
      <Feed_d_ferias comuna={selectedComuna}  region={selectedRegion} />
    </div>
  );
};

export default View_feed;