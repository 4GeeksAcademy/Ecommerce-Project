import React from "react";
import { Card } from "../components/Card.jsx";

const womenProducts = [
  { id: 1, name: "Producto 1", price: "€77.87", image: "" },
  { id: 2, name: "Producto 2", price: "€136.77", image: "" },
  { id: 3, name: "Producto 3", price: "€79.38", image: "" },
  { id: 4, name: "Producto 4", price: "€113.63", image: "" },
];

const menProducts = [
  { id: 5, name: "Producto 5", price: "€130.25", image: "" },
  { id: 6, name: "Producto 6", price: "€135.79", image: "" },
  { id: 7, name: "Producto 7", price: "€50.14", image: "" },
  { id: 8, name: "Producto 8", price: "€113.77", image: "" },
];

const allProducts = [...womenProducts, ...menProducts];

export const ProductsList = () => {
  return (
    <div className="container-fluid my-4">
      <div className="row">
       
        <aside className="col-12 col-md-3 col-lg-2 mb-4">
          <h5 className="fw-semibold mb-4">Filtros</h5>

          {/* CATEGORÍA */}
          <div className="mb-4">
            <h6 className="small fw-semibold mb-2">Categoría</h6>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="catWomen"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="catWomen">
                Mujer
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="catMen"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="catMen">
                Hombre
              </label>
            </div>
          </div>

          {/* TALLAS */}
          <div className="mb-4">
            <h6 className="small fw-semibold mb-2">Tallas</h6>
            <div className="d-flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  className="btn btn-outline-dark btn-sm"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* COLORES */}
          <div className="mb-4">
            <h6 className="small fw-semibold mb-2">Colores</h6>
            <div className="d-flex flex-wrap gap-2">
              {["#ffffff", "#000000", "#0038a8", "#fbbc05", "#34a853"].map(
                (color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn p-0 border rounded-circle"
                    style={{
                      width: "28px",
                      height: "28px",
                      backgroundColor: color,
                    }}
                  />
                )
              )}
            </div>
          </div>

          {/* PRECIO */}
          <div className="mb-4">
            <h6 className="small fw-semibold mb-2">Precio</h6>
            <input type="range" className="form-range" min="0" max="500" />
            <div className="d-flex justify-content-between small">
              <span>€0</span>
              <span>€500</span>
            </div>
          </div>

          <button className="btn btn-dark w-100 mt-2">Aplicar filtros</button>
        </aside>

        {/* LISTADO DE PRODUCTOS */}
        <section className="col-12 col-md-9 col-lg-10">

     
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <h4 className="mb-2 mb-md-0">Todos los Productos</h4>

            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">Ordenar por</span>
              <select
                className="form-select form-select-sm"
                style={{ maxWidth: "180px" }}
              >
                <option>Más recientes</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
              </select>
            </div>
          </div>

       
          <div className="row g-4">
            {allProducts.map((product) => (
              <div
                key={product.id}
                className="col-6 col-md-4 col-lg-3 d-flex justify-content-center"
              >
                <Card
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};