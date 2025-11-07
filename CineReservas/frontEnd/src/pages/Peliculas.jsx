import React from 'react'
import { Link } from 'react-router-dom'
import "./../css/Peliculas.css"

const movies = [
{title: 'Avatar 2', img: '/img/Avatar.jpeg', desc: 'Regresa a Pandora con espectaculares efectos visuales y una historia emocionante.', horario: '6:00 PM'},
{title: 'Avengers: Endgame', img: '/img/endgame.jpg', desc: 'Los Vengadores se enfrentan a Thanos en la batalla final por el destino del universo.', horario: '8:30 PM'},
{title: 'Joker', img: '/img/joker.jpg', desc: 'Un retrato oscuro e intenso del origen del icónico villano de Gotham.', horario: '10:00 PM'},
{title: 'El Conjuro: Últimos Ritos', img: '/img/conjuro.jpg', desc: 'Ed y Lorraine Warren se ven envueltos en otro aterrador caso relacionado con misteriosas criaturas.', horario: '12:00 AM'}
]

export default function Peliculas(){
return (
<>
<section className="peliculas-section">
<div className="container">
<h1 className="titulo-seccion">🍿 Cartelera</h1>
<p className="subtitulo-seccion">Explora los estrenos y reserva tu entrada al instante</p>


<div className="peliculas-grid">
{movies.map((m, i) => (
<article className="pelicula-card" key={i}>
<img src={m.img} alt={m.title} />
<div className="pelicula-info">
<h3>{m.title}</h3>
<p className="descripcion">{m.desc}</p>
<span className="horario">⏰ {m.horario}</span>
<Link to="/reservas" className="btn">🎟 Reservar</Link>
</div>
</article>
))}
</div>
</div>
</section>

<footer className="footer">
<p>&copy; 2025 Cine Reservas | Todos los derechos reservados.</p>
</footer>
</>
)
}