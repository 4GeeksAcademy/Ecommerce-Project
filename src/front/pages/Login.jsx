import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("Credenciales inválidas");
        return;
      }

      const data = await res.json();
      const token = data.datos.access_token;
      const user = data.datos.user;

      
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));


dispatch({
  type: "LOGIN_SUCCESS",
  payload: { token, user },
});


      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Error en el servidor");
    }
  };

  return (
    <div className="container">
      <div className="card mt-5 bg-black bg-gradient w-75 mx-auto">
        <h1 className="mt-5 mb-5 text-light text-center">Iniciar Sesión</h1>

        <form className="row gy-3 mx-auto text-center" onSubmit={handleSubmit}>
          <div className="col-6">
            <div className="input-group">
              <div className="input-group-text">@</div>
              <input
                type="text"
                className="form-control"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="col-6">
            <input
              type="password"
              className="form-control"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="col-auto">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="autoSizingCheck" />
              <label htmlFor="autoSizingCheck" className="form-check-label text-light">
                Recuérdame
              </label>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-lg btn-info">
              Enviar
            </button>
          </div>

          <p className="mt-3 link-light text-center">
            ¿No tienes cuenta aún?{" "}
            <Link to="/signup" className="link-info">
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};














//COD ORIGINAL

/*import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("Credenciales inválidas");
        return;
      }

      const data = await res.json();
      const token = data.datos.access_token;
      const user = data.datos.user;

      // Actualizar store
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token, user },
      });

      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Error en el servidor");
    }
  };

  return (
    <div className="container">
      <div className="card mt-5 bg-black bg-gradient w-75 mx-auto">
        <h1 className="mt-5 mb-5 text-light text-center">Iniciar Sesión</h1>

        <form className="row gy-3 mx-auto text-center" onSubmit={handleSubmit}>
          <div className="col-6">
            <div className="input-group">
              <div className="input-group-text">@</div>
              <input
                type="text"
                className="form-control"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="col-6">
            <input
              type="password"
              className="form-control"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="col-auto">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="autoSizingCheck" />
              <label htmlFor="autoSizingCheck" className="form-check-label text-light">
                Recuérdame
              </label>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-lg btn-info">
              Enviar
            </button>
          </div>

          <p className="mt-3 link-light text-center">
            ¿No tienes cuenta aún?{" "}
            <Link to="/signup" className="link-info">
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};*/
