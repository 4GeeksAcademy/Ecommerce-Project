import React from "react";
import { Link } from "react-router-dom";

export const ZapatosHombre = () => {
  const zapatos = [
    {
      id: 301,
      name: "Zapatos Oxford",
      price: "€99.99",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    },
    {
      id: 302,
      name: "Zapatillas Urbanas",
      price: "€89.99",
      image: "https://images.unsplash.com/photo-1528701800489-20be3c2ea09e",
    },
    {
      id: 303,
      name: "Botas",
      price: "€119.99",
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
    },
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4">Zapatos</h2>

      <div className="row g-4">
        {zapatos.map((item) => (
          <div key={item.id} className="col-12 col-sm-6 col-md-4">
            <div className="card h-100">
              <img src={item.image} className="card-img-top" alt={item.name} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.price}</p>

                <Link to={`/product/${item.id}`} className="btn btn-dark mt-auto">
                  Ver producto
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};