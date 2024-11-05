/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom"
import { Logeado } from "./perfil_loged"
import { useSelector } from "react-redux";

export const Nav_bar = () => {
  const role = useSelector((state: any) => state.user.role); // Verificamos si el usuario está logueado
  
  return (
    <nav className='Nav_bar'>
      <ul className="Nav_item">
      <li>   <Link to={"/pagosss"}>  pago simulado</Link>   </li>  
        <li><Link to="/registro">Registrate</Link></li>
        <li>empresas</li>
        <li><Link to="/Feed-ferias">Feed-ferias</Link></li>
        <li> <Link to='private/1/bancos' >BANCOS</Link></li>
        <Logeado/>
        {role == 1 && ( 
          <li><Link to="/formulario-feria">Crear Feria</Link></li>
        )}
      </ul>
    </nav>
  )
}
