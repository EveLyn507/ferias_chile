import { PrivateRoutes } from '../../models/index.ts';

import  {NotFound}  from '../../models/index.ts';
import {  Route } from 'react-router-dom';
import { Logout } from '../../components/index';
import RoleGuard from '../../guard/rol.guard.tsx';
import { Roles } from '../../models/rol.ts';
import Perfil_feriante from './perfil_feriante/perfil_feriante.tsx';
import { Perfil_admin } from './perfil_muni/home_administrador.tsx';
import { Admin_de_feria } from './perfil_encargado/vista_admin_de_feria.tsx';
import PerfilEn from './perfil_encargado/home_encargado.tsx';
import Bancos_home from './perfil_encargado/components/bancos/bancos_home.tsx';
import { HomeSupervisor } from './perfil_feriante/components/supervisor/homeSupervisor.tsx';
import { HomeTeam } from './perfil_encargado/components/team/homeTeam.tsx';







function Privado(){


  return (
    <>
     <Logout/>
    <NotFound>

    <Route element={<RoleGuard rol={Roles.ENCARGADO} />}>
      <Route path={PrivateRoutes.PERFILENCARGADO} element={<PerfilEn />} />
      <Route path={`${PrivateRoutes.ADMINFERIA}`} element={<Admin_de_feria />} />
      <Route path={PrivateRoutes.BANCOS} element={<Bancos_home />} />
      <Route path={PrivateRoutes.TEAM} element={<HomeTeam />} />
    </Route>

    <Route element={<RoleGuard rol={Roles.FERIANTE} />}>
      <Route path={PrivateRoutes.PERFILFERIANTE} element={<Perfil_feriante />} />
      <Route path={PrivateRoutes.SUPERVISOR} element={< HomeSupervisor/>} />
    </Route>

    <Route element={<RoleGuard rol={Roles.MUNICIPAL} />}>
      <Route path={PrivateRoutes.PERFILADMIN} element={<Perfil_admin />} />
    </Route>

    </NotFound>
    </>
   )



} 

export default Privado