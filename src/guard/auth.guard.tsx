import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../models";

export const AuthGuard = () => {

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
   
    return token && role  ? <Outlet/> : <Navigate replace to = {PublicRoutes.FEEDFERIAS} /> ;
   
   
    
   }
        

export default AuthGuard