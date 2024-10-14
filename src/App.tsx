import { BrowserRouter, Navigate, Route} from 'react-router-dom';
import {AuthGuard} from './guard/auth.guard';
import { NotFound,PrivateRoutes, PublicRoutes } from './models/index';
import { Suspense ,lazy} from 'react';
import { Provider } from 'react-redux';
import { Login, Registro } from './pages/pages.publicas/registro_login/index';
import Vistaplano from './pages/pages.privadas/perfil_encargados/herramientas_planos/vistaplano';
import store from './redux/store';
import PerfilFeriantes from './pages/pages.privadas/perfil_feriante/perfil_feriante';
import { View_detalle_feria } from './pages/pages.publicas/feed_ferias';
import { Nav_bar } from './components';
const View_feed = lazy(() => import ('./pages/pages.publicas/feed_ferias/view_feed'));
const Privado = lazy(() => import ('./pages/pages.privadas/routes.private'));
import Flow from './pages/pages.publicas/pagos/pagos';
import PaymentButton from './pages/pages.publicas/feed_ferias/pagos/view_pago';
import ConfirmPayment from './pages/pages.publicas/feed_ferias/pagos/pago_ok';


function App() {

  return ( 
    <div className="App">
      <Suspense fallback = {<></>}>
        <Provider store={store}>
          <BrowserRouter>
          <Nav_bar/>
            <NotFound>
              <Route path="/" element = {<Navigate to ={ PublicRoutes.FEEDFERIAS}/> } />
              <Route path={PublicRoutes.FEEDFERIAS} element = {<View_feed/>} />
              <Route path={PublicRoutes.HERRAMIENTA} element = {<Vistaplano/>} />
              <Route path={PublicRoutes.LOGIN} element = {<Login/>} />
              <Route path={PublicRoutes.PAGOS} element = {<Flow/>} />
              <Route path={PublicRoutes.REGISTRO} element = {<Registro/>} />
              <Route path={PublicRoutes.PAGOS2} element = {<PaymentButton/>} />
              <Route path={PublicRoutes.DATOSENCARGADO} element={<PerfilFeriantes />} />
              <Route path={`${PublicRoutes.DETALLEFERIA}`} element={<View_detalle_feria />} />
              <Route path={`${PublicRoutes.PAGOOK}`} element={<ConfirmPayment />} />
              <Route element= {<AuthGuard privateValidation={true} />}>
                <Route  path={`${PrivateRoutes.PRIVATE}/*`} element= {<Privado/>} />
              </Route>

              

            </NotFound>
          </BrowserRouter>
        </Provider>
      </Suspense>
    </div>

  )


}

  
export default App