import { useState } from 'react';
import Feed_d_ferias from './components/listado_ferias/carga_feria';
import { Filtros_base } from './components/listado_ferias/filtros';
import '../../../css/base.css';

const View_feed = () => {
  const [selectedComuna, setSelectedComuna] = useState('');

  return (
    <div className="container">
      <Filtros_base onFilter={(comuna) => setSelectedComuna(comuna)} />
      <Feed_d_ferias selectedComuna={selectedComuna} />
    </div>
  );
};

export default View_feed;