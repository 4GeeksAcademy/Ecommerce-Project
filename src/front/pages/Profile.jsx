import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer(); // ahora tienes store y dispatch
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // si no hay token, redirigir al login
    if (!store.auth.accessToken) {
      navigate("/login");
      return;
    }

    //de simulación
    //const isLogged = localStorage.getItem("logged") === "true";
    // const Name = localStorage.getItem("Name");
    //  if (!isLogged) {
    //  navigate("/login");

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.auth.accessToken}`, // Token de autenticación guardado en el store
          },
        });

        if (!res.ok) {
          console.error("Error al obtener perfil");
          return;
        }

        const data = await res.json();
        setProfile(data);

        // actualizar el store con los datos del perfil
        dispatch({ type: "PROFILE_LOADED", payload: data });
      } catch (error) {
        console.error("Error en el servidor", error);
      }
    };

    fetchProfile();
  }, [store.auth.accessToken, navigate, dispatch]);

  if (!store.auth.accessToken) {
    return <p className="text-center text-danger">Debes iniciar sesión para ver tu perfil</p>;
  }

  return (
    <div className="container text-center mt-5 w-100">
      <div className="card bg-dark text-light w-75 mx-auto p-4">
        <h2 className="text-center mb-4">Perfil de Usuario</h2>
        {profile ? (
          <div>
            <p><strong>Nombre:</strong> {profile.name}</p>
            <p><strong>Apellido:</strong> {profile.last_name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        ) : (
          <p className="text-center">Cargando datos del perfil...</p>
        )}
      </div>
    </div>
  );
};
