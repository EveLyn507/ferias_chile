/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";


export function Logeado() {
 
    const token = useSelector((state: any) => state.user.token);
    const role = useSelector((state: any) => state.user.role);

    return (
        token != '' && role != '' ?  <li> <a href={`/private/${role}`}> Perfil  </a>  </li> :   <li><a href="/login">Login</a></li>
    )
    
}


