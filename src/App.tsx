import { BrowserRouter, Navigate, Route} from 'react-router-dom';
import {AuthGuard} from './guard/auth.guard';
import { NotFound,PrivateRoutes, PublicRoutes } from './models/index';
import { Suspense ,lazy} from 'react';
import { Provider } from 'react-redux';
import {store} from './redux/store';
import { Login, Registro } from './pages/pages.publicas/registro_login/index';
import { ProtectedRoute } from './guard/rol.guard';
import { Perfil_feriante } from './pages/pages.privadas/perfil_feriante/perfil_feriante';
import Vistaplano from './pages/pages.privadas/perfil_encargados/herramientas_planos/vistaplano';
const View_feed = lazy(() => import ('./pages/pages.publicas/feed_ferias/view_feed'));
const Privado = lazy(() => import ('./pages/pages.privadas/perfil_encargados/routes.p_encargado'));


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
              <Route element= {<AuthGuard />}>
                <Route  path={`${PrivateRoutes.PRIVATE}/*`} element= {<Privado/>} />
              </Route>
               <Route path={PrivateRoutes.PERFILADMIN} element={<ProtectedRoute allowedRoles={['administrador']}> <Perfil_feriante /> </ProtectedRoute>}/>
            </NotFound>
          </BrowserRouter>
        </Provider>
      </Suspense>
    </div>

  )


}

  
export default App