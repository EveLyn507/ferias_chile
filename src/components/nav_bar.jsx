import React from 'react'


export const Nav_bar = () => {
  return (
    <nav className='Nav_bar'>
      <ul className="Nav_item">
        <li>Registro</li>
        <li>empresas</li>
        <li><a href="/login">Login</a></li>
      </ul>
    </nav>
  )
}
