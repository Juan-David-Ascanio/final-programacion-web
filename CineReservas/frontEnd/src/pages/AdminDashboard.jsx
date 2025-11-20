// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/auth";
import "./../css/AdminDashboard.css";

const API = "http://localhost:3001/api";

const emptyPelicula = {
  titulo: "",
  img: "",
  sinopsis: "",
  duracion: "",
  clasificacion: "",
  genero: "",
  idioma: "",
  estado: "activa",
};

const emptyFuncion = {
  id_pelicula: "",
  id_sala: "",
  fecha: "",
  hora: "",
  precio: "",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = auth.getUser();

  const [peliculas, setPeliculas] = useState([]);
  const [peliculaForm, setPeliculaForm] = useState(emptyPelicula);
  const [peliculaEditId, setPeliculaEditId] = useState(null);

  const [funciones, setFunciones] = useState([]);
  const [funcionForm, setFuncionForm] = useState(emptyFuncion);
  const [funcionEditId, setFuncionEditId] = useState(null);

  const [topPeliculas, setTopPeliculas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const [asientosSala, setAsientosSala] = useState("");


  // Para ver asientos disponibles dinámicamente
    useEffect(() => {
    if (!funcionForm.id_sala) {
      setAsientosSala("");
      return;
    }

    const fetchAsientos = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/asientos/available/${funcionForm.id_sala}`);
        const data = await res.json();

        if (res.ok) {
          setAsientosSala(data.disponibles);
        } else {
          setAsientosSala(""); // sala no encontrada
        }
      } catch (error) {
        setAsientosSala("");
      }
    };

    fetchAsientos();
  }, [funcionForm.id_sala]);


  // Protección extra en el front
  useEffect(() => {
    if (!user || user.rol !== "administrador") {
      navigate("/");
    } else {
      cargarDatos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarDatos = async () => {
    await Promise.all([
      cargarPeliculas(),
      cargarFunciones(),
      cargarTopPeliculas(),
    ]);
  };

  const handleError = (e) => {
    console.error(e);
    setMensaje("Ocurrió un error, revisa la consola.");
  };

  // ======== Películas ========
  const cargarPeliculas = async () => {
    try {
      const res = await fetch(`${API}/peliculas/admin`);
      const data = await res.json();
      setPeliculas(data);
    } catch (e) {
      handleError(e);
    }
  };

  const handleChangePelicula = (e) => {
    const { name, value } = e.target;
    setPeliculaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPelicula = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const method = peliculaEditId ? "PUT" : "POST";
      const url = peliculaEditId
        ? `${API}/peliculas/${peliculaEditId}`
        : `${API}/peliculas`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(peliculaForm),
      });

      const data = await res.json();
      if (!res.ok) {
        setMensaje(data.error || "Error guardando película");
        return;
      }

      setMensaje(data.message || "Película guardada.");
      setPeliculaForm(emptyPelicula);
      setPeliculaEditId(null);
      cargarPeliculas();
    } catch (e) {
      handleError(e);
    }
  };

  const handleEditPelicula = (pelicula) => {
    setPeliculaEditId(pelicula.id_pelicula);
    setPeliculaForm({
      titulo: pelicula.titulo || "",
      img: pelicula.img || "",
      sinopsis: pelicula.sinopsis || "",
      duracion: pelicula.duracion || "",
      clasificacion: pelicula.clasificacion || "",
      genero: pelicula.genero || "",
      idioma: pelicula.idioma || "",
      estado: pelicula.estado || "activa",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Activar / Inactivar usando PUT al mismo endpoint de actualizar
  const handleToggleEstadoPelicula = async (pelicula) => {
    const nuevoEstado = pelicula.estado === "activa" ? "inactiva" : "activa";

    const mensajeConfirmacion =
      nuevoEstado === "inactiva"
        ? "¿Marcar esta película como INACTIVA? No se mostrará en cartelera."
        : "¿Marcar esta película como ACTIVA y mostrarla de nuevo en cartelera?";

    if (!window.confirm(mensajeConfirmacion)) return;

    try {
      const payload = {
        titulo: pelicula.titulo,
        img: pelicula.img,
        sinopsis: pelicula.sinopsis,
        duracion: pelicula.duracion,
        clasificacion: pelicula.clasificacion,
        genero: pelicula.genero,
        idioma: pelicula.idioma,
        estado: nuevoEstado,
      };

      const res = await fetch(`${API}/peliculas/${pelicula.id_pelicula}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(
          data.error || "Error al cambiar el estado de la película"
        );
        return;
      }

      setMensaje(data.message || "Estado de la película actualizado.");
      cargarPeliculas();
    } catch (e) {
      handleError(e);
    }
  };

  const resetPeliculaForm = () => {
    setPeliculaForm(emptyPelicula);
    setPeliculaEditId(null);
  };

  // ======== Funciones (horarios) ========
  const cargarFunciones = async () => {
    try {
      const res = await fetch(`${API}/funciones/admin`);
      const data = await res.json();
      setFunciones(data);
    } catch (e) {
      handleError(e);
    }
  };

  const handleChangeFuncion = (e) => {
    const { name, value } = e.target;
    setFuncionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitFuncion = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const method = funcionEditId ? "PUT" : "POST";
      const url = funcionEditId
        ? `${API}/funciones/${funcionEditId}`
        : `${API}/funciones`;

      const payload = {
        id_pelicula: Number(funcionForm.id_pelicula),
        id_sala: Number(funcionForm.id_sala),
        fecha: funcionForm.fecha,
        hora: funcionForm.hora,
        precio: Number(funcionForm.precio),
      };


      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setMensaje(data.error || "Error guardando función");
        return;
      }

      setMensaje(data.message || "Función guardada.");
      setFuncionForm(emptyFuncion);
      setFuncionEditId(null);
      cargarFunciones();
    } catch (e) {
      handleError(e);
    }
  };

  const handleEditFuncion = (f) => {
    setFuncionEditId(f.id_funcion);
    setFuncionForm({
      id_pelicula: f.id_pelicula,
      id_sala: f.id_sala,
      fecha: f.fecha?.slice(0, 10) || "",
      hora: f.hora || "",
      precio: f.precio || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteFuncion = async (id) => {
    if (!window.confirm("¿Eliminar este horario?")) return;
    try {
      const res = await fetch(`${API}/funciones/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setMensaje(data.error || "Error al eliminar función");
        return;
      }
      setMensaje(data.message || "Función eliminada.");
      cargarFunciones();
    } catch (e) {
      handleError(e);
    }
  };

  const resetFuncionForm = () => {
    setFuncionForm(emptyFuncion);
    setFuncionEditId(null);
  };

  // ======== Estadísticas ========
  const cargarTopPeliculas = async () => {
    try {
      const res = await fetch(`${API}/peliculas/top?limit=5`);
      const data = await res.json();
      setTopPeliculas(data);
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <section className="admin-dashboard">
      <h1 className="admin-title">Panel de administración</h1>
      <p className="admin-subtitle">
        Gestiona películas, horarios y consulta las películas más reservadas.
      </p>

      {mensaje && <div className="admin-message">{mensaje}</div>}

      <div className="admin-columns">
        {/* ==== FORM PELÍCULAS ==== */}
        <div className="admin-card">
          <h2>{peliculaEditId ? "Editar película" : "Nueva película"}</h2>
          <form className="admin-form" onSubmit={handleSubmitPelicula}>
            <label>
              Título
              <input
                type="text"
                name="titulo"
                value={peliculaForm.titulo}
                onChange={handleChangePelicula}
                required
              />
            </label>

            <label>
              Ruta de imagen (ej: /img/Avatar.jpeg)
              <input
                type="text"
                name="img"
                value={peliculaForm.img}
                onChange={handleChangePelicula}
                required
              />
            </label>

            <label>
              Sinopsis
              <textarea
                name="sinopsis"
                value={peliculaForm.sinopsis}
                onChange={handleChangePelicula}
                rows="3"
              />
            </label>

            <div className="admin-row">
              <label>
                Duración (min)
                <input
                  type="number"
                  name="duracion"
                  value={peliculaForm.duracion}
                  onChange={handleChangePelicula}
                />
              </label>

              <label>
                Clasificación
                <input
                  type="text"
                  name="clasificacion"
                  value={peliculaForm.clasificacion}
                  onChange={handleChangePelicula}
                />
              </label>
            </div>

            <div className="admin-row">
              <label>
                Género
                <input
                  type="text"
                  name="genero"
                  value={peliculaForm.genero}
                  onChange={handleChangePelicula}
                />
              </label>

              <label>
                Idioma
                <input
                  type="text"
                  name="idioma"
                  value={peliculaForm.idioma}
                  onChange={handleChangePelicula}
                />
              </label>
            </div>

            <label>
              Estado
              <select
                name="estado"
                value={peliculaForm.estado}
                onChange={handleChangePelicula}
              >
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </label>

            <div className="admin-buttons">
              <button type="submit" className="btn-primary">
                {peliculaEditId ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={resetPeliculaForm}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>

        {/* ==== FORM FUNCIONES ==== */}
        <div className="admin-card">
          <h2>{funcionEditId ? "Editar función" : "Nueva función"}</h2>
          <form className="admin-form" onSubmit={handleSubmitFuncion}>
            <div className="admin-row">
              <label>
                ID Película
                <input
                  type="number"
                  name="id_pelicula"
                  value={funcionForm.id_pelicula}
                  onChange={handleChangeFuncion}
                  required
                />
              </label>

              <label>
                ID Sala
                <input
                  type="number"
                  name="id_sala"
                  value={funcionForm.id_sala}
                  onChange={handleChangeFuncion}
                  required
                />
              </label>
            </div>

            <div className="admin-row">
              <label>
                Fecha
                <input
                  type="date"
                  name="fecha"
                  value={funcionForm.fecha}
                  onChange={handleChangeFuncion}
                  required
                />
              </label>

              <label>
                Hora
                <input
                  type="time"
                  name="hora"
                  value={funcionForm.hora}
                  onChange={handleChangeFuncion}
                  required
                />
              </label>
            </div>

            <div className="admin-row">
              <label>
                Precio
                <input
                  type="number"
                  name="precio"
                  value={funcionForm.precio}
                  onChange={handleChangeFuncion}
                  required
                />
              </label>

              <label>
                Asientos disponibles
                <input
                  type="text"
                  value={asientosSala}
                  readOnly
                />
              </label>
              
            </div>

            <div className="admin-buttons">
              <button type="submit" className="btn-primary">
                {funcionEditId ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={resetFuncionForm}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ==== TABLAS ==== */}
      <div className="admin-tables">
        <div className="admin-card">
          <h2>Películas</h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {peliculas.map((p) => (
                  <tr key={p.id_pelicula}>
                    <td>{p.id_pelicula}</td>
                    <td>{p.titulo}</td>
                    <td>{p.estado}</td>
                    <td>
                      <button
                        onClick={() => handleEditPelicula(p)}
                        className="table-btn"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleEstadoPelicula(p)}
                        className={
                          p.estado === "activa"
                            ? "table-btn table-btn-danger"
                            : "table-btn table-btn-success"
                        }
                      >
                        {p.estado === "activa" ? "Inactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
                {peliculas.length === 0 && (
                  <tr>
                    <td colSpan="4">No hay películas registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <h2>Funciones</h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pelicula</th>
                  <th>Sala</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Precio</th>
                  <th>Asientos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {funciones.map((f) => (
                  <tr key={f.id_funcion}>
                    <td>{f.id_funcion}</td>
                    <td>{f.titulo}</td>
                    <td>{f.nombre_sala}</td>
                    <td>{f.fecha?.slice(0, 10)}</td>
                    <td>{f.hora}</td>
                    <td>{f.precio}</td>
                    <td>{f.asientos_disponibles}</td>
                    <td>
                      <button
                        onClick={() => handleEditFuncion(f)}
                        className="table-btn"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteFuncion(f.id_funcion)}
                        className="table-btn table-btn-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {funciones.length === 0 && (
                  <tr>
                    <td colSpan="8">No hay funciones registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==== ESTADÍSTICAS ==== */}
      <div className="admin-card admin-top">
        <h2>Películas más reservadas</h2>

        {topPeliculas.length === 0 ? (
          <p>No hay reservas registradas aún.</p>
        ) : (
          <table className="ranking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Película</th>
                <th>Reservas</th>
              </tr>
            </thead>
            <tbody>
              {topPeliculas.map((p, index) => (
                <tr key={p.id_pelicula}>
                  <td>{index + 1}</td>
                  <td>{p.titulo}</td>
                  <td>{p.total_reservas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
