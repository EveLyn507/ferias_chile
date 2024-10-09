import { PrivateRoutes } from '../../models/index.ts';
import PerfilEn from './perfil_encargados/perfil_encargado.tsx';
import  {NotFound}  from '../../models/index.ts';
import { Navigate, Route } from 'react-router-dom';
import { Logout, Nav_bar } from '../../components/index';
import { Perfil_feriante } from './perfil_feriante/perfil_feriante.tsx';
import { Perfil_admin } from './perfil_muni/perfil_admin.tsx';
import { useSelector } from 'react-redux';
import RoleGuard from '../../guard/rol.guard.tsx';
import { Roles } from '../../models/rol.ts';


function Privado(){

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = useSelector((state: any) => state.user.role);

  return (
    <>
    <Nav_bar/>
     <Logout/>
    <NotFound>
    <Route path='/' element = {<Navigate to={ role}/> } />

    <Route element={<RoleGuard rol={Roles.ENCARGADO} />}>
      <Route path={PrivateRoutes.PERFILENCARGADO} element={<PerfilEn />} />
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