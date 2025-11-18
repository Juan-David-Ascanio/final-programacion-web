import React from 'react'
import { Link } from 'react-router-dom'
import "./../css/Home.css"

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido al Cine</h1>
          <p>Disfruta de la mejor experiencia de películas y reserva tus entradas en línea fácilmente.</p>

          <div className="hero-buttons">
            <Link to="/peliculas" className="btn">🎟 Ver Cartelera</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>¿Por qué elegirnos?</h2>
        <div className="cards">
          <div className="card">
            <h3>📅 Reserva Online</h3>
            <p>Compra tus boletos sin filas y asegura tu lugar desde casa.</p>
          </div>
          <div className="card">
            <h3>🍿 Experiencia Premium</h3>
            <p>Salas modernas, sonido envolvente y comodidad garantizada.</p>
          </div>
          <div className="card">
            <h3>🎥 Estrenos Exclusivos</h3>
            <p>Accede a las mejores películas el mismo día de estreno.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Cine Reservas | Todos los derechos reservados.</p>
      </footer>
    </>
  )
}
