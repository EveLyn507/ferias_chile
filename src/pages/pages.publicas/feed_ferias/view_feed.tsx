import Feed_d_ferias from './base_feed_feria';
import { Nav_bar } from '../../../components';
import { Filtros_base } from '../../../components/index';
import '../../../components/css/base.css';

const View_feed: React.FC = () => {
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
