
import { resetUser } from '../redux/states/user'
import {  PublicRoutes } from '../models';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearLocalStorage, clearSessionStorage } from '../utilities/localStorage.utilities';
import userWebSocketService from '../pages/models/webSoket';
const WebSocketService = userWebSocketService.getInstance();

export function Logout() {
    const navigate  = useNavigate();
    const dispatch = useDispatch();
    const logOut = () => {
        dispatch(resetUser());
        navigate(`/${PublicRoutes.LOGIN}`, {replace : true});
        clearLocalStorage("feriasStatus")
        clearSessionStorage("socketConnected")
    };
    if(WebSocketService){
        WebSocketService.disconnect()
    }


    return (

        <li
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          color: "#000000",
        }}
        onClick={logOut}
      >
        Cerrar Sesión
      </li>
    )
}



