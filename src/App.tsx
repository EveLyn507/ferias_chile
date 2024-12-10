import { BrowserRouter, Navigate, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { AuthGuard } from './guard/auth.guard';
import store from './redux/store';
import { Nav_bar } from './components';
import { NotFound, PrivateRoutes, PublicRoutes } from './models/index'; // rutas url 
import { LoginHome, Registro, ResetPassword } from './pages/pages.publicas/registro_y_login/index';
import PerfilFeriantes from './pages/pages.privadas/perfil_feriante/components/perfil_feriante';
import ConfirmPayment from './pages/pages.privadas/perfil_feriante/components/pagos/voucher_pago';
import PaymentButton from './pages/pages.privadas/perfil_feriante/components/pagos/view_pago';
const View_feed = lazy(() => import ('./pages/pages.publicas/feed_ferias/home_feed_feria'));
const Privado = lazy(() => import ('./pages/pages.privadas/Private.routes'));
import './App.css';
import Footer from './components/footer';
import { ToastProvider } from './components/ToastService'; //npm install react-toastify
import FormularioReserva from './pages/pages.privadas/perfil_feriante/components/supervisor/FormularioReserva';
import View_detalle_feria from './pages/pages.publicas/feed_ferias/vista_detalle_feria';

function App() {
  return (
    <ToastProvider>
    <div className="App">
      <Suspense fallback={<></>}>
        <Provider store={store}>
          <BrowserRouter>
            <Nav_bar />
            <div className="content">
              <NotFound>
                <Route path="/" element={<Navigate to={PublicRoutes.FEEDFERIAS} />} />
                <Route path={PublicRoutes.FEEDFERIAS} element={<View_feed />} />
                <Route path={PublicRoutes.LOGIN} element={<LoginHome />} />
                <Route path={PublicRoutes.REGISTRO} element={<Registro />} />
                <Route path={PublicRoutes.RESETPASSWORD} element={<ResetPassword />} />
                <Route path={PublicRoutes.PAGOS2} element={<PaymentButton />} />
                <Route path={PublicRoutes.DATOSENCARGADO} element={<PerfilFeriantes />} />
                <Route path={`${PublicRoutes.DETALLEFERIA}`} element={<View_detalle_feria />} />
                <Route path={`${PublicRoutes.PAGOOK}`} element={<ConfirmPayment />} />
                <Route path={`${PublicRoutes.RESERVARPUESTO}`} element={<FormularioReserva />} />
                <Route element={<AuthGuard privateValidation={true} />}>
                  <Route path={`${PrivateRoutes.PRIVATE}/*`} element={<Privado />} />
                </Route>
              </NotFound>
            </div>
            <Footer /> 
          </BrowserRouter>
        </Provider>
      </Suspense>
    </div>
    </ToastProvider>
  );
}

export default App;
