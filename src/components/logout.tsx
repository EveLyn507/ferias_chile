
import { resetUser } from '../redux/states/user'
import {  PublicRoutes } from '../models';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearLocalStorage } from '../utilities/localStorage.utilities';

export function Logout() {
    const navigate  = useNavigate();
    const dispatch = useDispatch();
    const logOut = () => {
        dispatch(resetUser());
        navigate(`/${PublicRoutes.LOGIN}`, {replace : true});
        clearLocalStorage("feriasStatus")
    };

    return (

        <button  onClick={logOut}> Logout</button>
    )
}



