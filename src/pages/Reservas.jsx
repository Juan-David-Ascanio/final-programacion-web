import React, { useState } from 'react'


export default function Reservas(){
const [mensaje, setMensaje] = useState('')


function handleSubmit(e){
e.preventDefault()
const form = new FormData(e.target)
const nombre = form.get('nombre')
const pelicula = form.get('pelicula')
const cantidad = form.get('cantidad')


setMensaje(`Reserva confirmada para ${nombre} — ${cantidad} boleto(s) para ${pelicula}`)
e.target.reset()
}


return (
<section className="reserva-section">
<h1>🎟 Reserva tus Entradas</h1>
<form onSubmit={handleSubmit} className="reserva-form">
<label htmlFor="nombre">👤 Nombre completo</label>
<input name="nombre" type="text" id="nombre" required placeholder="Ej: Juan Pérez" />


<label htmlFor="pelicula">🎥 Selecciona la película</label>
<select name="pelicula" id="pelicula">
<option>Avatar 2 - 6:00 PM</option>
<option>Avengers: Endgame - 8:30 PM</option>
<option>Joker - 10:00 PM</option>
</select>


<label htmlFor="cantidad">🎫 Cantidad de boletos</label>
<input name="cantidad" type="number" id="cantidad" min="1" max="10" required />


<button type="submit" className="btn">Confirmar Reserva</button>
</form>


<div id="mensaje" className="mensaje">{mensaje}</div>


<footer className="footer">
<p>&copy; 2025 Cine Reservas | Todos los derechos reservados.</p>
</footer>
</section>
)
}