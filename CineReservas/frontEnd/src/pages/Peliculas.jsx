import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./../css/Peliculas.css";

export default function Peliculas() {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/peliculas")
      .then(res => res.json())
      .then(data => setPeliculas(data))
      .catch(err => console.error("Error cargando películas", err));
  }, []);

  // Configuración del carrusel (responsive)
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2800,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <>
      <section className="peliculas-section">
        <div className="container">
          <h1 className="titulo-seccion">🍿 Cartelera</h1>
          <p className="subtitulo-seccion">
            Explora los estrenos y reserva tu entrada al instante
          </p>

          <Slider {...settings} className="peliculas-carousel">
            {peliculas.map((m) => (
              <article className="pelicula-card" key={m.id_pelicula}>
                <img src={m.img} alt={m.titulo} />
                <div className="pelicula-info">
                  <h3>{m.titulo}</h3>
                  <p className="descripcion">{m.sinopsis}</p>
                  <span className="horario">⏰ {m.horario || "Consultar"}</span>
                  <Link to="/reservas" className="btn">
                    🎟 Reservar
                  </Link>
                </div>
              </article>
            ))}
          </Slider>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Cine Reservas | Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
