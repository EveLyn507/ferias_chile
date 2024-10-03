import { clearLocalStorage } from '../utilities/localStorage.utilities'
import { resetUser, UserKey } from '../redux/states/user'
import {  PublicRoutes } from '../models';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export function Logout() {
    const navigate  = useNavigate();
    const dispatch = useDispatch();
    const logOut = () => {
        clearLocalStorage(UserKey)
        dispatch(resetUser());
        navigate(`/${PublicRoutes.LOGIN}`, {replace : true});

    };

    return (

        <button  onClick={logOut}> Logout</button>
    )
}



