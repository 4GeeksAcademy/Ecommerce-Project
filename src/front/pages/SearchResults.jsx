import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const formatCLP = (value) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value);
};

export const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(location.state?.results || []);
  const [term] = useState(location.state?.term || "");
  
  // Estados para los filtros de precio
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const applyFilters = async () => {
    try {
      // Construimos la URL con los parámetros que tu backend ya acepta
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/search?q=${term}`;
      if (minPrice) url += `&min_price=${minPrice}`;
      if (maxPrice) url += `&max_price=${maxPrice}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error filtrando:", error);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
              <li className="breadcrumb-item active">Búsqueda</li>
            </ol>
          </nav>
          <h3>Resultados para: "{term}"</h3>
        </div>
        {/* BOTÓN PARA VOLVER AL HOME */}
        <Link to="/" className="btn btn-outline-dark rounded-pill">
          ← Seguir comprando
        </Link>
      </div>

      <div className="row">
        {/* BARRA LATERAL DE FILTROS */}
        <div className="col-md-3 mb-4">
          <div className="card p-3 shadow-sm border-0">
            <h5 className="mb-3">Filtros</h5>
            <div className="mb-3">
              <label className="form-label small fw-bold">Precio Mínimo ($)</label>
              <input 
                type="number" 
                className="form-control form-control-sm" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)} 
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Precio Máximo ($)</label>
              <input 
                type="number" 
                className="form-control form-control-sm" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
              />
            </div>
            <button className="btn btn-dark btn-sm w-100" onClick={applyFilters}>
              Aplicar Filtros
            </button>
          </div>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="col-md-9">
          <div className="row">
            {results.length > 0 ? (
              results.map((product) => (
                <div className="col-6 col-lg-4 mb-4" key={product.id}>
                  <div 
                    className="card h-100 shadow-sm border-0" 
                    onClick={() => navigate(`/product/${product.id}`)} 
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src={product.gallery && product.gallery.length > 0 ? product.gallery[0].url : null} 
                      className="card-img-top" 
                      alt={product.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <p className="card-title mb-1 text-truncate">{product.name}</p>
                      <p className="fw-bold">{formatCLP(product.base_price)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted">No hay productos que coincidan con estos filtros.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};