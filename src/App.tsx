
import { BrowserRouter, Navigate, Route} from 'react-router-dom';
import {AuthGuard} from './guard/auth.guard';
import { NotFound,PrivateRoutes, PublicRoutes } from './models/index';
import { Suspense ,lazy} from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Login } from './components.publicas/registro_login/index';
import { Logout } from './components/index';
const View_feed = lazy(() => import ('./components.publicas/feed_ferias/view_feed'));
const PerfilL = lazy(() => import ('./components.privadas/perfil_encargados/routes.p_encargado'));

function App() {

  return (
    <div className="App">
      <Suspense fallback = {<></>}>
        <Provider store={store}>
          <BrowserRouter>
            <NotFound>
              <Route path="/" element = {<Navigate to ={ PrivateRoutes.PRIVATE}/> } />
              <Route path={PublicRoutes.FEEDFERIAS} element = {<View_feed/>} />
              <Route path={PublicRoutes.LOGIN} element = {<Login/>} />
              <Route element= {<AuthGuard />}>
                <Route  path={`${PrivateRoutes.PRIVATE}/*`} element= {<PerfilL/>} />
              </Route>
            </NotFound>
          </BrowserRouter>
        </Provider>
      </Suspense>
    </div>

  )   


}


export default App
