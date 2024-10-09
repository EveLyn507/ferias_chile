import { BrowserRouter, Navigate, Route} from 'react-router-dom';
import {AuthGuard} from './guard/auth.guard';
import { NotFound,PrivateRoutes, PublicRoutes } from './models/index';
import { Suspense ,lazy} from 'react';
import { Provider } from 'react-redux';
import { Login, Registro } from './pages/pages.publicas/registro_login/index';
import Vistaplano from './pages/pages.privadas/perfil_encargados/herramientas_planos/vistaplano';
import store from './redux/store';
import RoleGuard from './guard/rol.guard';
import { Roles } from './models/rol';
import PerfilEn from './pages/pages.privadas/perfil_encargados/perfil_encargado';
import { Perfil_feriante } from './pages/pages.privadas/perfil_feriante/perfil_feriante';
import { Perfil_admin } from './pages/pages.privadas/perfil_muni/perfil_admin';
const View_feed = lazy(() => import ('./pages/pages.publicas/feed_ferias/view_feed'));
const Privado = lazy(() => import ('./pages/pages.privadas/routes.private'));


function App() {

  return ( 
    <div className="App">
      <Suspense fallback = {<></>}>
        <Provider store={store}>
          <BrowserRouter>
            <NotFound>
              <Route path="/" element = {<Navigate to ={ PrivateRoutes.PRIVATE}/> } />
              <Route path={PublicRoutes.FEEDFERIAS} element = {<View_feed/>} />
              <Route path={PublicRoutes.HERRAMIENTA} element = {<Vistaplano/>} />
              <Route path={PublicRoutes.LOGIN} element = {<Login/>} />
              <Route path={PublicRoutes.REGISTRO} element = {<Registro/>} />
              
              <Route element= {<AuthGuard privateValidation={true} />}>
                <Route  path={`${PrivateRoutes.PRIVATE}/*`} element= {<Privado/>} />
              </Route>

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
          </BrowserRouter>
        </Provider>
      </Suspense>
    </div>

  )


}

  
export default App