import { Navigate } from "react-router-dom";
import { auth } from "./auth";

export default function ProtectedRoute({ children }) {
  const isLogged = auth.isLogged();

  // Si no está logueado, redirige al login
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, muestra el contenido
  return children;
}
