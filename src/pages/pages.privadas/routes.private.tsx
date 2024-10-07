import { Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "../../models";
import {ProtectedRoute} from "../../guard/rol.guard";
import PerfilEn from "./perfil_encargados/perfil_encargado";
import { Perfil_admin } from "./perfil_muni/perfil_admin";
import { Perfil_feriante } from "./perfil_feriante/perfil_feriante";


export const Privado = () => {


<Routes>
<Route path={PrivateRoutes.PERFILENCARGADO} element={ <ProtectedRoute allowedRoles={['encargado']}> <PerfilEn /> </ProtectedRoute>}/>

  <Route path={PrivateRoutes.PERFILFERIANTE} element={ <ProtectedRoute allowedRoles={['feriante']}><Perfil_feriante /></ProtectedRoute>}/>

  <Route path={PrivateRoutes.PERFILADMIN} element={<ProtectedRoute allowedRoles={['administrador']}> <Perfil_admin /> </ProtectedRoute>}/>
  

</Routes>



} 