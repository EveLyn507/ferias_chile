import { PrivateRoutes } from '../../models/index.ts';
import PerfilEn from './perfil_encargado';
import  {NotFound}  from '../../models/index.ts';
import { Navigate, Route } from 'react-router-dom';
import { Logout } from '../../components/index';
import { Ruta2 } from './herramientas_planos/ruta2';


function PerfilL() {
    return (
     <>
      <Logout/>
     <NotFound>
     <Route path='/' element = {<Navigate to={PrivateRoutes.PERFILENCARGADO}/> } />
     <Route  path={PrivateRoutes.PERFILENCARGADO} element= {<PerfilEn/>} />
     <Route  path={PrivateRoutes.ruta} element= {<Ruta2/>} />
     </NotFound>
     </>
    )
}

export default PerfilL