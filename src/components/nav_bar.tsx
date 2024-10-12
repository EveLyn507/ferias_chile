import { Link } from "react-router-dom"
import { Logeado } from "./perfil_loged"

export const Nav_bar = () => {

  
  return (
    <nav className='Nav_bar'>
      <ul className="Nav_item">
        <li><Link to="/registro">Registrate</Link></li>
        <li>empresas</li>
        <li><Link to="/Feed-ferias">Feed-ferias</Link></li>
        <Logeado/>
     
      </ul>
    </nav>
  )
}
