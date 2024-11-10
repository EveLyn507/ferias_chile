import { BrowserRouter, Navigate, Route} from 'react-router-dom';
import { Suspense ,lazy} from 'react';
import { Provider } from 'react-redux';
import {AuthGuard} from './guard/auth.guard';
import store from './redux/store';
import { Nav_bar } from './components';
import { NotFound,PrivateRoutes, PublicRoutes } from './models/index'; // rutas url 
import {  LoginHome, Registro, ResetPassword } from './pages/pages.publicas/registro_y_login/index';
import Vistaplano from './pages/pages.privadas/perfil_encargado/components/herramientas_planos/vistaplano';
import PerfilFeriantes from './pages/pages.privadas/perfil_feriante/perfil_feriante';
import View_detalle_feria from './pages/pages.publicas/feed_ferias/vista_detalle_feria';
import ConfirmPayment from './pages/pages.privadas/perfil_feriante/components/voucher_pago';
import PaymentButton from './pages/pages.privadas/perfil_feriante/components/view_pago';
import FeriaForm from './pages/pages.privadas/perfil_encargado/components/formulario/formulario_feria';
const View_feed = lazy(() => import ('./pages/pages.publicas/feed_ferias/home_feed_feria'));
const Privado = lazy(() => import ('./pages/pages.privadas/Private.routes'));



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
              <Route path={`${PublicRoutes.HERRAMIENTA}`}element = {<Vistaplano/>} />
              <Route path={`${PublicRoutes.FORMFERIA}`}element = {<FeriaForm/>} />
              <Route path={PublicRoutes.LOGIN} element = {<LoginHome/>} />
              <Route path={PublicRoutes.REGISTRO} element = {<Registro/>} />
              <Route path={PublicRoutes.RESETPASSWORD} element = {<ResetPassword/>} />
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