/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { Logeado } from "./perfil_loged";
import { useSelector } from "react-redux";
import { useState } from "react";

export const Nav_bar = () => {
  const role = useSelector((state: any) => state.user.role); 
  const [isOpen, setIsOpen] = useState(false); 
  const handleCloseMenu = () => setIsOpen(false);

  return (
    <nav className='Nav_bar'>
      <div className="Nav_toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰ 
      </div>
      <ul className={`Nav_item ${isOpen ? "active" : ""}`}>
        {!role &&     <li><Link to="/registro" onClick={handleCloseMenu}>Regístrate</Link></li>}
    
        <li><Link to="/Feed-ferias" onClick={handleCloseMenu}>Feed-Ferias</Link></li>
        <Logeado/>
   
      </ul>
    </nav>
  );
};
