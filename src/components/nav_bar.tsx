import { Link } from "react-router-dom"
import { Logeado } from "./perfil_loged"
import { useSelector } from "react-redux";

export const Nav_bar = () => {
  const role = useSelector((state: any) => state.user.role); // Verificamos si el usuario está logueado
  
  return (
    <nav className='Nav_bar'>
      <ul className="Nav_item">
        <li><Link to="/registro">Registrate</Link></li>
        <li>empresas</li>
        <li><Link to="/Feed-ferias">Feed-ferias</Link></li>
        <Logeado/>
        {role == 1 && ( 
          <li><Link to="/plano">herramientas_planos</Link></li>
        )}
      </ul>
    </nav>
  )
}
