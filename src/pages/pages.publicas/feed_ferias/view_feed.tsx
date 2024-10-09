import Feed_d_ferias from './lista_ferias/base_feed_feria';
import { Nav_bar } from '../../../components';
import '../../../css/base.css';
import { Filtros_base } from './lista_ferias/filtros';

const View_feed  = () => {
  return (
    <>
      <Nav_bar />
      <div className="container">
        <Filtros_base />
        <Feed_d_ferias />
      </div>
    </>
  );
};

export default View_feed;
