import { PrivateRoutes } from '../../models/index.ts';
import PerfilEn from './perfil_encargado';
import  {NotFound}  from '../../models/index.ts';
import { Navigate, Route } from 'react-router-dom';
import { Logout } from '../../components/index';

function PerfilL() {
    return (
     <>
      <Logout/>
     <NotFound>
     <Route path='/' element = {<Navigate to={PrivateRoutes.PERFILENCARGADO}/> } />
     <Route  path={PrivateRoutes.PERFILENCARGADO} element= {<PerfilEn/>} />
     </NotFound>
     </>
    )
}

export default PerfilL