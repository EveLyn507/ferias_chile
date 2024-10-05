import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../models";

export const AuthGuard = () => {

    const token = localStorage.getItem('token');
    return token ? <Outlet/> : <Navigate replace to = {PublicRoutes.FEEDFERIAS} /> ;
}


export default AuthGuard