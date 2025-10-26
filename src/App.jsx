import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Peliculas from './pages/Peliculas'
import Reservas from './pages/Reservas'
import Contacto from './pages/Contacto'


export default function App(){
return (
<div className="app-root">
<Header />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/peliculas" element={<Peliculas />} />
<Route path="/reservas" element={<Reservas />} />
<Route path="/contacto" element={<Contacto />} />
{/* Ruta por defecto a Home */}
<Route path="*" element={<Home />} />
</Routes>
</div>
)
}