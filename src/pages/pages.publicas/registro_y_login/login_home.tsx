/* eslint-disable react-hooks/exhaustive-deps */
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import LoginEncargado from './components/login_encargado';
import LoginFeriante from './components/login_feriante';
import LoginMunicipal from './components/login_municipal';
import { useEffect } from 'react';
import { clearLocalStorage } from '../../../utilities/localStorage.utilities';
import { resetUser, UserKey } from '../../../redux/states/user';
import { PublicRoutes } from '../../../models';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './css/login.css'

export const LoginHome = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        clearLocalStorage(UserKey);
        dispatch(resetUser());
        navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
    }, []);


    return (
        <div className="login-container">
            <h1>Inicio de Sesion</h1>
            <Tabs>
                <TabList>
                    <Tab>Encargado</Tab>
                    <Tab>Feriante</Tab>
                    <Tab>Municipal</Tab>
                </TabList>

                <TabPanel>
                    <div className="form-card">
                        <LoginEncargado />
                        <a className="switch-form-button" href="/reset-password">Recuperar Contraseña</a>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="form-card">
                        <LoginFeriante />
                        <a className="switch-form-button" href="/reset-password">Recuperar Contraseña</a>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="form-card">
                        <LoginMunicipal />
                        <a className="switch-form-button" href="/reset-password">Recuperar Contraseña</a>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default LoginHome;
