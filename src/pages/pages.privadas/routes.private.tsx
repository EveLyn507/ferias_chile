import { PrivateRoutes } from '../../models/index.ts';
import PerfilEn from './perfil_encargados/perfil_encargado.tsx';
import  {NotFound}  from '../../models/index.ts';
import { Navigate, Route } from 'react-router-dom';
import { Logout } from '../../components/index';
import { Perfil_feriante } from './perfil_feriante/perfil_feriante.tsx';
import { Perfil_admin } from './perfil_muni/perfil_admin.tsx';


function Privado(){

  return (
    <>
     <Logout/>
    <NotFound>
    <Route path='/' element = {<Navigate to={PrivateRoutes.PERFILENCARGADO}/> } />
    <Route  path={PrivateRoutes.PERFILENCARGADO} element= {<PerfilEn/>} />
    <Route path={PrivateRoutes.PERFILFERIANTE} element={<Perfil_feriante />} />
    <Route path={PrivateRoutes.PERFILADMIN} element={<Perfil_admin />} />
    </NotFound>
    </>
   )



} 

export default Privado