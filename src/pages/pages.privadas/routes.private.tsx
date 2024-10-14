import { PrivateRoutes } from '../../models/index.ts';
import PerfilEn from './perfil_encargados/perfil_encargado.tsx';
import  {NotFound}  from '../../models/index.ts';
import {  Route } from 'react-router-dom';
import { Logout } from '../../components/index';
import { Perfil_admin } from './perfil_muni/perfil_admin.tsx';
import RoleGuard from '../../guard/rol.guard.tsx';
import { Roles } from '../../models/rol.ts';
import Perfil_feriante from './perfil_feriante/perfil_feriante.tsx';
import { Admin_de_feria } from './perfil_encargados/admin_de_feria.tsx';



function Privado(){


  return (
    <>
     <Logout/>
    <NotFound>

    <Route element={<RoleGuard rol={Roles.ENCARGADO} />}>
      <Route path={PrivateRoutes.PERFILENCARGADO} element={<PerfilEn />} />
      <Route path={`${PrivateRoutes.ADMINFERIA}`} element={<Admin_de_feria />} />
    </Route>

    <Route element={<RoleGuard rol={Roles.FERIANTE} />}>
      <Route path={PrivateRoutes.PERFILFERIANTE} element={<Perfil_feriante />} />
    </Route>

    <Route element={<RoleGuard rol={Roles.MUNICIPAL} />}>
      <Route path={PrivateRoutes.PERFILADMIN} element={<Perfil_admin />} />
    </Route>

    </NotFound>
    </>
   )



} 

export default Privado