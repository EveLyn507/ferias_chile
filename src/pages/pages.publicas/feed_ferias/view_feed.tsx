import Feed_d_ferias from './lista_ferias/carga_feria';

import '../../../css/base.css';
import { Filtros_base } from './lista_ferias/filtros';

const View_feed  = () => {
  return (
    <>

      <div className="container">
        <Filtros_base />
        <Feed_d_ferias />
      </div>
    </>
  );
};

export default View_feed;
