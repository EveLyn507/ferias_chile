import Feed_d_ferias from './base_feed_feria'
import { Nav_bar } from '../nav_bar';
import { Filtros_base } from '../filtros';

export const View_feed = () => {
  return (
    <>

<Nav_bar/>

<div className="container">
<Filtros_base/>
<Feed_d_ferias/>
</div>

</>
  )
}
