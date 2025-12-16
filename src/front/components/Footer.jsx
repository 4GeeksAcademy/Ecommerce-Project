import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black text-light  pt-5">
      <div className="container pb-4 ">
        <div className="row gy-4">

          {/* Columna 1: Marca */}
          <div className="col-12 col-md-3">
            <h3 className="fw-bold">
              <Link
                to="/"
                className="text-light text-decoration-none"
              >
                MODA
              </Link>
            </h3>
            <p className="text-secondary mb-0">
              Tu destino para la moda más moderna y elegante.
            </p>
          </div>

          {/* Columna 2: Comprar */}
          <div className="col-6 col-md-3">
            <h5 className="fw-semibold mb-3">Comprar</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <Link
                  to="/mujer"
                  className="text-secondary text-decoration-none"
                >
                  Mujer
                </Link>
              </li>
              <li>
                <Link
                  to="/hombre"
                  className="text-secondary text-decoration-none"
                >
                  Hombre
                </Link>
              </li>
              <li>
                <Link
                  to="/accesorios"
                  className="text-secondary text-decoration-none"
                >
                  Accesorios
                </Link>
              </li>
              <li>
                <Link
                  to="/nuevos-lanzamientos"
                  className="text-secondary text-decoration-none"
                >
                  Nuevos Lanzamientos
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Ayuda */}
          <div className="col-6 col-md-3">
            <h5 className="fw-semibold mb-3">Ayuda</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <Link
                  to="/ayuda/atencion-cliente"
                  className="text-secondary text-decoration-none"
                >
                  Atención al cliente
                </Link>
              </li>
              <li>
                <Link
                  to="/ayuda/envios"
                  className="text-secondary text-decoration-none"
                >
                  Envíos
                </Link>
              </li>
              <li>
                <Link
                  to="/ayuda/devoluciones"
                  className="text-secondary text-decoration-none"
                >
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link
                  to="/ayuda/guia-tallas"
                  className="text-secondary text-decoration-none"
                >
                  Guía de tallas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Síguenos */}
          <div className="col-12 col-md-3">
            <h5 className="fw-semibold mb-3">Síguenos</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary text-decoration-none"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary text-decoration-none"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary text-decoration-none"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary text-decoration-none"
                >
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Línea + derechos */}
      <div className="border-top border-secondary mt-3">
        <div className="container">
          <p className="text-center text-secondary small mb-0 py-3">
            © 2025 MODA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
