import { Logeado } from "./perfil_loged"

export const Nav_bar = () => {

  
  return (
    <nav className='Nav_bar'>
      <ul className="Nav_item">
        <li><a href="/registro">Registrate</a></li>
        <li>empresas</li>
        <li><a href="/Feed-ferias">Feed-ferias</a></li>
        <Logeado/>
     
      </ul>
    </nav>
  )
}
