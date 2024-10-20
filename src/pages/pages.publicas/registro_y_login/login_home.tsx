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

export const LoginHome = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
          clearLocalStorage(UserKey);
          dispatch(resetUser());
          navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
        }, []);
      
    return(

        <Tabs>
        <TabList>
          <Tab>Encargado</Tab>
          <Tab>feriante</Tab>
          <Tab>Municipal </Tab>
        </TabList>
    
        <TabPanel>
         <LoginEncargado/>
        </TabPanel>
        <TabPanel>
         <LoginFeriante/>
        </TabPanel>
        <TabPanel>
          <LoginMunicipal/>
        </TabPanel>
      </Tabs>
    );

    
    
    

}




export default LoginHome;


