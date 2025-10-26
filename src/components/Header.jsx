import React from 'react'
import { NavLink } from 'react-router-dom'


export default function Header(){
return (
<header className="navbar">
<div className="nav-inner container-wide">
<NavLink to="/" className="brand">
<img src="/img/logo.png" alt="Cine Reservas" className="brand-logo" />
<span className="brand-text">Cine Reservas</span>
</NavLink>


<nav className="nav-links">
<NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Inicio</NavLink>
<NavLink to="/peliculas" className={({isActive}) => isActive ? 'active' : ''}>Películas</NavLink>
<NavLink to="/reservas" className={({isActive}) => isActive ? 'active' : ''}>Reservar</NavLink>
<NavLink to="/contacto" className={({isActive}) => isActive ? 'active' : ''}>Contacto</NavLink>
</nav>
</div>
</header>
)
}