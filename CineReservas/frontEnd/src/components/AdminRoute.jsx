// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { auth } from "./auth";

export default function AdminRoute({ children }) {
  const user = auth.getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== "administrador") {
    return <Navigate to="/" replace />;
  }

  return children;
}
